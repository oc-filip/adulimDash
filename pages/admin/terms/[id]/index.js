import fetch from 'isomorphic-unfetch';
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"; 
import TermsTable from "components/ProductTerms/TermsTable.js";


const WooCommerce = new WooCommerceRestApi({
    url: process.env.WC_URL,
    consumerKey: process.env.WC_KEY,
    consumerSecret: process.env.WC_SECRET,
    version: "wc/v3",
    queryStringAuth: true
  });

import Admin from "layouts/Admin.js";

export default function  Term ({ term_id, attribute})  {

    return (
       
        <div className="flex flex-wrap">
            <div className="w-full mb-12 px-4 mt-8">
            <TermsTable term_id={term_id} attribute={attribute}/>
            </div>
        </div>
       
    )
}

export const getServerSideProps = async ({ query: { id } }) => {

  const res = await fetch(`${process.env.API_URL}/product_attributes/${id}`);
  const  getAttribute  = await res.json();
  const  attribute  = getAttribute.data;

  

    return {
      props: {
        term_id: id,attribute
      },
    };
    
  }

  Term.layout = Admin;