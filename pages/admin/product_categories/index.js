import React from "react";
import fetch from 'isomorphic-unfetch';
import ProductCategoriesTable from "components/ProductCategories/ProductCategoriesTable.js";

import Admin from "layouts/Admin.js";

export default function  ProductCategories ({ totalCategories })  {
  return (
    <>

      <div className="flex flex-wrap ">
        <div className="w-full mb-12 px-4 mt-8">
          <ProductCategoriesTable totalCategories={totalCategories}/>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async () => {
    const res = await fetch(`${process.env.API_URL}/product_categories/gettotals`);
    const  categories  = await res.json();
    const totalCategories = categories.total;
  
    return {
      props: {
        totalCategories
      },
    };
    
  }

  ProductCategories.layout = Admin;