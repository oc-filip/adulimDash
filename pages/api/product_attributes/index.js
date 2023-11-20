import dbConnect from '../../../utils/dbConnect';
import ProductAttr from '../../../models/productattr';
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"; 
import jwt from "next-auth/jwt"

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

    const secret = process.env.JWT_SECRET;

    // try {

    //     const token = await jwt.getToken({ req, secret })

    //     if(!token) {
    //         return res.status(401).json({ success: false, msg: 'Unauthorized' });
    //     }

    // } catch (error) {
    //     res.status(400).json({ success: false, msg: error });
    // }


    switch (method) {
        case 'GET':
           
            try {
                const search = req.query.text; 

                const page =  req.query.page * 1;
                const per_page =  req.query.per_page * 1;
                const skip = (page - 1) * per_page;

                let query1 = ProductAttr.find( {...req.query,"$or": [
                    { "name": { $regex: search, $options: "i" } }                   
                ]});

                query1 = query1.select('id');

                const attributestotal = await query1;
                const total = attributestotal.length;  

                let query = ProductAttr.find( {...req.query,"$or": [
                    { "name": { $regex: search, $options: "i" } }                   
                ]});

                query = query.select('id name slug order_by');
                query = query.skip(skip).limit(per_page).sort({"id": -1 });

                const attributes = await query;


                res.status(200).json({ success: true, data: attributes, total: total})
            } catch (error) {
                res.status(400).json({ success: false, msg: error });
            }
            break;
        case 'POST':
            try {

                const post_to_wc =  await WooCommerce.post("products/attributes" , req.body);

                if(post_to_wc) {
                    const attribute = await ProductAttr.create(post_to_wc.data);
                    res.status(201).json({ success: true, data: attribute , msg: "Attribute Created"});
                }

            } catch (error) {
                res.status(400).json({ success: false, msg: error });
            }
            break;  
            case 'PUT':
            try {

                const post_to_wc =  await WooCommerce.put(`products/attributes/${req.body.id}` , req.body);

                if(post_to_wc) {
                    const attribute = await ProductAttr.findOneAndUpdate({ id:req.body.id}  ,post_to_wc.data);
                    res.status(201).json({ success: true, data: attribute , msg: "Attribute Updated"});
                }

            } catch (error) {
                res.status(400).json({ success: false, msg: error });
            }
            break;  
        default:
            res.status(400).json({ success: false });
            break;
    }
}