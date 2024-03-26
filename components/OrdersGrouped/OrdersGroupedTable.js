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
import { CSVLink } from "react-csv";

const sortIcon = <ArrowDownward />;


const headers = [
  { label: "UserID", key: "UserID" },
  { label: "CustomerName", key:"LastOrder.customer_name"},
  { label: "NumOfOrders", key: "NumOfOrders" },
  { label: "LastOrderDate", key: "LastOrderDate" },
  { label: "NextOrderDate", key: "NextOrderDate" },
  { label: "AverageFrequency", key: "AverageFrequency" },
  { label: "PipedriveID", key: "pipedrive_id" },
  { label: "Reccuring", key: "reccuring" }
];



function toDate (date) {
  const thedate = new Date(date);
  return thedate.toLocaleDateString()
}
//////////////////////////////////////////////////



const Export = ({ onExport }) => <button onClick={e => onExport(e.target.value)}>Export</button>;





////////////////////////////////
const contextActions = (deleteHandler) => (
  <button onClick={deleteHandler} className="bg-red-600 active:bg-red-500 text-white font-bold 
uppercase text-xs px-4 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150">Delete Selected Rows</button>
);




export default function OrdersGroupedTable({totalOrders}) {

  const [modal, setModal] = useState(false);
  const [editmodal, setEditModal] = useState(false);
  const [formvalues,setFormValues] = useState({});
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType]= useState('error');
  const [alertContent, setAlertContent] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('any');
  const [persons, setPersons] = useState([]);
  const [csv, setCsv] = useState([]);
  const [csvfilename,setCsvFileName] = useState('');
  const [page, setPage] = useState(1);
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [total, setTotal] = useState();
  const [totalRole, setTotalRole] = useState([]);
  const [role, setRole] = useState('any');
  const [pending, setPending] = useState(true);
  const [pendingcsv, setPendingCsv] = useState(true);

  const [text, setText] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);

  const countPerPage = 20;

  
const columns = [
  {
    name: 'User ID',
    cell: row => <Link href={`https://invoice.rivhit.co.il/DocumentCopies.aspx?Customer=${row.UserID}`}>
      <a className="text-blueGray-700 font-bold uppercase"> {row.UserID}</a>
      </Link>,
    selector:  row => row.UserID,
    sortable: true,
  },
   {
    name: 'Customer Name',
    cell: row => <div className="flex flex-col"><p className="text-blueGray-500">{row.LastOrder.customer_name} </p></div>,
    selector:  row => row.LastOrder.customer_name,
    sortable: true,
  },
  {
    name: 'Last Order Date',
    selector:  row => row.LastOrderDate,
    sortable: true,
    cell: row => <div className="flex flex-col"><p className="text-blueGray-500">{toDate(row.LastOrderDate)} </p></div>,
  },
  {
    name: 'Next Order Date',
    selector:  row => row.NextOrderDate,
    sortable: true,
    cell: row => <div className="flex flex-col"><p className="text-blueGray-500">{toDate(row.NextOrderDate)} </p></div>,
  },
  {
    name: 'Total Orders',
    selector:  row => row.NumOfOrders,
    sortable: true,
    cell: row => <div className="flex flex-col"><p className="text-blueGray-500">{row.NumOfOrders} </p></div>,
  },

  {
    name: 'Avg Days',
    selector: row => row.AverageFrequency,
    sortable: true,
    cell: row => <div className="flex flex-col"><p className="text-blueGray-500">{row.AverageFrequency} </p></div>,
  },
  {
    name: 'Last5 Avg',
    selector: row => row.Last5Avg,
    sortable: true,
    cell: row => <div className="flex flex-col"><p className="text-blueGray-500">{row.Last5Avg} </p></div>,
  },
  {
    name: 'Pipedrive ID',
    selector: row => row.pipedrive_id,
    sortable: true,
    cell: row => <Link href={`https://adulim.pipedrive.com/person/${row.pipedrive_id}`}>
      <a className="text-blueGray-700 font-bold uppercase"> {row.pipedrive_id}</a>
      </Link>
  },
  /*
  {
    right: true,
    maxWidth: '120px',
    cell: row =>
      <button onClick={() => editForm(row)} className="bg-blueGray-700 active:bg-blueGray-600 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150">Edit</button>
      
  },*/
  {
    right: true,
    maxWidth: '120px',
    cell: row => <button className="bg-red-600 active:bg-red-500 text-white font-bold 
    uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150" 
    onClick={() => deleteUser(row.UserID)}>Delete
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

//////////////////////////////////////////////////




/////////////////////////////////////////////////////

  const handleModalClose = () => {
    setModal(false);
    setPendingCsv(true);
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


      const res = await fetch(`${process.env.API_URL}/ordersgrouped?page=${page}&per_page=${countPerPage}&text=${text}`);
      const allcustomers = await res.json();

      setPersons(allcustomers.data);
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

      const res = await fetch(`${process.env.API_URL}/ordersgrouped/${id}`, {
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
    const res = await fetch(`${process.env.API_URL}/ordersgrouped/deletemany`, {
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


  const GetCsv = async event => {
    event.preventDefault()

   const to = event.target.to.value;
   const from = event.target.from.value;

   const csvfilename = 'Orders-' + from +'-'+ to
   setCsvFileName(csvfilename);


   if(from == "") {
    setAlertType('error');
    setAlertContent('Select From Date');
    setOpen(true);
      return
   }

   if(to == "") {
    setAlertType('error');
    setAlertContent('Select To Date');
    setOpen(true);
      return
   }



    const res = await fetch(`${process.env.API_URL}/ordersgrouped/get_csv`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: from,
        to: to,

      }), 
    });
  
    const data = await res.json();
    //getCustomers(1,"");
    //setPersons(data.data);
    setCsv(data.data);
    setAlertType('success');
    setAlertContent(data.msg);
    //setModal(false);
    setPendingCsv(false)
    setOpen(true);
  }


///////////////////////////////////


const handleInputChange = e => {
  const { name, value } = e.target
  setFormValues({
    [name]: value
  });

}


//////////////////////////////////////////////////////

  async function getTotal(role) {

    if (role === 'any') {
      const res = await fetch(`${process.env.API_URL}/ordersgrouped/gettotals`);
      const totalcustomers = await res.json();
      setTotal(totalcustomers.total);
      //setTotalAll(totallorders.total);
    }
    else {
      const res = await fetch(`${process.env.API_URL}/ordersgrouped/gettotals?role=${role}`);
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
            <div className="container  flex flex-wrap items-center justify-between">
              <div className="w-full relative flex justify-between lg:w-auto px-4 lg:static lg:block lg:justify-start">
              <h3
                className={
                  "font-semibold text-lg"
                }
              >
                Client/Orders
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
                    <input onChange={(e) => filterUsers(e.target.value)} type="text" placeholder="Search Orders" className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline lg:w-4/12 pl-10"/>
                    <button className="bg-green-500 active:bg-green-500 text-white font-bold 
 uppercase text-xs px-4 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150" onClick={() => setModal(!modal)}>Download CSV</button>  
                  </div>}



            <DataTable
            title
              columns={columns}
              data={persons}
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
        <DialogTitle className="text-center mb-6">Filter By Date</DialogTitle>
        <DialogContent>
          <form onSubmit={GetCsv}>
            <div className="flex flex-wrap items-center justify-center"> 

              <div className="w-full px-4 lg:w-6/12 mb-6"> 
                <input className="px-3 py-3 placeholder-blueGray-500 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full" 
                type="date" name="from" placeholder="From" />
              </div>
             
              <div className="w-full px-4 lg:w-6/12 mb-6"> 
                <input className="px-3 py-3 placeholder-blueGray-500 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full" 
                type="date" name="to" placeholder="To" />
              </div>
  

              {pendingcsv &&  <div className="w-full lg:w-8/12 xl:w-12/12 px-4">
                <button className="bg-green-500 active:bg-green-500 text-white text-center block font-bold 
  uppercase text-xs px-4 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 w-full" type="submit">Filter</button>
            </div>}


            
            {!pendingcsv &&  <div className="w-full lg:w-8/12 xl:w-12/12 px-4">
              <CSVLink filename={csvfilename} className="bg-green-500 active:bg-green-500 text-white text-center block font-bold 
  uppercase text-xs px-4 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 w-full" data={csv} headers={headers}>
              Download
            </CSVLink></div>}


          </div>
         </form>
        </DialogContent>
        <DialogActions>
          <button className="bg-blueGray-700 active:bg-blueGray-600 text-white font-bold 
 uppercase text-xs px-4 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150" onClick={handleModalClose}>Cancel</button>
        </DialogActions>
      </Dialog>

    </>
  );
}
