
const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;


const WooCommerce = new WooCommerceRestApi({
    url: process.env.NEXT_PUBLIC_WC_URL,
    consumerKey: process.env.WC_KEY,
    consumerSecret: process.env.WC_SECRET,
    version: "wc/v3"
    //queryStringAuth: true
  });

import Cors from 'cors'

// Initializing the cors middleware
const cors = Cors({
  methods: ['GET', 'HEAD'],
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}


  

  
export default async (req, res) => {
    const { method } = req;

    switch (method) {

        case 'GET':
            try {

                await runMiddleware(req, res, cors)
                const products = await WooCommerce.get("products", {
                    per_page: 10
                });

                res.status(200).json({ success: true,  data: products.data , msg: "Orders Updated"});
                

            } catch (error) {
                res.status(400).json({ success: false , msg: error});
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}
