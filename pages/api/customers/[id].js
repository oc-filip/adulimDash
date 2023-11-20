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
    const {
        query: { id },
        method
    } = req;

    switch (method) {
        case 'GET':
            try {

                
                const customer = await Customer.findOne({id: id});

                if (!customer) {
                    return res.status(400).json({ success: false });
                }

                res.status(200).json({ success: true, data: customer });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case 'PUT':
            try {


                const UserData = {
                    email: req.body.email,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
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

                    

                  const updateInWc = await WooCommerce.put(`customers/${id}`, UserData);

                
                if (updateInWc) {

                    const customer = await Customer.findOneAndUpdate({id: id}, updateInWc.data);

                    return res.status(200).json({ success: true , data:customer, msg: "User Updated"});
                }

            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case 'DELETE':
            try {

                const deleteInWc = await WooCommerce.delete(`customers/${id}`, {
                    force: true
                  })

                  if (deleteInWc) {
                    const deletedCustomer = await Customer.deleteOne({ id: id });
                    res.status(200).json({ success: true, data: deletedCustomer , msg: "User Deleted"});
                }

            } catch (error) {
                res.status(400).json({ success: false })
            }
            break;
        default:
            res.status(400).json({ success: false })
            break;
    }
}