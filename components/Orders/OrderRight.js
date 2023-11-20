import React from "react";
import fetch from 'isomorphic-unfetch';
import { useState, useEffect} from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Snackbar from '@mui/material/Snackbar';

export default function OrderRight({ order}) {

  let StatusCode;
  let ErrorMessage;
  let orderstatus;

  if(order.status == "completed") {
    orderstatus = "הושלם"
  } else if (order.status == "processing") {
    orderstatus = "בתהליך"
  } else if (order.status == "cancelled") {
    orderstatus = "בוטל"
  } else if (order.status == "pending") {
    orderstatus = "מושהה"
  } else if (order.status == "draft") {
    orderstatus = "טיוטה"
  } else if (order.status == "failed") {
    orderstatus = "failed"
  }

  
  const [open, setOpen] = useState(false);
  const [selectStatus, setSelectStatus] = useState(orderstatus);
  const [alertType, setAlertType]= useState('error');
  const [alertContent, setAlertContent] = useState('');


  const date = new Date(order.date_created);
  const month = date.toLocaleString('he-IL', { month: 'long' });
  const [day, year]       = [date.getDate(), date.getFullYear()];
  const [hour, minutes, seconds] = [date.getHours(), date.getMinutes(), date.getSeconds()];


  const ChangeStatus = async (selectedStatus) => {

    if (window.confirm(`Are you sure you want to change order status?`)) {
        
        changeOrderStatus(order.id, selectedStatus)
 
    }
  };

  const changeOrderStatus = async (id, status )=> {
    const res = await fetch(`${process.env.API_URL}/orders/updatestatusone`, {
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

  // Closing the Alert Message //
 const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      

      <div key={order.id} className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="rounded-t mb-0 px-6 py-3">
          <div className="flex flex-wrap items-center">
            <div className="text-center flex justify-between">
              <h6 className="blueGray-700 text-xl font-bold">
              כללי
              </h6>
            </div>
          </div>
        </div>
        <div className="block w-full flex items-center justify-between overflow-x-auto px-6 py-3">
          <label className="mr-2">תאריך יצירה:</label>
          <p>{month} {day} , {year} @ {hour}:{minutes}</p> 
        </div>    
        <div className="block w-full flex items-center justify-between overflow-x-auto px-6 py-3">
          <label className="mr-2">מצב:</label>
          <p className="mb-1">{selectStatus}</p>
        </div>  
        
        <div className="block w-full flex justify-between overflow-x-auto px-6 py-2">
            <label className="mr-2">Order Key:</label>
            <p className="mb-1">{order.order_key}</p>
        </div>    
        <div className="block w-full flex justify-between overflow-x-auto px-6 py-2">
            <label className="mr-2">מזהה לקוח: </label>
            <p className="mb-1">{order.customer_ip_address}</p>
        </div>  
        <div className="block w-full flex justify-between overflow-x-auto px-6 py-2">
            <label className="mr-2">תשלום באמצעות:</label>
            <p className="mb-1">{order.payment_method_title}</p>
        </div> 
       


      </div>


    


    </>
  );
}


