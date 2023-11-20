import dbConnect from '../../../utils/dbConnect';
import Customer from '../../../models/customer';
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"; 

dbConnect();


const WooCommerce = new WooCommerceRestApi({
    url: process.env.WC_URL,
    consumerKey: process.env.WC_KEY,
    consumerSecret: process.env.WC_SECRET,
    version: "wc/v3",
    queryStringAuth: true
  });

export default async (req, res) => {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {

                const search = req.query.text;
                const page =  req.query.page * 1;
                const per_page =  req.query.per_page * 1;
                const skip = (page - 1) * per_page;

                 let query = Customer.find( {...req.query,"$or": [
                        { "first_name": { $regex: search, $options: "i" } },
                        { "last_name": { $regex: search, $options: "i" } }
                    
                    ]});
                query = query.select('id first_name last_name username email role billing.address_1 billing.address_2 billing.city billing.phone billing.postcode');
                query = query.skip(skip).limit(per_page);

                const customers = await query;

                const totals = await Customer.aggregate(
                    
                    [
                        {
                          $group: {
                            _id: "$role",
                            total: {
                              $sum:  1,
                            }
                          }
                        },
                        { 
                            $sort : { 
                                total : -1
                            }
                        }

                    ],
                );


                res.status(200).json({ success: true, data: customers, totalByRole: totals})
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case 'POST':
            try {

                const UserData = {
                    email: req.body.email,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    username: req.body.username,
                    password: req.body.password,
                    role: req.body.role,
                    billing: {
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        address_1: req.body.address_1,
                        address_2: req.body.address_2,
                        city: req.body.city,
                        postcode: req.body.postcode,
                        email: req.body.email,
                        phone: req.body.phone
                    },
                    shipping: {
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        address_1: req.body.address_1,
                        address_2: req.body.address_2,
                        city: req.body.city,
                        postcode: req.body.postcode,
                    }
                  };

                  const saveInWc = await WooCommerce.post("customers", UserData);

                  if (saveInWc) {

                    const savedcustomer = await Customer.create(saveInWc.data);

                    res.status(201).json({ success: true, data: savedcustomer, msg: "User Created"})

                  }    

                  else {
                    res.status(400).json({ success: false , msg: "Data Not Saved On WC"})
                }
                
            } catch (error) {
                res.status(400).json({ success: false ,msg: error});
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}