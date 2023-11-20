import React from "react";
import fetch from 'isomorphic-unfetch';
import ProductsTable from "components/Products/ProductsTable.js";

import Admin from "layouts/Admin.js";

export default function  Products ({ totalProducts , totalByStatus})  {
  return (
    <>

      <div className="flex flex-wrap ">
        <div className="w-full mb-12 px-4 mt-8">
          <ProductsTable totalProducts={totalProducts} totalByStatus={totalByStatus}/>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async () => {

  const res = await fetch(`${process.env.API_URL}/products/gettotals`);
  const  products  = await res.json();
  const totalProducts = products.total;
  const totalByStatus = products.totalByStatus;

  return {
    props: {
      totalProducts,totalByStatus
    },
  };
  
}

Products.layout = Admin;