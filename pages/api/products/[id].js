import dbConnect from '../../../utils/dbConnect';
import Product from '../../../models/product';
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

                
                const product = await Product.findOne({id: id});

                if (!product) {
                    return res.status(400).json({ success: false });
                }

                res.status(200).json({ success: true, data: product });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case 'PUT':
            try {
                const product = await Product.findByIdAndUpdate(id, req.body, {
                    new: true,
                    runValidators: true
                });

                if (!product) {
                    return res.status(400).json({ success: false });
                }

                res.status(200).json({ success: true, data: product });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case 'DELETE':
            try {
                
                const deleteInWc = await WooCommerce.delete(`products/${id}`, {
                    force: false
                  });
                  console.log(deleteInWc);

                  if (deleteInWc) {
                    const deletedProduct = await Product.findOneAndUpdate({ id: id , status: "draft"});
                    res.status(200).json({ success: true, data: deletedProduct , msg: "Product Deleted"});
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