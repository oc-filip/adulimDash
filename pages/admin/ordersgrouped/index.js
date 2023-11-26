import React from "react";
import fetch from 'isomorphic-unfetch';
import OrdersGroupedTable from "components/OrdersGrouped/OrdersGroupedTable.js";

import Admin from "layouts/Admin.js";

export default function  OrdersGrouped ({ totalOrders })  {
  return (
    <>

      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <OrdersGroupedTable totalOrders={totalOrders}/>
        </div>
      </div>
    </>
  );
}


export const getServerSideProps = async () => {
  const res = await fetch(`${process.env.API_URL}/ordersgrouped/gettotals`);
  const  orders  = await res.json();
  const totalOrders = orders.total;

  return {
    props: {
      totalOrders
    },
  };
  
}

OrdersGrouped.layout = Admin;
