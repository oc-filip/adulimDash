import dbConnect from '../../../utils/dbConnect';
import ProductAttributes from '../../../models/productattr';

dbConnect();

export default async (req, res) => {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {

                let query = ProductAttributes.find(req.query);

                query = query.select('id');
                const productattributes = await query;

                const total = productattributes.length;

                res.status(200).json({ success: true,  total: total })
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
            case 'POST':
                res.status(400).json({ success: false , msg: "POST method not allowed"});
                break;
            default:
                res.status(400).json({ success: false });
                break;
        }
    
}