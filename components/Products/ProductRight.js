import React from "react";
import fetch from 'isomorphic-unfetch';
import { useState} from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Snackbar from '@mui/material/Snackbar';


export default function ProductRight({product}) {

  const [open, setOpen] = useState(false);
  const [alertType, setAlertType]= useState('error');
  const [alertContent, setAlertContent] = useState('');
  const [selectStatus, setSelectStatus] = useState(product.status);
  const [selectVisibility, setSelectVisibility] = useState(product.catalog_visibility);

  const date = new Date(product.date_created);
  const month = date.toLocaleString('default', { month: 'long' });
  const [day, year]       = [date.getDate(), date.getFullYear()];
  const [hour, minutes, seconds] = [date.getHours(), date.getMinutes(), date.getSeconds()];



    const ChangeStatus = async (selectedStatus) => {

        if (window.confirm(`Are you sure you want to change product status?`)) {
            
            changeProductStatus(product.id, selectedStatus)
     
        }
    };

    const changeProductStatus = async (id, status )=> {
        const res = await fetch(`${process.env.API_URL}/products/updatestatus`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({id, status}),
        });
      
        const data = await res.json();
        setAlertType('info');
        setAlertContent(data.msg);
        setOpen(true);
        setSelectStatus(status);      
      }

      const ChangeVisibility = async (selectedVisibility) => {

        if (window.confirm(`Are you sure you want to change product visibility?`)) {
            
          changeProductVisibility(product.id, selectedVisibility)
     
        }
    };
      const changeProductVisibility = async (id, visibility )=> {
        const res = await fetch(`${process.env.API_URL}/products/updatevisibility`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({id, visibility}),
        });
      
        const data = await res.json();
        setAlertType('info');
        setAlertContent(data.msg);
        setOpen(true);
        setSelectVisibility(visibility);      
      }
// Closing the Alert Message //
const handleClose = (event, reason) => {
  if (reason === 'clickaway') {
    return;
  }
  setOpen(false);
};



  return (
    <>

      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
        <Alert severity={alertType} variant="filled">
          <AlertTitle sx={{ marginBottom: 0 }}> <strong>{alertContent}</strong></AlertTitle>
        </Alert>
      </Snackbar>


      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="rounded-t bg-blueGray-700 mb-0 px-6 py-3">
          <div className="flex flex-wrap items-center">
            <div className="text-center flex justify-between">
              <h6 className="text-white text-xl font-bold">
                  Status
              </h6>
            </div>
          </div>
        </div>
        <div className="block w-full flex justify-between overflow-x-auto px-6 py-3">


            <label className="mr-2">Status</label>
                <select className="mb-1" labelid="status-select-label" id="status-select" label="Status" value={selectStatus} onChange={(e) => ChangeStatus(e.target.value)}>
                <option value="publish">Published</option>
                <option value="pending">Pending Review</option>
                <option value="draft">Draft</option>
            </select> 
        </div>

          <div className="block w-full flex justify-between overflow-x-auto px-6 py-3">    
            <label className="mr-2">Visibility</label>
                <select className="mb-1" labelid="visibility-select-label" id="visibility-select" label="Visibility" value={selectVisibility} onChange={(e) => ChangeVisibility(e.target.value)}>
                <option value="visible">Shop and search results</option>
                <option value="catalog">Shop only</option>
                <option value="search">Search results only</option>
                <option value="hidden">Hidden</option>
            </select> 

        </div>    
        <div className="block w-full flex justify-between overflow-x-auto px-6 py-3">    
             <label className="mr-2">Published  on:</label>
            <p className="mb-1"> {month} {day} , {year} at: {hour}:{minutes}</p>
        </div>
      </div>


      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="rounded-t bg-blueGray-700 mb-0 px-6 py-3">
          <div className="flex flex-wrap items-center">
            <div className="text-center flex justify-between">
              <h6 className="text-white text-xl font-bold">
                  Product Image
              </h6>
            </div>
          </div>
        </div>
        <div className="block w-full flex justify-between overflow-x-auto px-6 py-3">

        {product.images.length > 0 && (<img src={product.images[0].src} className="border" alt="..."></img>)} 
        </div>
  
      </div>


      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="rounded-t bg-blueGray-700 mb-0 px-6 py-3">
          <div className="flex flex-wrap items-center">
            <div className="text-center flex justify-between">
              <h6 className="text-white text-xl font-bold">
                  Product Sales
              </h6>
            </div>
          </div>
        </div>
        <div className="block w-full flex justify-between overflow-x-auto px-6 py-3">

        <label className="mr-2">Total Sales</label>
        <p className="mr-2">{product.total_sales}</p>
        </div>
  
      </div>
    </>
  );
}


