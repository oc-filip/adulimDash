import dbConnect from '../../../utils/dbConnect';
import Order from '../../../models/order';
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"; 

dbConnect();


const WooCommerce = new WooCommerceRestApi({
    url: process.env.WC_URL,
    consumerKey: process.env.WC_KEY,
    consumerSecret: process.env.WC_SECRET,
    version: "wc/v3",
    queryStringAuth: true
  });


export default async (req, res) => {
    const { method } = req;

    switch (method) {

        case 'PUT':
            try {

               const id = req.body.id;

                 const updateInWc = await fetch(`${process.env.WC_URL}/wp-json/wc/v3/orders/${id}?consumer_secret=${process.env.WC_SECRET}&consumer_key=${process.env.WC_KEY}&status=completed`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                });
           
                res.status(200).json({ success: true, data: updateInWc , msg: "Status changed"});
                

               

            } catch (error) {
                res.status(400).json({ success: false , msg: error});
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}
