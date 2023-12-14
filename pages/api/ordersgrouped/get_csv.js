import dbConnect from '../../../utils/dbConnect';
import Order from '../../../models/ordersgrouped';

dbConnect();



export default async (req, res) => {
    const { method } = req;

    switch (method) {
        case 'POST':
            try {

                const from = req.body.from;
                const to = req.body.to;

                console.log('body',req.body)

                 let query = Order.find(
                    {
                        "LastOrder.customer_name": { $not: /.*כרטיס כפול.*/i } ,
                        "LastOrder.document_type": { $in: [1, 2] } ,
                        'LastOrderDate': { $gte: from, $lt:to}
                    }
                );

                query = query.select('UserID LastOrder.customer_name NumOfOrders AverageFrequency LastOrderDate NextOrderDate reccuring pipedrive_id CallToUser Last5Avg' );
                query = query.sort({"NextOrderDate": -1 });

                const data = await query;


                res.status(200).json({ success: true, data: data , msg: 'CSV is ready to Download'})
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}