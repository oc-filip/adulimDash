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
      //name: 'Status',
      maxWidth: '20px',
      center:true,
      selector:  row => row.status,
      sortable: true,
      cell: row => <p className={row.status}><i class="fas fa-circle text-emerald-500 mr-2"></i></p>,

    },
    {
      name: 'Id',
      maxWidth: '80px',
      minWidth: '20px',
      cell: row => <p className="text-blueGray-500 uppercase"> {row.id}</p>,
      selector:  row => row.id,
      sortable: true,
    },
    {
      name: 'מספר הזמנה',
      maxWidth: '200px',
      grow: 2,
      cell: row => 
      <div className="flex flex-col"><p className="text-blueGray-500 font-bold uppercase text-xs">{row.billing.first_name} {row.billing.last_name}</p> <span className="font-normal text-blueGray-500 lowercase"> {row.billing.email} </span></div>,
      selector: row => row.billing.first_name,
      sortable: true,
    },
    {
      name: 'תאריך',
      maxWidth: '150px',
      center:true,
      cell: row => 
      <div className="flex flex-col"><p className="text-blueGray-500 text-xs">{row.date_created} </p></div>,
      selector: row => row.date_created,
      sortable: true,
    },

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
      sortable: true,
    },
    



    {
      name: 'סטטוס',
      maxWidth: '120px',
      center:true,
      selector:  row => statusName(row.status),
      sortable: true,
      conditionalCellStyles: [
        {
            when: row => row.status === 'completed',
            classNames: ['text-xs font-bold inline-block mt-2 mb-2 text-lightBlue-600'],
        },
        {
          when: row => row.status === 'trash',
          classNames: ['text-xs font-bold inline-block mt-2 mb-2 text-red-600'],
        },
        {
          when: row => row.status === 'pending',
          classNames: ['text-xs font-bold inline-block mt-2 mb-2 text-orange-500'],
        },
        {
          when: row => row.status === 'processing',
          classNames: ['text-xs font-bold inline-block mt-2 mb-2 text-emerald-600'],
        },
        {
          when: row => row.status === 'draft',
          classNames: ['text-xs font-bold inline-block mt-2 mb-2 text-blueGray-700'],
        },
        {
          when: row => row.status === 'cancelled',
          classNames: ['text-xs font-bold inline-block mt-2 mb-2 text-gray-500'],
        },
      ],
    },
    {
      name: 'סה”כ',
      maxWidth: '120px',
      selector: row => row.total,
      sortable: true,
      center:true,
      cell: row => <div className="flex flex-col"><p className="text-blueGray-500">{row.total} </p></div>,
    },
    {
      right: true,
      //maxWidth: '200px',
      cell: row => <Link href={`/admin/orders/${row.id}`}>
        <a className="bg-CustomGray text-white uppercase text-xs px-4 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"><i class="fas fa-eye ml-2"></i> הצגת הזמנה </a>
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
              <div className="w-full relative flex justify-between lg:w-auto px-4 lg:static lg:block lg:justify-start">
              <h3
                className={
                  "font-semibold text-lg blueGray"
                }
              >
                הזמנות
              </h3>
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
                      type="button" className={active === 'any' ? 'rtltext-blueGray-600 font-bold uppercase text-xs px-4 py-2 outline-none focus:outline-none ease-linear transition-all duration-150' : 
                      'rtl text-blueGray-400 bg-transparent font-bold uppercase text-xs px-4 py-2 outline-none focus:outline-none ease-linear transition-all duration-150'} >({totalOrders}) הכל</button>
                  </li>


                  {totalByStatus.map(totalby => {
                     if(totalby._id == "completed") {
                      totalbystatus = "הושלם"
                    } else if (totalby._id == "processing") {
                      totalbystatus = "בתהליך"
                    } else if (totalby._id == "cancelled") {
                      totalbystatus = "בוטל"
                    } else if (totalby._id == "pending") {
                      totalbystatus = "מושהה"
                    } else if (totalby._id == "draft") {
                      totalbystatus = "טיוטה"
                    } else if (totalby._id == "failed") {
                      totalbystatus = "בכשל"
                    }  else if (totalby._id  == "refunded") {
                      totalbystatus = "החזר כספי "
                    }  else if (totalby._id == "bit-payment") {
                      totalbystatus = "Pending Bit"
                    } else if (totalby._id == "trash") {
                      totalbystatus = "פח"
                    }
                    
                  return (
                    <li key={totalby._id} className="nav-item" onClick={() => setActive(totalby._id)}>
                      <button onClick={() => getOrders(1,totalby._id, text)} 
                      type="button" className={active === totalby._id ? 'rtl text-blueGray-600 font-bold uppercase text-xs px-4 py-2 outline-none focus:outline-none ease-linear transition-all duration-150' : 
                      'rtl text-blueGray-400 bg-transparent font-bold uppercase text-xs px-4 py-2 outline-none focus:outline-none ease-linear transition-all duration-150'} >({totalby.total}) {totalbystatus} </button>
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
              
              <input onChange={(e) => filterOrders(e.target.value)} type="text" placeholder="חיפוש הזמנה" className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline lg:w-4/12 pl-10"/>
            
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
