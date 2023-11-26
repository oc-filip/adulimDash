import React from "react";
import Link from 'next/link';
import DataTable from 'react-data-table-component';
import  { useState, useEffect, useMemo } from 'react';
import ArrowDownward from '@material-ui/icons/UnfoldMore';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Snackbar from '@mui/material/Snackbar';



const sortIcon = <ArrowDownward />;



let totalbystatus;
let totalbyrow;


function toDate (date) {
  const thedate = new Date(date);
  return thedate.toLocaleDateString()
}


export default function OrdersTable({totalOrders, totalByStatus}) {
  

  const columns = [
    {
      name: 'Doc Id',
      maxWidth: '80px',
      minWidth: '20px',
      cell: row => <p className="text-blueGray-500 font-bold uppercase"> {row.document_number}</p>,
      selector:  row => row.document_number,
      sortable: false,
    },

    {
      name: 'Doc type',
      maxWidth: '120px',
      center:true,
      cell: row => <p className="text-blueGray-500 font-bold uppercase"> {row.document_type}</p>,
      selector:  row => row.document_type,
      sortable: false,

    },

    {
      name: 'Customer',
      maxWidth: '200px',
      grow: 2,
      cell: row => 
      <div className="flex flex-col"><p className="text-blueGray-500 font-bold uppercase text-xs"> {row.customer_name}</p> <span className="font-normal text-blueGray-500 lowercase"> {row.phone} </span></div>,
      selector: row => row.customer_name,
      sortable: false,
    },
    {
      name: 'date',
      maxWidth: '150px',
      center:true,
      cell: row => 
      <div className="flex flex-col"><p className="text-blueGray-500 font-bold"> {row.document_date} </p></div>,
      selector: row => row.document_date,
      sortable: false,
    },
    {
      name: 'time',
      maxWidth: '150px',
      center:true,
      cell: row => 
      <div className="flex flex-col"><p className="text-blueGray-500 font-bold"> {row.document_time} </p></div>,
      selector: row => row.document_time,
      sortable: false,
    },
/*
    {
      name: 'סוג משלוח',
      maxWidth: '260px',
      center:true,
      cell: row => 
      <div className="flex flex-col">
      {row.shipping_lines && row.shipping_lines?.map(line => {
           return (
            <><p key={line.method_id}className="text-blueGray-500 text-xs"> {line.method_title} </p></>
      )})}
   </div>,
      //selector: row => row.date_created,
      sortable: false,
    },
    
*/



    {
      name: 'Total',
      maxWidth: '120px',
      selector: row => row.amount,
      sortable: false,
      center:true,
      cell: row => <div className="flex flex-col"><p className="font-bold inline-block mt-4 mb-4 text-emerald-500">₪{row.amount} </p></div>,
    },
    {
      right: true,
      //maxWidth: '200px',
      cell: row => <Link href={`/admin/rihvit_orders/${row.document_number}`}>
        <a className="bg-blueGray-600 rounded font-bold text-white uppercase text-xs px-4 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150">View Order</a>
        </Link>,
        
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




  const [menuOpen, setMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectStatus, setSelectStatus] = useState('');
  const [alertType, setAlertType]= useState('error');
  const [alertContent, setAlertContent] = useState('');
  const [active, setActive] = useState('any');
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [total, setTotal] = useState();
  const [type, setType] = useState('any');
  const [pending, setPending] = useState(true);
  const [text, setText] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);

  const countPerPage = 20;

 



  const filterOrders  = async (searchText) =>  {

    setText(searchText);
    if(!searchText){
      setPage(1);
    }
  }

  const handleChange = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
  };

    
    	const handleRowClicked = row => {
    		console.log(`${row.id} was clicked!`);
    	};
    
    	const deleteAll = async () => {
    		const rows = selectedRows.map(r => r.id);
    		
    		if (window.confirm(`Are you sure you want to delete selected rows?`)) {


          deleteOrdersMany(rows)
    			setToggleCleared(!toggleCleared);          
    		}
    	};


      const ChangeStatus = async (selectedStatus) => {
    		const rows = selectedRows.map(r => r.id);

       
        console.log('Status Row selected', rows);
        console.log('Status selected', selectedStatus);
    		
    		if (window.confirm(`Are you sure you want to change selected rows status?`)) {
          changeOrdersStatus(rows, selectedStatus)
    			setToggleCleared(!toggleCleared);    
         
    		}
    	};
     
 // Closing the Alert Message //
 const handleClose = (event, reason) => {
  if (reason === 'clickaway') {
    return;
  }
  setOpen(false);
};
////////////////////////////////


  async function getOrders(page = 1, type = 'any' , text = '') {
  

    if (type === 'any') {
      const res = await fetch(`${process.env.API_URL}/rihvit_orders?page=${page}&per_page=${countPerPage}&text=${text}`);
      const allorders = await res.json();

     setTotal(allorders.total);
      setOrders(allorders.data);
      setPending(false);
      setType(type);

      if (page === 1) {
        setResetPaginationToggle(!resetPaginationToggle);
      }
      console.log('No Status Fetch');

    } else {

      const res = await fetch(`${process.env.API_URL}/rihvit_orders?page=${page}&per_page=${countPerPage}&type=${type}&text=${text}`);
      const allorders = await res.json();

      setTotal(allorders.total);
      setOrders(allorders.data);

      setPending(false);
      setType(type);

      console.log('Status Fetch');

      if (page === 1) {
        setResetPaginationToggle(!resetPaginationToggle);
      }
    }

  }

  useEffect(() => {
    getOrders(page ,type, text); 


    console.log('Use Effect Run');
    
  }, [page,text]);



  

  const contextActions = useMemo(() => {

    return (
      <>
        <label className="mr-1">Change Status</label>
        <select className="mr-1" labelid="status-select-label" id="status-select" label="Status" value={selectStatus} onChange={(e) => ChangeStatus(e.target.value)}>
          <option value="">Bulk Actions</option>
          <option value="completed">Completed</option>
          <option value="processing">Processing</option>
          <option value="on-hold">On Hold</option>
          <option value="trash">Move To Trash</option>
      </select> 
    
    
        <button onClick={deleteAll} className="bg-red-600 active:bg-red-500 text-white font-bold 
          uppercase text-xs px-4 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
          >Delete Selected Rows
        </button>
      </>

      
    );

  }, [orders, selectedRows, toggleCleared]);



  const deleteOrder= async id => {

    if (window.confirm(`Are you sure you want to delete selected order?`)) {

      const res = await fetch(`${process.env.API_URL}/rihvit_orders/${id}`, {
        method: 'DELETE',
      });
    
      const data = await res.json();
      console.log(data);
      getOrders(1,"any","");
      setAlertType('info');
      setAlertContent('Order Moved To Trash');
      setOpen(true);

    }
  }

  const deleteOrdersMany = async ids => {
    const res = await fetch(`${process.env.API_URL}/rihvit_orders/deletemany`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ids), 
    });
  
    const data = await res.json();
    console.log(data);
    getOrders(1,"any","");
    setAlertType('info');
    setAlertContent('Orders Moved To Trash');
    setOpen(true);
  }


    const changeOrdersStatus = async (ids, status )=> {
    const res = await fetch(`${process.env.API_URL}/rihvit_orders/updatestatus`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ids, status}),
    });
  
    const data = await res.json();
    console.log(data);
    getOrders(1,"any","");
    setAlertType('info');
    setAlertContent(data.msg);
    setOpen(true);
    setSelectStatus("");      
  }


  return (
    <>

    
      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
        <Alert severity={alertType} variant="filled">
          <AlertTitle sx={{ marginBottom: 0 }}> <strong>{alertContent}</strong></AlertTitle>
        </Alert>
      </Snackbar>



      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 rounded bg-white"
        }
      >
      
      


      <div className="flex flex-wrap py-2">
        <div className="w-full px-4">
          <nav className="relative flex flex-wrap items-center justify-between navbar-expand-lg rounded">
            <div className="container mx-auto flex flex-wrap items-center justify-between">
              <div className="w-full relative flex justify-between lg:w-auto px-4 lg:static lg:block lg:justify-start">
                <button
                  className="text-black opacity-50 cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
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
                {!pending &&
                <ul className="flex flex-col lg:flex-row list-none lg:mr-auto">

                  <li className="nav-item" onClick={() => setActive('any')}>
                      <button onClick={() => getOrders(1,'any',text)} 
                      type="button" className={active === 'any' ? 'text-blueGray-600 font-bold uppercase text-xs px-2 py-2 outline-none focus:outline-none ease-linear transition-all duration-150' : 
                      'text-blueGray-400 bg-transparent font-bold uppercase text-xs px-2 py-2 outline-none focus:outline-none ease-linear transition-all duration-150'} >All Types ({totalOrders}) </button>
                  </li>


                  {totalByStatus.map(totalby => {
                  return (
                    <li key={totalby._id} className="nav-item" onClick={() => setActive(totalby._id)}>
                      <button onClick={() => getOrders(1,totalby._id, text)} 
                      type="button" className={active === totalby._id ? 'text-blueGray-600 font-bold uppercase text-xs px-2 py-2 outline-none focus:outline-none ease-linear transition-all duration-150' : 
                      'text-blueGray-400 bg-transparent font-bold uppercase text-xs px-2 py-2 outline-none focus:outline-none ease-linear transition-all duration-150'} > Doc.Type {totalby._id} ({totalby.total})</button>
                  </li>

                    )
                  })} 

                </ul>
                }
              </div>
            </div>
          </nav>
        </div>
      </div>


      <div className="flex flex-wrap py-3">
        <div className="w-full px-4">
          <div className="block w-full overflow-x-auto">

          {!pending && <div className="relative flex w-full  mb-3 items-center flex justify-between">
              
              <input onChange={(e) => filterOrders(e.target.value)} type="text" placeholder="Search Orders" className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline lg:w-4/12 pl-10"/>
            
              {active == "trash" && <button onClick={deleteOrdersMany} className="bg-red-600 active:bg-red-500 text-white font-bold uppercase text-xs px-4 py-3 rounded shadow hover:shadow-md outline-none 
                focus:outline-none mr-1 ease-linear transition-all duration-150">Empty Trash</button>
              }
            </div>}


           
 
            <DataTable
            title
              columns={columns}
              data={orders}
              //actions={actionsMemo}
              //actions={actions}
              contextActions={contextActions}
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
    </>
  );
}
