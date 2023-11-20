import dbConnect from '../../../utils/dbConnect';
import Order from '../../../models/testorder';

dbConnect();
export default async (req, res) => {
    const { method } = req;

    switch (method) {
        case 'POST':
            try {
               
                const exist = await Order.findOne({id: req.body.id});
                if (!exist) {
                    const order = await Order.create(req.body);
                    res.status(201).json({ success: true, status:"not exist", data: order })

                } else {
                    return res.status(400).json({ success: false ,status:"exist"});
                }
                
            } catch (error) {
                res.status(400).json({ success: false,error: error });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}
