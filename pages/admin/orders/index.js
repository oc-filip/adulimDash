import React from "react";
import fetch from 'isomorphic-unfetch';

import OrdersTable from "components/Orders/OrdersTable.js";

import Admin from "layouts/Admin.js";

export default function  Orders ({totalOrders, totalByStatus})  {
  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full mb-12 px-4 mt-8">
          <OrdersTable totalByStatus={totalByStatus} totalOrders={totalOrders}/>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async () => {
  const res = await fetch(`${process.env.API_URL}/orders/gettotals`);
  const  orders  = await res.json();
  const totalOrders = orders.total;
  const totalByStatus = orders.totalByStatus;

  return {
    props: {
      totalOrders,totalByStatus
    },
  };
  
}


Orders.layout = Admin;