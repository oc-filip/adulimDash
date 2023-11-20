import dbConnect from '../../../utils/dbConnect';
import ProductCat from '../../../models/productcat';
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

                
                const category = await ProductCat.findOne({id: id});

                if (!category) {
                    return res.status(400).json({ success: false });
                }

                res.status(200).json({ success: true, data: category });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case 'PUT':
            try {
                const category = await ProductCat.findByIdAndUpdate(id, req.body, {
                    new: true,
                    runValidators: true
                });

                if (!category) {
                    return res.status(400).json({ success: false });
                }

                res.status(200).json({ success: true, data: category });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case 'DELETE':
            try {


                 const deleteInWc = await WooCommerce.delete(`products/categories/${id}`, {
                    force: true
                  })

                  if (deleteInWc) {
                    const deletedCategory = await ProductCat.deleteOne({ id: id });
                    res.status(200).json({ success: true, data: deletedCategory , msg: "Category Deleted"});
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