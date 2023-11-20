import React from "react";
import HeaderStats from "components/Headers/HeaderStats.js";

// components

import CardBarChart from "components/Cards/CardBarChart.js";

// layout for page

import Admin from "layouts/Admin.js";


export default function Dashboard({monthStats,monthStatsPrev,monthtotal,monthpickup,monthshipping,monthfailed}) {

  return (
    <>

     <div className="flex flex-wrap">
        <div className="w-full mb-8 mt-8">
         <HeaderStats monthtotal={monthtotal} monthpickup={monthpickup} monthshipping={monthshipping} monthfailed={monthfailed}/>  
        </div>
       </div>
   

      <div className="flex flex-wrap">
        <div className="w-full xl:w-12/12 px-4">
         <CardBarChart monthStats={monthStats} monthStatsPrev={monthStatsPrev}/>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async () => {
  const res = await fetch(`${process.env.API_URL}/orders/get_order_stats_current_year`);
  const totals = await res.json();
  const monthStats = totals.all;


  const res1 = await fetch(`${process.env.API_URL}/orders/get_order_stats_prev_year`);
  const totals1 = await res1.json();
  const monthStatsPrev = totals1.all;

  const res2 = await fetch(`${process.env.API_URL}/orders/get_orders_month`);
  const totals2 = await res2.json();
  const monthtotal = totals2.totalthismonth;

  const res3 = await fetch(`${process.env.API_URL}/orders/get_orders_month_pickup`);
  const totals3 = await res3.json();
  const monthpickup = totals3.totalthismonth;

  const res4 = await fetch(`${process.env.API_URL}/orders/get_orders_month_shipping`);
  const totals4 = await res4.json();
  const monthshipping = totals4.totalthismonth;
  
  const res5 = await fetch(`${process.env.API_URL}/orders/get_orders_month_failed`);
  const totals5 = await res5.json();
  const monthfailed = totals5.totalthismonth;
  
  return {
    props: {
      monthStats,monthStatsPrev,monthtotal,monthpickup,monthshipping,monthfailed
    },
  };
  
}

Dashboard.layout = Admin;
