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
    const { method } = req;

    switch (method) {

        case 'PUT':
            try {

               const id = req.body.id;
               const type = req.body.type;


       
                const UpdateData = {
                    type:type
                }

                const updateInWc = await WooCommerce.put(`products/${id}`, UpdateData);

                if (updateInWc) {

                    console.log('log' ,req.body)
                const updatedProduct= await Product.findOneAndUpdate({id: req.body.id}, {type: req.body.type});
                
                res.status(200).json({ success: true, data: updatedProduct , msg: "Type Changed" , log: type});
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