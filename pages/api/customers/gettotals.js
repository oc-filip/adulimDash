import dbConnect from '../../../utils/dbConnect';
import Customer from '../../../models/customer';

dbConnect();

export default async (req, res) => {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {

                let query = Customer.find(req.query);

                query = query.select('id');
                const customers = await query;

                const total = customers.length;

                res.status(200).json({ success: true,  total: total })
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