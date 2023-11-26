import dbConnect from '../../../utils/dbConnect';
import RihvitOrder from '../../../models/rihvit_order';

dbConnect();

export default async (req, res) => {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {

                let query = RihvitOrder.find();

                query = query.select('document_number');
                const orders = await query;

                const total = orders.length;

                const totals = await RihvitOrder.aggregate(
                    
                    [
                        {
                            $match: {
                                document_type: {  $ne: 0 }                 
                            }
                        },  
                        {
                          $group: {
                            _id: "$document_type",
                            total: {
                              $sum:  1,
                            }
                          },
                        },
                        
                        /////////////////////////
                        { 
                            $sort : { 
                                _id : 1
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
