import dbConnect from '../../../utils/dbConnect';
import Order from '../../../models/testorder';
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
            case 'POST':
            try {

               const id = req.body.id;
               const status = req.body.status;


       

                const updatedOrder= await Order.findOneAndUpdate({id:id}, {status: status});
                
                res.status(200).json({ success: true, data: updatedOrder , msg: "Status changed"});
               

            } catch (error) {
                res.status(400).json({ success: false , msg: error});
            }
            break;
        case 'PUT':
            try {

               const id = req.body.id;
               const status = req.body.status;


       
                const UpdateData = {
                    status:status
                }

                const updateInWc = await WooCommerce.put(`orders/${id}`, UpdateData);

                if (updateInWc) {

                const updatedOrder= await Order.findOneAndUpdate({id:id}, {status: status});
                
                res.status(200).json({ success: true, data: updatedOrder , msg: "Status changed"});
                }

                else {
                    res.status(400).json({ success: false , msg: "Data Not Updated On WC"})
                }

            } catch (error) {
                res.status(400).json({ success: false , msg: error});
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}
