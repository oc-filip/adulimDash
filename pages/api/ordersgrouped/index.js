import dbConnect from '../../../utils/dbConnect';
import Order from '../../../models/ordersgrouped';

dbConnect();



export default async (req, res) => {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {

                const search = req.query.text;
                const page =  req.query.page * 1;
                const per_page =  req.query.per_page * 1;
                const skip = (page - 1) * per_page;

                 let query = Order.find( {UserID: { $ne: 0 },"$or": [
                        { "LastOrder.customer_name": { $regex: search, $options: "i" } }                   
                    ]});

                query = query.select('UserID LastOrder.customer_name NumOfOrders AverageFrequency LastOrderDate NextOrderDate pipedrive_id reccuring CallToUser Last5Avg' );
                query = query.skip(skip).limit(per_page).sort({"pipedrive_id": -1 });

                const data = await query;


                res.status(200).json({ success: true, data: data})
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}
