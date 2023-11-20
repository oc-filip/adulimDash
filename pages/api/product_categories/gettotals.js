import dbConnect from '../../../utils/dbConnect';
import ProductCategories from '../../../models/productcat';

dbConnect();

export default async (req, res) => {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {

                let query = ProductCategories.find(req.query);

                query = query.select('id');
                const productcategories = await query;

                const total = productcategories.length;

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