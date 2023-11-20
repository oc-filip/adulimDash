import dbConnect from '../../../utils/dbConnect';
import Order from '../../../models/order';
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"; 

dbConnect();


const WooCommerce = new WooCommerceRestApi({
    url: process.env.WC_URL,
    consumerKey: process.env.WC_KEY,
    consumerSecret: process.env.WC_SECRET,
    version: "wc/v3",
    //queryStringAuth: true
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

                  query1 = Order.find( {status: { $ne: "tr" },"$or": [
                        { "billing.first_name": { $regex: search, $options: "i" } },
                        { "billing.last_name": { $regex: search, $options: "i" } }
                    
                    ]});

                } else {
                    query1 = Order.find( {status: { $eq: status },"$or": [
                        { "billing.first_name": { $regex: search, $options: "i" } },
                        { "billing.last_name": { $regex: search, $options: "i" } }
                    
                    ]});
                }    

                query1 = query1.select('id');

                const orderstotal = await query1;
                const total = orderstotal.length;  

                let query;

                 if(!status) {       

                    console.log('No Status');

                    query = Order.find( {status: { $ne: "tr" },"$or": [
                        { "billing.first_name": { $regex: search, $options: "i" } },
                        { "billing.last_name": { $regex: search, $options: "i" } },
                        { "billing.email": { $regex: search, $options: "i" } }
                    
                    ]});

                } else {

                    console.log('With Status');

                    query = Order.find( {...req.query,"$or": [
                        { "billing.first_name": { $regex: search, $options: "i" } },
                        { "billing.last_name": { $regex: search, $options: "i" } },
                        { "billing.email": { $regex: search, $options: "i" } }

                    ]});    
                        
                }

                query = query.select('id status billing.first_name billing.last_name billing.email date_created total shipping_lines');
                query = query.skip(skip).limit(per_page).sort({"id": -1 });

                const orders = await query;


                res.status(200).json({ success: true, data: orders, total: total})
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case 'POST':
            try {
                const order = await Order.create(req.body);

                res.status(201).json({ success: true, data: order })
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
            case 'PUT':
                try {
                   // const order = await Order.create(req.body);

                   const ids = req.body.ids;
                   const status = req.body.status;


                   const updateArr = ids.map(id => {    
                     return  {id:id , status:status}
                   }); 
                   
                    const UpdateData = {
                        update: updateArr
                    }

                    const updateInWc = await WooCommerce.post("orders/batch", UpdateData);

                    if (updateInWc) {

                    const updatedOrders = await Order.updateMany({id:{$in: ids }}, {status: status});
                    
                    res.status(200).json({ success: true, data: updatedOrders , msg: "Orders Updated"});
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
