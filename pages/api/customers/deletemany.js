import dbConnect from '../../../utils/dbConnect';
import Customer from '../../../models/customer';
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

        case 'DELETE':
            try {

                const ids = req.body;

                const deleteData = {
                    delete: ids
                }

                const deleteInWc = await WooCommerce.post("customers/batch", deleteData)

                if (deleteInWc) {

                    const deletedCustomers = await Customer.deleteMany({id:{$in: ids }});
                    
                    res.status(200).json({ success: true, data: deletedCustomers , msg: "Users Deleted"});
                }

                else {
                    res.status(400).json({ success: false ,msg: "Data Not Deleted On WC"})
                }



            } catch (error) {
                res.status(400).json({ success: false ,msg: error})
            }
            break;
        default:
            res.status(400).json({ success: false })
            break;
    }
}