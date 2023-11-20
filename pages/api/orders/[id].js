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
    const {
        query: { id },
        method
    } = req;

    switch (method) {
        case 'GET':
            try {

                
                const order = await Order.findOne({id: id});

                if (!order) {
                    return res.status(400).json({ success: false });
                }

                res.status(200).json({ success: true, data: order });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case 'PUT':
            try {
                const order = await Order.findByIdAndUpdate(id, req.body, {
                    new: true,
                    runValidators: true
                });

                if (!order) {
                    return res.status(400).json({ success: false });
                }

                res.status(200).json({ success: true, data: order });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case 'DELETE':
            try {
                
                const deleteInWc = await WooCommerce.delete(`orders/${id}`, {
                    force: false
                  });
                  console.log(deleteInWc);

                  if (deleteInWc) {
                    const deletedOrder = await Order.findOneAndUpdate({ id: id , status: "draft"});
                    res.status(200).json({ success: true, data: deletedOrder , msg: "Order Deleted"});
                }


            } catch (error) {
                res.status(400).json({ success: false })
            }
            break;
        default:
            res.status(400).json({ success: false })
            break;
    }
}
