import dbConnect from '../../../utils/dbConnect';
import ProductAttr from '../../../models/productattr';
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

                
                const attribute = await ProductAttr.findOne({id: id});

                if (!attribute) {
                    return res.status(400).json({ success: false });
                }

                res.status(200).json({ success: true, data: attribute });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case 'PUT':
            try {
                const attribute = await ProductAttr.findByIdAndUpdate(id, req.body, {
                    new: true,
                    runValidators: true
                });

                if (!attribute) {
                    return res.status(400).json({ success: false });
                }

                res.status(200).json({ success: true, data: attribute });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case 'DELETE':
            try {


                 const deleteInWc = await WooCommerce.delete(`products/attributes/${id}`, {
                    force: true
                  })

                  if (deleteInWc) {
                    const deletedAttribute = await ProductAttr.deleteOne({ id: id });
                    res.status(200).json({ success: true, data: deletedAttribute , msg: "Attribute Deleted"});
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