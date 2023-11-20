import dbConnect from '../../../utils/dbConnect';
import Product from '../../../models/product';

dbConnect();

export default async (req, res) => {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {

                let query = Product.find({status: { $ne: "trash" }});

                query = query.select('id');
                const products = await query;

                const total = products.length;

                const totals = await Product.aggregate(
                    
                    [
                        {
                          $group: {
                            _id: "$status",
                            total: {
                              $sum:  1
                            }
                          }
                        },
                        /////////////////////////
                        { 
                            $sort : { 
                                total : -1
                            }
                        }

                    ],
                );

                res.status(200).json({ success: true,  total: total,totalByStatus: totals })
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