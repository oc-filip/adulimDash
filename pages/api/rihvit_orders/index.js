import dbConnect from '../../../utils/dbConnect';
import RihvitOrder from '../../../models/rihvit_order';
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
                const document_type = parseInt(req.query.type);
                const page =  req.query.page * 1;
                const per_page =  req.query.per_page * 1;
                const skip = (page - 1) * per_page;


                let query1
                if(!document_type) {   

                  query1 = RihvitOrder.find( {document_type: { $ne: 0 },"$or": [
                        { "customer_name": { $regex: search, $options: "i" } },
                        { "document_type_name": { $regex: search, $options: "i" } },
                        { "phone": { $regex: search, $options: "i" } }
                    
                    ]});

                } else {
                    query1 = RihvitOrder.find( {document_type: { $eq: document_type },"$or": [
                        { "customer_name": { $regex: search, $options: "i" } },
                        { "document_type_name": { $regex: search, $options: "i" } },
                        { "phone": { $regex: search, $options: "i" } }
                    
                    ]});
                }    

                query1 = query1.select('document_number');

                const orderstotal = await query1;
                const total = orderstotal.length;  

                let query;

                 if(!document_type) {       

                    console.log('No Status');

                    query = RihvitOrder.find( {document_type: { $ne: 0 },"$or": [
                        { "customer_name": { $regex: search, $options: "i" } },
                        { "document_type_name": { $regex: search, $options: "i" } },
                        { "phone": { $regex: search, $options: "i" } }
                    
                    ]});

                } else {

                    console.log('With Status');

                    query = RihvitOrder.find( {document_type:document_type,"$or": [
                        { "customer_name": { $regex: search, $options: "i" } },
                        { "document_type_name": { $regex: search, $options: "i" } },
                        { "phone": { $regex: search, $options: "i" } }

                    ]});    
                        
                }

                query = query.select('document_number document_type customer_name document_date document_time amount document_type_name');
                query = query.skip(skip).limit(per_page).sort({"document_number": -1 });

                const orders = await query;


                res.status(200).json({ success: true, data: orders, total: total})
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case 'POST':
            try {
                const order = await RihvitOrder.create(req.body);

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

                    const updatedOrders = await RihvitOrder.updateMany({id:{$in: ids }}, {status: status});
                    
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
