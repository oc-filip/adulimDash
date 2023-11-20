import React from "react";
import fetch from 'isomorphic-unfetch';

import ProductAttributesTable from "components/ProductAttributes/ProductAttributesTable.js";

import Admin from "layouts/Admin.js";

export default function  ProductAttributes ({ totalAttributes })  {
  return (
    <>

      <div className="flex flex-wrap ">
        <div className="w-full mb-12 px-4 mt-8">
          <ProductAttributesTable totalAttributes={totalAttributes}/>
        </div>
      </div>
    </>
  );
}


export const getServerSideProps = async () => {
    const res = await fetch(`${process.env.API_URL}/product_attributes/gettotals`);
    const  attributes  = await res.json();
    const totalAttributes = attributes.total;
  
    return {
      props: {
        totalAttributes
      },
    };
    
  }

  ProductAttributes.layout = Admin;