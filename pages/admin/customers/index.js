import React from "react";
import fetch from 'isomorphic-unfetch';
import CustomersTable from "components/Customers/CustomersTable.js";

import Admin from "layouts/Admin.js";

export default function  Customers ({ totalCustomers })  {
  return (
    <>

      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <CustomersTable totalCustomers={totalCustomers}/>
        </div>
      </div>
    </>
  );
}


export const getServerSideProps = async () => {
  const res = await fetch(`${process.env.API_URL}/customers/gettotals`);
  const  customers  = await res.json();
  const totalCustomers = customers.total;

  return {
    props: {
      totalCustomers
    },
  };
  
}

Customers.layout = Admin;