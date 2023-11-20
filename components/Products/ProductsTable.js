import React from "react";
import Link from 'next/link';
import DataTable from 'react-data-table-component';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Snackbar from '@mui/material/Snackbar';
import  { useState, useEffect, useMemo} from 'react';

const sortIcon = <ArrowDownward />;





export default function ProductsTable({totalProducts,totalByStatus}) {

  
const columns = [
  // {
  //   name: 'Id',
  //   cell: row => <Link href={`products/${row.id}`}>
  //     <a className="text-blueGray-700 font-bold uppercase"> {row.id}</a>
  //     </Link>,
  //   selector:  row => row.id,
  //   sortable: true,
  // },
  {
    name: 'Name',
    grow: 2,
    selector:  row => row.name,
    sortable: false,
    cell: row => <><p className="border-t-0 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap text-left flex items-center">
      {row.images.length > 0 && (<img src={row.images[0].src} className="h-8 w-8 bg-white rounded-full border" alt="..."></img>)}
              <span className="ml-3 font-bold text-blueGray-600">
                  <Link href={`products/${row.id}`}>
                      <a className="px-4"> {row.name}</a>
                   </Link><br />
              
              </span>
              
              </p></>,
  },
  {
    name: 'Status',
    center:true,
    selector: row => row.status,
    sortable: false,
  },
  {
    name: 'Sku',
    center:true,
    selector: row => row.sku,
    sortable: false,
  },
  {
    name: 'Price',
    center:true,
    selector: row => <div dangerouslySetInnerHTML={{ __html: row.price_html }} />,
    sortable: false,
  },
  {
    name: 'Stock Status',
    center:true,
    selector: row => row.stock_status,
    sortable: false,
    conditionalCellStyles: [
      {
          when: row => row.stock_status === 'instock',
          classNames: ['text-xs font-bold inline-block text-emerald-500'],
      },
      {
        when: row => row.stock_status === 'outofstock',
        classNames: ['text-xs font-bold inline-block text-red-500'],
      }
    ],
  },
  {
    right: true,
    maxWidth: '100px',
    cell: row => <Link href={`products/${row.id}`}>
      <a className="bg-blueGray-700 active:bg-blueGray-600 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150">Edit</a>
      </Link>
  },
  {
    right: true,
    maxWidth: '120px',
    cell: row => <> {row.status !== "trash" ? <button className="bg-red-600 active:bg-red-500 text-white font-bold 
    uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150" 
    onClick={() => deleteProduct(row.id)}>Trash</button> : <button className="bg-red-600 active:bg-red-500 text-white font-bold 
    uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150" 
    onClick={() => deleteProduct(row.id)}>Delete</button>} </>,
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
  const [alertType, setAlertType]= useState('error');
  const [alertContent, setAlertContent] = useState('');
  const [active, setActive] = useState('any');
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [total, setTotal] = useState();
  const [status, setStatus] = useState('any');
  const [pending, setPending] = useState(true);
  const [text, setText] = useState('');
  const [toggleCleared, setToggleCleared] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);


  const countPerPage = 20;


  const filterProducts  = async (searchText) =>  {

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


      deleteProductsMany(rows)
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
  const getProducts = async (page = 1 ,status = 'any' ,text = '') => {

    if(status === 'any') {
      const res = await fetch(`${process.env.API_URL}/products?page=${page}&per_page=${countPerPage}&text=${text}`);
      const  allproducts  = await res.json();

      setTotal(allproducts.total);
      setProducts(allproducts.data);
      setPending(false);
      setStatus(status);

      if(page === 1) {
        setResetPaginationToggle(!resetPaginationToggle);
      }
     

    }else{
    
      const res = await fetch(`${process.env.API_URL}/products?page=${page}&per_page=${countPerPage}&status=${status}&text=${text}`);
      const  allproducts  = await res.json();

      setTotal(allproducts.total);
      setProducts(allproducts.data);
      setPending(false);
      setStatus(status);

      if(page === 1) {
        setResetPaginationToggle(!resetPaginationToggle);
      }
      
      console.log('Fetch with Status');
    }

  }

  useEffect(() => {
    console.log('UseEffect Running');
    getProducts(page,status,text); 
    
  }, [page,text]);



  const contextActions = useMemo(() => {

    return (
        <button onClick={deleteAll} className="bg-red-600 active:bg-red-500 text-white font-bold 
          uppercase text-xs px-4 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
          >Delete Selected Rows
        </button>
    );

  }, [products, selectedRows, toggleCleared]);



  const deleteProduct= async id => {

    if (window.confirm(`Are you sure you want to delete selected product?`)) {

      const res = await fetch(`${process.env.API_URL}/products/${id}`, {
        method: 'DELETE',
      });
    
      const data = await res.json();
      console.log(data);
      getProducts(1,"any","");
      setAlertType('info');
      setAlertContent('Product Moved To Trash');
      setOpen(true);

    }
  }

  const deleteProductsMany = async ids => {
    const res = await fetch(`${process.env.API_URL}/products/deletemany`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ids), 
    });
  
    const data = await res.json();
    console.log(data);
    getProducts(1,"any","");
    setAlertType('info');
    setAlertContent('Products Moved To Trash');
    setOpen(true);
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
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white"
        }
      >
      
      <div className="flex flex-wrap py-2 bg-blueGray-700">
        <div className="w-full px-4">
          <nav className="relative flex flex-wrap items-center justify-between navbar-expand-lg bg-blueGray-500 rounded">
            <div className="container mx-auto flex flex-wrap items-center justify-between">
              <div className="w-full relative flex justify-between lg:w-auto px-4 lg:static lg:block lg:justify-start">
              <h3
                className={
                  "font-semibold text-lg text-white"
                }
              >
                Products
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

                {!pending &&
                <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">

                  <li className="nav-item" onClick={() => setActive('any')}>
                      <button onClick={() => getProducts(1,'any',text)} 
                      type="button" className={active === 'any' ? 'font-bold uppercase text-xs px-4 py-2 rounded outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 text-white bg-transparent border-2 border-solid border-blueGray-700' : 
                      'text-blueGray-500 bg-transparent border-2 border-solid border-blueGray-700 font-bold uppercase text-xs px-4 py-2 rounded outline-none focus:outline-none mr-1 ease-linear transition-all duration-150'} >All ({totalProducts})</button>
                  </li>

                 
                  {totalByStatus.map(totalby => {
                  return (
                    <li key={totalby._id} className="nav-item" onClick={() => setActive(totalby._id)}>
                      <button onClick={() => getProducts(1,totalby._id,text)} 
                      type="button" className={active === totalby._id ? 'font-bold uppercase text-xs px-4 py-2  rounded outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 text-white bg-transparent border-2 border-solid border-blueGray-700 bg-blueGray-700' : 
                      'text-blueGray-500 bg-transparent border-2 border-solid border-blueGray-700 font-bold uppercase text-xs px-4 py-2 rounded outline-none focus:outline-none mr-1 ease-linear transition-all duration-150'} >{totalby._id} ({totalby.total})</button>
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



          <div className="block w-full overflow-x-auto">

            <div className="flex flex-wrap py-3">
              <div className="w-full px-4">
                <div className="block w-full overflow-x-auto">

                {!pending && <div className="relative flex w-full  mb-3 items-center flex justify-between">
                    <span className="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3">
                      <i className="fas fa-search"></i>
                    </span>
                    <input onChange={(e) => filterProducts(e.target.value)} type="text" placeholder="Search Product" className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline lg:w-4/12 pl-10"/>
                              
                  </div>}
          
            <DataTable
            title
            columns={columns}
            data={products}
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
      </div>
    </>
  );
}

