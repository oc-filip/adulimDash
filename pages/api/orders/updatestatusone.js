import dbConnect from '../../../utils/dbConnect';
import Order from '../../../models/order';

dbConnect();

export default async (req, res) => {
    const { method } = req;

    switch (method) {
            case 'POST':
            try {

               const id = req.body.id;
               const status = req.body.status;


                const updatedOrder= await Order.findOneAndUpdate({id:id}, req.body);
                
                res.status(200).json({ success: true, data: updatedOrder , msg: "Status changed"});
               

            } catch (error) {
                res.status(400).json({ success: false , msg: error});
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}
