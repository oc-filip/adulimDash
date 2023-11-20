import dbConnect from '../../../utils/dbConnect';
import Order from '../../../models/order';

dbConnect();

export default async (req, res) => {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {

                let query = Order.find();

                query = query.select('id');
                const orders = await query;

                const total = orders.length;

                const totals = await Order.aggregate(
                    
                    [
                        {
                            $match: {
                                status: {  $ne: "tr" }                 
                            }
                        },  
                        {
                          $group: {
                            _id: "$status",
                            total: {
                              $sum:  1,
                            }
                          },
                        },
                        
                        /////////////////////////
                        { 
                            $sort : { 
                                total : -1
                            }
                        }

                    ],
                );



                res.status(200).json({ success: true,  total: total,  totalByStatus: totals })
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
