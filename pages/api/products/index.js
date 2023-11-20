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
        case 'GET':
            try {

                const queryObj = {...req.query};

                const search = req.query.text; 
                const status = req.query.status;
                const page =  req.query.page * 1;
                const per_page =  req.query.per_page * 1;
                const skip = (page - 1) * per_page;

                let query1
                if(!status) {   

                  query1 = Product.find( {status: { $ne: "trash" },"$or": [
                        { "name": { $regex: search, $options: "i" } }                    
                    ]});

                } else {
                    query1 = Product.find( {status: { $eq: status },"$or": [
                        { "name": { $regex: search, $options: "i" } }                    
                    ]});
                }    

                query1 = query1.select('id');

                const productstotal = await query1;
                const total = productstotal.length;  

                    
                let query;

                if(!status) {       

                   console.log('No Status');

                   query = Product.find( {status: { $ne: "trash" },"$or": [
                       { "name": { $regex: search, $options: "i" } }
                   
                   ]});

               } else {

                   console.log('With Status');

                   query = Product.find( {...req.query,"$or": [
                       { "name": { $regex: search, $options: "i" } }

                   ]});    
                       
               }


                query = query.select('id name sku regular_price status images price_html stock_status');
                query = query.skip(skip).limit(per_page).sort({"id": -1 });

                const products = await query;


                res.status(200).json({ success: true, data: products, total: total })
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case 'POST':
            try {
                const product = await Product.create(req.body);

                res.status(201).json({ success: true, data: product })
            } catch (error) {
                res.status(400).json({ success: false, msg: error });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}