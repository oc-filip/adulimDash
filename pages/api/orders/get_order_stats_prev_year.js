import dbConnect from '../../../utils/dbConnect';
import Order from '../../../models/order';

dbConnect();

const date = new Date();

const year = date.getFullYear() - 1;

const yearstart = [year, "01", "01"].join('-');
const yearend = [year, "12", "31"].join('-');


export default async (req, res) => {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {

                const totals = await Order.aggregate(

                        [
                            {
                                $match: {
                                    status: "completed",
                                    $and: [
                                    {
                                        "date_created": {
                                        $gte: yearstart
                                        }
                                    },
                                    {
                                        "date_created": {
                                        $lte: yearend
                                        }
                                    }
                                    ],
                                    
                                }
                            },
                           
                            {
                                $project: 
                                {  
                                  date: { "$substr": ["$date_created", 5, 2] },
                                },
                            },
                            
                            {
                                $group:
                                {
                                    _id: "$date",
                                    count: { $sum:1 },
                                    
                                }
                            },
                            { 
                                $sort : { 
                                    _id : -1
                                }
                            }
                        ]
                );

                const allmonths = ['01','02','03','04','05','06','07','08','09','10','11','12'];

                let result = [];

                allmonths.forEach(month => {
                const item = totals.find(item => item._id === month);
                
                if (item) {
                    result.push(item);
                } else {
                    result.push({_id: month, count: 0});
                }
                })


                const all_totals =  result.map(item => item.count);

                res.status(200).json({ success: true, all:all_totals })
            } catch (error) {
                res.status(400).json({ success: false,error:error });
            }
            break;
            default:
                res.status(400).json({ success: false });
                break;
        }
    
}