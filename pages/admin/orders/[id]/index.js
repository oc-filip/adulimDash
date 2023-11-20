import fetch from 'isomorphic-unfetch';
import OrderRight from "components/Orders/OrderRight.js";
import OrderLeft from "components/Orders/OrderLeft.js";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"; 


const WooCommerce = new WooCommerceRestApi({
    url: process.env.WC_URL,
    consumerKey: process.env.WC_KEY,
    consumerSecret: process.env.WC_SECRET,
    version: "wc/v3",
    queryStringAuth: true
  });

import Admin from "layouts/Admin.js";

export default function  Order ({ order})  {

    return (
       
         <div className="flex flex-wrap">
             <div className="w-full lg:w-4/12 mb-12 px-4 mt-8">
            <OrderRight order={order}  /> 
            </div>
            <div className="w-full lg:w-8/12 mb-12 px-4 mt-8">
            <OrderLeft order={order} />
            </div>
            
            
        </div>
       
    )
}


export const getServerSideProps = async ({ query: { id } }) => {
    const res = await fetch(`${process.env.API_URL}/orders/${id}`);
    const  getorder  = await res.json();
    const  order  = getorder.data;

    //const getnotes = await WooCommerce.get(`orders/${id}/notes`);
    //const  notes  = getnotes.data;

    return {
      props: {
        order
      },
    };
    
  }

Order.layout = Admin;
