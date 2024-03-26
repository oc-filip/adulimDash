import dbConnect from '../../../utils/dbConnect';
import Order from '../../../models/ordersgrouped';

dbConnect();



export default async (req, res) => {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {

                let  orderby = req.query.status ? req.query.status : "1";
                let sortby
                const search = req.query.text;
                const page =  req.query.page * 1;
                const per_page =  req.query.per_page * 1;
                const skip = (page - 1) * per_page;


                if(orderby == "1") {

                    orderby = "UserID";
                    sortby = -1
                } else if (orderby == "2") {
                    orderby = "UserID";
                    sortby = 1
                } else if(orderby == "3") {

                    orderby = "NumOfOrders";
                    sortby = -1
                } else if (orderby == "4") {
                    orderby = "NumOfOrders";
                    sortby = 1
                } else if(orderby == "5") {

                    orderby = "AverageFrequency";
                    sortby = -1
                } else if (orderby == "6") {
                    orderby = "AverageFrequency";
                    sortby = 1
                } else if(orderby == "7") {

                    orderby = "pipedrive_id";
                    sortby = -1
                } else if (orderby == "8") {
                    orderby = "pipedrive_id";
                    sortby = 1
                } else if(orderby == "9") {

                    orderby = "LastOrderDate";
                    sortby = -1
                } else if (orderby == "10") {
                    orderby = "LastOrderDate";
                    sortby = 1
                }else if(orderby == "11") {

                    orderby = "NextOrderDate";
                    sortby = -1
                } else if (orderby == "12") {
                    orderby = "NextOrderDate";
                    sortby = 1
                }



                 let query = Order.find( {UserID: { $ne: 0 },"$or": [
                        { "LastOrder.customer_name": { $regex: search, $options: "i" } }                   
                    ]});

                query = query.select('UserID LastOrder.customer_name NumOfOrders AverageFrequency LastOrderDate NextOrderDate pipedrive_id reccuring CallToUser Last5Avg' );
                query = query.skip(skip).limit(per_page).sort({[orderby]: sortby});

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
