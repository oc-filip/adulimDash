import dbConnect from '../../../utils/dbConnect';
import Order from '../../../models/order';

dbConnect();

import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"; 

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
  
               const ids = req.body.ids;
               const status = req.body.status;


               const updateArr = ids.map(id => {    
                 return  {id:id , status:status}
               }); 
               
                const UpdateData = {
                    update: updateArr
                }
                
                const updateInWc = await WooCommerce.post("orders/batch", UpdateData);

                if (updateInWc) {

                const updatedOrders = await Order.updateMany({id:{$in: ids }}, {status: status});
                
                res.status(200).json({ success: true,  data: updatedOrders , msg: "Orders Updated"});
                }

                else {
                    res.status(400).json({ success: false , msg: "Data Not Updated On WC"})
                }

            } catch (error) {
                 console.log('Error', JSON.stringify(error) );
                res.status(400).json({ success: false , msg: error});
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}
