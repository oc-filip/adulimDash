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

                const topsellers =  await WooCommerce.get("reports/top_sellers" , {
                    period: "last_month"
                  });

                if(topsellers) {

                    res.status(201).json({ success: true, data: topsellers.data});
                }

            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case 'POST':
            res.status(400).json({ success: false });
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}