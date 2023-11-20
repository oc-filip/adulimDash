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
    const { method } = req;

    switch (method) {

        case 'POST':

            const auth = req.headers.authorization;
            if(auth == "Basic c3RhcmRhc2g6UjJwSXRqNjkhajhAcm4=") {

            try {
               console.log('The body',req.body);
               const id = parseInt(req.body.OrderNo);
               const status = req.body.Status;
               const errordesc = req.body.ErrorDesc;
               const DocNum = req.body.DocNum;
               const DocEntry = req.body.DocEntry;

               if(status == true){

                   
                   
                     const updateInWc = await fetch(`${process.env.WC_URL}/wp-json/wc/v3/orders/${id}?consumer_secret=${process.env.WC_SECRET}&consumer_key=${process.env.WC_KEY}&status=completed`, {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                        });

                   
                   if(updateInWc) {
                       
                    const updatedOrders = await Order.findOneAndUpdate({id:id}, {  status: "completed" ,sapexport: "yes" , DocNum: DocNum , DocEntry:DocEntry});
                       
                         res.status(200).json({ success: true,  msg: "OrderNo " + updatedOrders.id + " Updated"});
                    
                   }
                    else {
                    res.status(400).json({ success: false , msg: "Data Not Updated On WC"})
                }
                  
                   
               }  
               else {
                    const updatedOrders = await Order.findOneAndUpdate({id:id}, { ToSapError: errordesc});
                    res.status(200).json({ success: false,  msg: "OrderNo " + id + " Not Updated" , error:errordesc});
               }
                
                                  

            } catch (error) {
                 console.log('Error', JSON.stringify(error) );
                res.status(400).json({ success: false , msg: error});
            }
            break;
        }else {
            res.status(401).json({ success: false , msg: "Not Authorized"});
        }      
        default:
            res.status(400).json({ success: false });
            break;
    }
}
