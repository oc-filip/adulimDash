import React from "react";
import Link from 'next/link';
import DataTable from 'react-data-table-component';
import { useState, useEffect} from 'react';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Snackbar from '@mui/material/Snackbar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import fetch from 'isomorphic-unfetch';

const sortIcon = <ArrowDownward />;


const contextActions = (deleteHandler) => (
  <button onClick={deleteHandler} className="bg-red-600 active:bg-red-500 text-white font-bold 
uppercase text-xs px-4 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150">Delete Selected Rows</button>
);




export default function CustomersTable({totalCustomers}) {

  const [modal, setModal] = useState(false);
  const [editmodal, setEditModal] = useState(false);
  const [formvalues,setFormValues] = useState({});
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType]= useState('error');
  const [alertContent, setAlertContent] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('any');
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [total, setTotal] = useState();
  const [totalRole, setTotalRole] = useState([]);
  const [role, setRole] = useState('any');
  const [pending, setPending] = useState(true);
  const [text, setText] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);

  const countPerPage = 20;

  
const columns = [
  {
    name: 'Customer ID',
    cell: row => <Link href={`customers/${row.customer_id}`}>
      <a className="text-blueGray-700 font-bold uppercase"> {row.customer_id}</a>
      </Link>,
    selector:  row => row.id,
    sortable: false,
  },
  {
    name: 'First Name',
    selector:  row => row.first_name,
    sortable: false,
    cell: row => <div className="flex flex-col"><p className="text-blueGray-500">{row.first_name} </p></div>,
  },
  {
    name: 'Last Name',
    selector: row => row.last_name,
    sortable: false,
    cell: row => <div className="flex flex-col"><p className="text-blueGray-500">{row.last_name} </p></div>,
  },
  {
    name: 'Email',
    minWidth: '240px',
    selector: row => row.email,
    sortable: false,
    cell: row => <div className="flex flex-col"><p className="text-blueGray-500">{row.email} </p></div>,
  },
  {
    name: 'Phone',
    selector: row => row.phone,
    sortable: false,
    cell: row => <div className="flex flex-col"><p className="text-blueGray-500">{row.phone} </p></div>,
  },
  {
    name: 'Phone 2',
    selector: row => row.phone2,
    sortable: false,
    cell: row => <div className="flex flex-col"><p className="text-blueGray-500">{row.phone2} </p></div>,
  },
  {
    right: true,
    maxWidth: '120px',
    cell: row =>
      <button onClick={() => editForm(row)} className="bg-blueGray-700 active:bg-blueGray-600 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150">Edit</button>
      
  },
  {
    right: true,
    maxWidth: '120px',
    cell: row => <button className="bg-red-600 active:bg-red-500 text-white font-bold 
    uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150" 
    onClick={() => deleteUser(row.customer_id)}>Delete
      </button>
  },
];

  const customSort = (rows, selector, direction) => {
    return rows.sort((rowA, rowB) => {

     let aField = selector(rowA)
     let bField = selector(rowB)
   
     let comparison = 0;

     if(!isNaN(aField) || !isNaN(bField)) {
      aField = parseInt(aField);
      bField = parseInt(bField);

     }
   
     if (aField > bField) {
      comparison = 1;
     } else if (aField < bField) {
      comparison = -1;
     }
   
     return direction === 'desc' ? comparison * -1 : comparison;
    });
  };



  const handleModalClose = () => {
    setModal(false);
  };


  const handleEditModalClose = () => {
    setEditModal(false);
  };
  
  // Closing the Alert Message //
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  ////////////////////////////////


  // Fitering Input Action //
  const filterUsers = async (searchText) =>  {

    setText(searchText);
    if(!searchText){
      setPage(1);
    }
  }
  ////////////////////////////////////

  const handleChange = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
  };


  const handleRowClicked = row => {
    console.log(`${row.id} was clicked!`);
  };

  const deleteAll = async () => {
    const rows = selectedRows.map(r => r.id);
    
    if (window.confirm(`Are you sure you want to delete selected rows?`)) {
      deleteUserMany(rows)
      setToggleCleared(!toggleCleared);
    }
  };
    

  async function getCustomers(page = 1,  text= '') {


      const res = await fetch(`${process.env.API_URL}/customers?page=${page}&per_page=${countPerPage}&text=${text}`);
      const allcustomers = await res.json();

      setCustomers(allcustomers.data);
      setPending(false);
      getTotal(role);
      setRole(role);

      if (page === 1) {
        setResetPaginationToggle(!resetPaginationToggle);
      }




  }

  useEffect(() => {
    console.log('UseEffect Running');
    getCustomers(page , text); 
    
  }, [page, text]);


  
  const deleteUser = async id => {

    if (window.confirm(`Are you sure you want to delete selected user?`)) {

      const res = await fetch(`${process.env.API_URL}/customers/${id}`, {
        method: 'DELETE',
      });
    
      const data = await res.json();
      getCustomers(1,"");
      setAlertType('info');
      setAlertContent(data.msg);
      setOpen(true);

    }
  }

  const deleteUserMany = async ids => {
    const res = await fetch(`${process.env.API_URL}/customers/deletemany`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ids), 
    });
  
    const data = await res.json();
    getCustomers(1,"");
    setAlertType('info');
    setAlertContent(data.msg);
    setOpen(true);
  }


  const AddUser = async event => {
    event.preventDefault()

   const first_name = event.target.first_name.value;
   const last_name = event.target.last_name.value;
   const email = event.target.email.value;
   const role = event.target.role.value;
   const username = event.target.username.value;
   const password = event.target.password.value;
   const address_1 = event.target.address_1.value;
   const address_2 = event.target.address_2.value;
   const city = event.target.city.value;
   const postcode = event.target.postcode.value;
   const phone = event.target.phone.value;


   if(first_name == "") {
    setAlertType('error');
    setAlertContent('Add User First Name');
    setOpen(true);
      return
   }

   if(last_name == "") {
    setAlertType('error');
    setAlertContent('Add User Last Name');
    setOpen(true);
      return
   }

   if(email == "") {
    setAlertType('error');
    setAlertContent('Add User Email');
    setOpen(true);
      return
   }

   if(username == "") {
    setAlertType('error');
    setAlertContent('Add User Username');
    setOpen(true);
      return
   }

   if(password == "") {
    setAlertType('error');
    setAlertContent('Add User Password');
    setOpen(true);
      return
   }
    const res = await fetch(`${process.env.API_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: first_name,
        last_name: last_name,
        email: email,
        username: username,
        password: password,
        role: role,      
        address_1: address_1,
        address_2: address_2,
        city: city,
        postcode: postcode,
        phone: phone,

      }), 
    });
  
    const data = await res.json();
    getCustomers(1,"");
    setAlertType('success');
    setAlertContent(data.msg);
    setModal(false);
    setOpen(true);
  }


///////////////////////////////////


const handleInputChange = e => {
  const { name, value } = e.target
  setFormValues({
    [name]: value
  });

}


const editForm = async values => {

console.log('Values',values);
  setFormValues ({
        id: values.id,
        first_name: values.first_name,
        last_name: values.last_name,   
        street: values.street,
        city: values.city, 
        email: values.email,  
        phone: values.phone,
        phone2: values.phone2,
      });
  setEditModal(true);
}

const EditUser = async event => {
  event.preventDefault()

  const id = event.target.id.value;
  const first_name = event.target.first_name.value;
  const last_name = event.target.last_name.value;
  const email = event.target.email.value;
   const street = event.target.street.value;
   const city = event.target.city.value;
   const phone = event.target.phone.value;
   const phone2 = event.target.phone2.value;

 if(first_name == "") {
  setAlertType('error');
  setAlertContent('Add User First Name');
  setOpen(true);

    return
 }

 
 if(last_name == "") {
  setAlertType('error');
  setAlertContent('Add User Last Name');
  setOpen(true);

    return
 }

  const res = await fetch(`${process.env.API_URL}/customers/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      first_name: first_name,
      last_name:  last_name,  
      email: email,
      role: role,      
      address_1: address_1,
      address_2: address_2,
      city: city,
      postcode: postcode,
      phone: phone,  
    }), 
  });

  const data = await res.json();
  console.log(data);
  getCustomers(1,"");
  setAlertType('success');
  setAlertContent('User Updated');
  setEditModal(false);

  setOpen(true);
}

//////////////////////////////////////////////////////

  async function getTotal(role) {

    if (role === 'any') {
      const res = await fetch(`${process.env.API_URL}/customers/gettotals`);
      const totalcustomers = await res.json();
      setTotal(totalcustomers.total);
      //setTotalAll(totallorders.total);
    }
    else {
      const res = await fetch(`${process.env.API_URL}/customers/gettotals?role=${role}`);
      const totalcustomers = await res.json();
      setTotal(totalcustomers.total);

    }


  }


  return (
    <>

    <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
      <Alert severity={alertType} variant="filled">
        <AlertTitle sx={{ marginBottom: 0 }}> <strong>{alertContent}</strong></AlertTitle>
      </Alert>
    </Snackbar>


    <div  className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
      
      
      <div className="flex flex-wrap py-2">
        <div className="w-full px-4">
          <nav className="relative flex flex-wrap items-center justify-between navbar-expand-lg bg-blueGray-500 rounded">
            <div className="container mx-auto flex flex-wrap items-center justify-between">
              <div className="w-full relative flex justify-between lg:w-auto px-4 lg:static lg:block lg:justify-start">
              <h3
                className={
                  "font-semibold text-lg"
                }
              >
                Customers
              </h3>
                <button
                  className="text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
                  type="button"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <i className="fas fa-bars"></i>
                </button>
              </div>
              <div
                className={
                  "lg:flex flex-grow items-center" +
                  (menuOpen ? " flex" : " hidden")
                }
                id="example-navbar-info"
              >

              </div>
            </div>
          </nav>
        </div>
      </div>

      <div className="flex flex-wrap py-3">
        <div className="w-full px-4">
          <div className="block w-full overflow-x-auto">

            {!pending && <div className="relative flex w-full  mb-3 items-center flex justify-between">
                    <span className="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3">
                     
                    </span>
                    <input onChange={(e) => filterUsers(e.target.value)} type="text" placeholder="Search Customers" className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline lg:w-4/12 pl-10"/>
                    <button className="bg-green-500 active:bg-green-500 text-white font-bold 
      uppercase text-xs px-4 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150" onClick={() => setModal(!modal)}>New Customer</button>  

                  </div>}



            <DataTable
            title
              columns={columns}
              data={customers}
              //actions={actionsMemo}
              //actions={actions}
              contextActions={contextActions(deleteAll)}
              sortIcon={sortIcon}
      				//selectableRowsComponent={Checkbox}
              sortFunction={customSort}
              highlightOnHover
              progressPending={pending}
              pagination
              paginationServer
              selectableRows
              paginationTotalRows={total}
              paginationPerPage={countPerPage}
              paginationComponentOptions={{
                noRowsPerPage: true
              }}
              paginationResetDefaultPage={resetPaginationToggle}
              //selectableRowsComponentProps={selectProps}
              onSelectedRowsChange={handleChange}
              clearSelectedRows={toggleCleared}
              onRowClicked={handleRowClicked}
              // onChangePage={handlePageChange}
              //subHeader
              //subHeaderComponent={subHeaderComponentMemo}
              onChangePage={page => setPage(page)}
            />
        </div>
      </div>
      </div>
      </div>

        {/* New User Modal  */}     

        <Dialog open={modal} className="px-4 py-4">
        <DialogTitle className="text-center mb-6">Create New User</DialogTitle>
        <DialogContent>
          <form onSubmit={AddUser}>
            <div className="flex flex-wrap items-center justify-center"> 

              <div className="w-full px-4 lg:w-4/12 mb-6"> 
                <input className="px-3 py-3 placeholder-blueGray-500 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full" 
                type="text" name="first_name" placeholder="First Name" />
              </div>
             
              <div className="w-full px-4 lg:w-4/12 mb-6"> 
                <input className="px-3 py-3 placeholder-blueGray-500 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full" 
                type="text" name="last_name" placeholder="Last Name" />
              </div>
  
              <div className="w-full px-4 lg:w-4/12 mb-6"> 
                <input className="px-3 py-3 placeholder-blueGray-500 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full" 
                type="text" name="email" placeholder="Email" />
              </div>
             
              <div className="w-full px-4 lg:w-4/12 mb-6"> 
                <input className="px-3 py-3 placeholder-blueGray-500 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full" 
                type="text" name="username" placeholder="Username" />
              </div>

              <div className="w-full px-4 lg:w-4/12 mb-6"> 
                <select name="role" className="px-3 py-3 placeholder-blueGray-500 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full" 
                labelid="role-select-label" id="status-select" label="Role">
                    <option value="">Select Role</option>
                    <option value="administrator">Administrator</option>
                    <option value="sap_api">Sap Api</option>
                    <option value="customer">Customer</option>
                    <option value="subscriber">Subscriber</option>
                    <option value="shop_manager">Shop Manager</option>
                    <option value="author">Author</option>
                    <option value="editor">Editor</option>
                </select> 
              </div>

              <div className="w-full px-4 lg:w-4/12 mb-6"> 
                <input className="px-3 py-3 placeholder-blueGray-500 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full" 
                type="password" name="password" placeholder="Password" />
              </div>

              <div className="w-full px-4 lg:w-4/12 mb-6"> 
                <input className="px-3 py-3 placeholder-blueGray-500 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full" 
                type="text" name="address_1" placeholder="Address 1" />
              </div>
             
              <div className="w-full px-4 lg:w-4/12 mb-6"> 
                <input className="px-3 py-3 placeholder-blueGray-500 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full" 
                type="text" name="address_2" placeholder="Address 2" />
              </div>

              <div className="w-full px-4 lg:w-4/12 mb-6"> 
                <input className="px-3 py-3 placeholder-blueGray-500 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full" 
                type="text" name="city" placeholder="City" />
              </div>

              <div className="w-full px-4 lg:w-6/12 mb-6"> 
                <input className="px-3 py-3 placeholder-blueGray-500 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full" 
                type="number" name="postcode" placeholder="Post Code" />
              </div>

              <div className="w-full px-4 lg:w-6/12 mb-6"> 
                <input className="px-3 py-3 placeholder-blueGray-500 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full" 
                type="number" name="phone" placeholder="Phone" />
              </div>

              <div className="w-full lg:w-8/12 xl:w-12/12 px-4">
                <button className="bg-green-500 active:bg-green-500 text-white font-bold 
  uppercase text-xs px-4 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 w-full" type="submit">Save</button>
            </div>



          </div>
         </form>
        </DialogContent>
        <DialogActions>
          <button className="bg-blueGray-700 active:bg-blueGray-600 text-white font-bold 
 uppercase text-xs px-4 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150" onClick={handleModalClose}>Cancel</button>
        </DialogActions>
      </Dialog>


      {/* Edit User Modal  */}     

      <Dialog open={editmodal} className="px-4 py-4">
        <DialogTitle className="text-center mb-6"> Edit User</DialogTitle>
        <DialogContent>
          <form onSubmit={EditUser}>
            <div className="flex flex-wrap items-center justify-center"> 

            <div className="w-full px-4 lg:w-4/12 mb-6"> 
                <input className="px-3 py-3 placeholder-blueGray-500 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full" 
                type="text" name="first_name" placeholder="First Name" onChange={handleInputChange} value={formvalues.first_name}/>
              </div>
             
              <div className="w-full px-4 lg:w-4/12 mb-6"> 
                <input className="px-3 py-3 placeholder-blueGray-500 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full" 
                type="text" name="last_name" placeholder="Last Name" onChange={handleInputChange} value={formvalues.last_name}/>
              </div>
  
              <div className="w-full px-4 lg:w-4/12 mb-6"> 
                <input className="px-3 py-3 placeholder-blueGray-500 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full" 
                type="text" name="email" placeholder="Email" onChange={handleInputChange} value={formvalues.email}/>
              </div>
             
             
              <div className="w-full px-4 lg:w-4/12 mb-6"> 
                <input className="px-3 py-3 placeholder-blueGray-500 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full" 
                type="text" name="address_2" placeholder="Street" onChange={handleInputChange} value={formvalues.street}/>
              </div>

              <div className="w-full px-4 lg:w-4/12 mb-6"> 
                <input className="px-3 py-3 placeholder-blueGray-500 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full" 
                type="text" name="city" placeholder="City" onChange={handleInputChange} value={formvalues.city}/>
              </div>

              <div className="w-full px-4 lg:w-4/12 mb-6"> 
                <input className="px-3 py-3 placeholder-blueGray-500 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full" 
                type="number" name="postcode" placeholder="Phone" onChange={handleInputChange} value={formvalues.phone}/>
              </div>

              <div className="w-full px-4 lg:w-4/12 mb-6"> 
                <input className="px-3 py-3 placeholder-blueGray-500 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full" 
                type="number" name="phone" placeholder="Phone2" onChange={handleInputChange} value={formvalues.phone2}/>
              </div>

              <input type="hidden" name="id" value={formvalues.id}  />

              <div className="w-full lg:w-8/12 xl:w-12/12 px-4">
                <button className="bg-green-500 active:bg-green-500 text-white font-bold 
  uppercase text-xs px-4 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 w-full" type="submit">Save</button>
            </div>
          </div>
         </form>
        </DialogContent>
        <DialogActions>
          <button className="bg-blueGray-700 active:bg-blueGray-600 text-white font-bold 
 uppercase text-xs px-4 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150" onClick={handleEditModalClose}>Cancel</button>
        </DialogActions>
      </Dialog>


    </>
  );
}
