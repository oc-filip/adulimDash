import fetch from 'isomorphic-unfetch';
import ProductRight from "components/Products/ProductRight.js";
import ProductLeft from "components/Products/ProductLeft.js";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"; 


const WooCommerce = new WooCommerceRestApi({
    url: process.env.WC_URL,
    consumerKey: process.env.WC_KEY,
    consumerSecret: process.env.WC_SECRET,
    version: "wc/v3",
    queryStringAuth: true
  });

import Admin from "layouts/Admin.js";

export default function  Product ({ product})  {

    return (
       
        <div className="flex flex-wrap">
             
            <div className="w-full lg:w-8/12 mb-12 px-4 mt-8">
            <ProductLeft product={product}/>
            </div>
            <div className="w-full lg:w-4/12 mb-12 px-4 mt-8">
            {<ProductRight product={product}/> }
            </div>
            
        </div>
       
    )
}

export const getServerSideProps = async ({ query: { id } }) => {
    const res = await fetch(`${process.env.API_URL}/products/${id}`);
    const  getProduct  = await res.json();
    const  product  = getProduct.data;

    return {
      props: {
        product
      },
    };
    
  }

  Product.layout = Admin;