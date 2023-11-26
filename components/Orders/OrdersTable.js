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

function statusName (rowstatus) { 

  if(rowstatus == "completed") {
    totalbyrow = "הושלם"
  } else if (rowstatus == "processing") {
    totalbyrow = "בתהליך"
  } else if (rowstatus == "cancelled") {
    totalbyrow = "בוטל"
  } else if (rowstatus == "pending") {
    totalbyrow = "מושהה"
  } else if (rowstatus == "draft") {
    totalbyrow = "טיוטה"
  } else if (rowstatus == "failed") {
    totalbyrow = "בכשל"
  } else if (rowstatus == "refunded") {
    totalbyrow = "החזר כספי "
  }  else if (rowstatus == "bit-payment") {
    totalbyrow = "Pending Bit"
  } else if (rowstatus == "trash"){
    totalbyrow = "פח"
  }

  return totalbyrow;
}


export default function OrdersTable({totalOrders, totalByStatus}) {
  

  const columns = [
    {
      name: 'Id',
      maxWidth: '80px',
      minWidth: '20px',
      cell: row => <p className="text-blueGray-500 font-bold uppercase"> {row.id}</p>,
      selector:  row => row.id,
      sortable: false,
    },
    /*
    {
      //name: 'Status',
      maxWidth: '20px',
      center:true,
      selector:  row => row.status,
      sortable: false,
      cell: row => <p className={row.status}><i class="fas fa-circle text-emerald-500 mr-2"></i></p>,

    },
    */
    {
      name: 'status',
      maxWidth: '120px',
      center:true,
      selector:  row => row.status,
      sortable: false,
      conditionalCellStyles: [
        {
            when: row => row.status === 'completed',
            classNames: ['text-xs font-bold inline-block mt-4 mb-4 text-white bg-lightBlue-500 rounded'],
        },
        {
          when: row => row.status === 'trash',
          classNames: ['text-xs font-bold inline-block mt-4 mb-4 text-white bg-red-600 rounded'],
        },
        {
          when: row => row.status === 'pending',
          classNames: ['text-xs font-bold inline-block mt-4 mb-4 text-white bg-orange-500 rounded'],
        },
        {
          when: row => row.status === 'processing',
          classNames: ['text-xs font-bold inline-block mt-4 mb-4 text-white bg-green-500 rounded'],
        },
        {
          when: row => row.status === 'draft',
          classNames: ['text-xs font-bold inline-block mt-4 mb-4 text-white bg-red-600 rounded'],
        },
        {
          when: row => row.status === 'cancelled',
          classNames: ['text-xs font-bold inline-block mt-4 mb-4 text-white bg-CustomGray rounded'], 
        },
        {
          when: row => row.status === 'bit-payment',
          classNames: ['text-xs font-bold inline-block mt-4 mb-4 text-white bg-red-600 rounded'],
        },

        
      ],
    },

    {
      name: 'Customer',
      maxWidth: '260px',
      grow: 2,
      cell: row => 
      <div className="flex flex-col"><p className="text-blueGray-500 font-bold uppercase text-xs">{row.billing.first_name} {row.billing.last_name}</p> <span className="font-normal text-blueGray-500 lowercase"> {row.billing.email} </span></div>,
      selector: row => row.billing.first_name,
      sortable: false,
    },
    {
      name: 'date',
      maxWidth: '150px',
      center:true,
      cell: row => 
      <div className="flex flex-col"><p className="text-blueGray-500 font-bold"> {toDate(row.date_created)} </p></div>,
      selector: row => row.date_created,
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
      selector: row => row.total,
      sortable: false,
      center:true,
      cell: row => <div className="flex flex-col"><p className="font-bold text-emerald-500">₪{row.total} </p></div>,
    },
    {
      right: true,
      //maxWidth: '200px',
      cell: row => <Link href={`/admin/orders/${row.id}`}>
        <a className="bg-blueGray-600 font-bold text-white uppercase text-xs px-4 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150">View Order</a>
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
  const [status, setStatus] = useState('any');
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


  async function getOrders(page = 1, status = 'any' , text = '') {
  

    if (status === 'any') {
      const res = await fetch(`${process.env.API_URL}/orders?page=${page}&per_page=${countPerPage}&text=${text}`);
      const allorders = await res.json();

     setTotal(allorders.total);
      setOrders(allorders.data);
      setPending(false);
      setStatus(status);

      if (page === 1) {
        setResetPaginationToggle(!resetPaginationToggle);
      }
      console.log('No Status Fetch');

    } else {

      const res = await fetch(`${process.env.API_URL}/orders?page=${page}&per_page=${countPerPage}&status=${status}&text=${text}`);
      const allorders = await res.json();

      setTotal(allorders.total);
      setOrders(allorders.data);

      setPending(false);
      setStatus(status);

      console.log('Status Fetch');

      if (page === 1) {
        setResetPaginationToggle(!resetPaginationToggle);
      }
    }

  }

  useEffect(() => {
    getOrders(page ,status, text); 


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

      const res = await fetch(`${process.env.API_URL}/orders/${id}`, {
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
    const res = await fetch(`${process.env.API_URL}/orders/deletemany`, {
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
    const res = await fetch(`${process.env.API_URL}/orders/updatestatus`, {
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
              <div className="w-full relative flex mb-4">
              <h3
                className={
                  "font-semibold text-lg"
                }
              >
                WC Orders
              </h3>
              </div>

              <div className= "lg:flex flex-grow items-center">

               
                {!pending &&
                <ul className="flex flex-col lg:flex-row list-none lg:mr-auto">

                  <li className="nav-item bg-green-500 text-white font-bold uppercase text-xs px-4 py-2 outline-none focus:outline-none ease-linear transition-all duration-150">Filter by Status</li>

                  <li className="nav-item" onClick={() => setActive('any')}>
                      <button onClick={() => getOrders(1,'any',text)} 
                      type="button" className={active === 'any' ? 'text-blueGray-600 font-bold uppercase text-xs px-4 py-2 outline-none focus:outline-none ease-linear transition-all duration-150' : 
                      'text-blueGray-400 bg-transparent font-bold uppercase text-xs px-4 py-2 outline-none focus:outline-none ease-linear transition-all duration-150'} >All ({totalOrders}) </button>
                  </li>


                  {totalByStatus.map(totalby => {
                  return (
                    <li key={totalby._id} className="nav-item" onClick={() => setActive(totalby._id)}>
                      <button onClick={() => getOrders(1,totalby._id, text)} 
                      type="button" className={active === totalby._id ? 'text-blueGray-600 font-bold uppercase text-xs px-4 py-2 outline-none focus:outline-none ease-linear transition-all duration-150' : 
                      'text-blueGray-400 bg-transparent font-bold uppercase text-xs px-4 py-2 outline-none focus:outline-none ease-linear transition-all duration-150'} > {totalby._id} ({totalby.total})</button>
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
