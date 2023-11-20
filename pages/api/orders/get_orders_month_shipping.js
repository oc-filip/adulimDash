import dbConnect from '../../../utils/dbConnect';
import Order from '../../../models/order';

dbConnect();


const date = new Date();

function getMonth2Digits(date) {
    // 👇️ Add 1, because getMonth is 0-11
    const month = date.getMonth() + 1;
  
    if (month < 10) {
      return '0' + month;
    }
  
    return month;
  }


  const thismonth = getMonth2Digits(date);
  const year = date.getFullYear();



  const thismonthstart = [year, thismonth, "01"].join('-');
  const thismonthend = [year, thismonth, "31"].join('-');

  console.log('thismonthend',thismonthend);



export default async (req, res) => {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {

                const totals = await Order.aggregate(

                        [
                                    
                            {
                                $match: {
                                    status: { $in: ["completed","processing"] } ,
                                     "shipping_lines.method_id": { $in: ["flat_rate","free_shipping"] } ,
                                        $and: [
                                        {
                                            "date_created": {
                                            $gte: thismonthstart
                                            }
                                        },
                                        {
                                            "date_created": {
                                            $lte: thismonthend
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

                const total =  totals.map(item => item.count);

                res.status(200).json({ success: true,  totalthismonth: total})
            } catch (error) {
                res.status(400).json({ success: false,error:error });
            }
            break;
            default:
                res.status(400).json({ success: false });
                break;
        }
    
}