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


export default function ProductAttributesTable({totalAttributes}) {

  // Global States //  
  const [modal, setModal] = useState(false);
  const [editmodal, setEditModal] = useState(false);
  const [formvalues,setFormValues] = useState({});
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType]= useState('error');
  const [alertContent, setAlertContent] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [attributes, setAttributes] = useState([]);
  const [page, setPage] = useState(1);
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [total, setTotal] = useState();
  const [pending, setPending] = useState(true);
  const [text, setText] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);

  const countPerPage = 20;
 
  const columns = [
    {
      name: 'Id',
      maxWidth: '40px',
      cell: row => <a className="text-blueGray-700 uppercase"> {row.id}</a>,
      selector:  row => row.id,
      sortable: true,
    },
    {
      name: 'Name',
      grow: 2,
      cell: row => 
      <p className="text-blueGray-600 font-bold uppercase"> {row.name}</p>
      ,
      selector:  row => row.name,
      sortable: true
    },
    {
      name: 'Slug',
      center: true,
      cell: row => 
      <p> { row.slug.replace("pa_", "")}</p>,
      selector: row => row.slug,
      sortable: true,
    },
    {
      name: 'Sort Order',
      center: true,
      selector: row => row.order_by,
      sortable: true,
    },
    {
      right: true,
      maxWidth: '120px',
      cell: row => <Link href={`terms/${row.id}`}>
        <a className="bg-green-500 active:bg-blueGray-600 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150">Terms</a>
        </Link>
    },
    {
      right: true,
      maxWidth: '100px',
      cell: row =>
        <button onClick={() => editForm(row)} className="bg-blueGray-700 active:bg-blueGray-600 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150">Edit</button>
        
    },
    {
      right: true,
      maxWidth: '120px',
      cell: row => <button className="bg-red-600 active:bg-red-500 text-white font-bold 
      uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150" 
      onClick={() => deleteAttr(row.id)}>Delete
        </button>
    },
  ];

  const deleteAttr = async id => {

    if (window.confirm(`Are you sure you want to delete selected attribute?`)) {

      const res = await fetch(`${process.env.API_URL}/product_attributes/${id}`, {
        method: 'DELETE',
      });
    
      const data = await res.json();
      console.log(data);
      getAttributes(1,"")
      setAlertType('info');
      setAlertContent('Attribute Deleted');
      setOpen(true);

    }
  }

  const deleteAttrMany = async ids => {
    const res = await fetch(`${process.env.API_URL}/product_attributes/deletemany`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ids), 
    });
  
    const data = await res.json();
    console.log(data);
    getAttributes(1,"");
    setAlertType('info');
    setAlertContent('Attributes Deleted');
    setOpen(true);
  }


  const AddAttribute = async event => {
    event.preventDefault()

   const name = event.target.name.value;
   const slug = event.target.slug.value;

   if(name == "") {
    setAlertType('error');
    setAlertContent('Add Attribute Name');
    setOpen(true);

      return
   }

   
   if(slug == "") {
    setAlertType('error');
    setAlertContent('Add Attribute Slug');
    setOpen(true);

      return
   }

    const res = await fetch(`${process.env.API_URL}/product_attributes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name:name,
        slug: slug,      
      }), 
    });
  
    const data = await res.json();
    console.log(data);
    getAttributes(1,"");
    setAlertType('success');
    setAlertContent('Attribute Created');
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

  const decodedslug = decodeURI(values.slug);
  const new_slug = decodedslug.replace("pa_", "")

  setFormValues ({
        id: values.id,
        name: values.name,
        slug: new_slug,      
      });
  setEditModal(true);
}

const EditAttribute = async event => {
  event.preventDefault()

  const id = event.target.id.value;
  const name = event.target.name.value;
  const slug = event.target.slug.value;


 if(name == "") {
  setAlertType('error');
  setAlertContent('Add Attribute Name');
  setOpen(true);

    return
 }

 
 if(slug == "") {
  setAlertType('error');
  setAlertContent('Add Attribute Slug');
  setOpen(true);

    return
 }

  const res = await fetch(`${process.env.API_URL}/product_attributes`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id:id,
      name:name,
      slug: slug,    
    }), 
  });

  const data = await res.json();
  console.log(data);
  getAttributes(1,"");
  setAlertType('success');
  setAlertContent('Attribute Updated');
  setEditModal(false);

  setOpen(true);
}

///////////////////////////
  

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
    console.log('Modal Closed');

    setModal(false);
  };


  const handleEditModalClose = () => {
    console.log('Modal Closed');

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
  const filterAttributes = async (searchText) =>  {

    setText(searchText);
    if(!searchText){
      setPage(1);
    }
  }
  ////////////////////////////////////


  const handleChange = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
    console.log('selected rows', selectedRows)
  };

    
    	const handleRowClicked = row => {
    		
    		console.log(`${row.id} was clicked!`);
    	};
    
    	const deleteAll = async () => {
    		const rows = selectedRows.map(r => r.id);
    		
    		if (window.confirm(`Are you sure you want to delete selected rows?`)) {


            deleteAttrMany(rows)
    			setToggleCleared(!toggleCleared);
          
    		}
    	};


  async function getAttributes(page = 1, text = '') {

      const res = await fetch(`${process.env.API_URL}/product_attributes?page=${page}&per_page=${countPerPage}&text=${text}`);
      const allattributes = await res.json();

      setTotal(allattributes.total);
      setAttributes(allattributes.data);
      setPending(false);

      if (page === 1) {
        setResetPaginationToggle(!resetPaginationToggle);
      }

  }


  useEffect(() => {
    console.log('UseEffect Running');
    getAttributes(page, text); 
    
  }, [page,text]);


  return (
    <>

      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
        <Alert severity={alertType} variant="filled">
          <AlertTitle sx={{ marginBottom: 0 }}> <strong>{alertContent}</strong></AlertTitle>
        </Alert>
      </Snackbar>



      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white"
        }
      >
      
      


      <div className="flex flex-wrap py-3 bg-blueGray-700">
        <div className="w-full px-4">
          <nav className="relative flex flex-wrap items-center justify-between navbar-expand-lg bg-blueGray-500 rounded">
            <div className="container mx-auto flex flex-wrap items-center justify-between">
              <div className="w-full relative flex justify-between lg:w-auto px-4 lg:static lg:block lg:justify-start">
              <h3
                className={
                  "font-semibold text-lg text-white"
                }
              >
                Product Attributes
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
                <i className="fas fa-search"></i>
              </span>
              <input onChange={(e) => filterAttributes(e.target.value)} type="text" placeholder="Search Attributes" className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline lg:w-4/12 pl-10"/>
              <button className="bg-green-500 active:bg-green-500 text-white font-bold 
 uppercase text-xs px-4 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150" onClick={() => setModal(!modal)}>Add New Attribute</button>  

            </div>}


            <DataTable
            title
              columns={columns}
              data={attributes}
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

       {/* New Attrubute Modal  */}     

      <Dialog open={modal} className="px-4 py-4">
        <DialogTitle className="text-center mb-6">Create New Product Attribute</DialogTitle>
        <DialogContent>
          <form onSubmit={AddAttribute}>
            <div className="flex flex-wrap items-center justify-center"> 
              <div className="w-full lg:w-8/12 xl:w-12/12 px-4 mb-6"> 
                <input className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full pl-10" type="text" name="name" placeholder="Name"/>
              </div>
              <div className="w-full lg:w-8/12 xl:w-12/12 px-4 mb-6">
               <input className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full pl-10" type="text" name="slug" placeholder="Slug"/>
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


      {/* Edit Attrubute Modal  */}     

      <Dialog open={editmodal} className="px-4 py-4">
        <DialogTitle className="text-center mb-6"> Edit Product Attribute</DialogTitle>
        <DialogContent>
          <form onSubmit={EditAttribute}>
            <div className="flex flex-wrap items-center justify-center"> 
              <div className="w-full lg:w-8/12 xl:w-12/12 px-4 mb-6"> 
                <input onChange={handleInputChange} value={formvalues.name}  className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full pl-10" type="text" name="name" placeholder="Name"/>
              </div>
              <div className="w-full lg:w-8/12 xl:w-12/12 px-4 mb-6">
               <input onChange={handleInputChange} value={formvalues.slug}  className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full pl-10" type="text" name="slug" placeholder="Slug"/>
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
