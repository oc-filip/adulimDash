import dbConnect from '../../../utils/dbConnect';
import Orders from '../../../models/ordersgrouped';

dbConnect();

export default async (req, res) => {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {

                let query = Orders.find(req.query);

                query = query.select('id');
                const orders = await query;

                const total = orders.length;

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