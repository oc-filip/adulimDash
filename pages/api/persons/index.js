import dbConnect from '../../../utils/dbConnect';
import Person from '../../../models/person';

dbConnect();



export default async (req, res) => {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {

                const search = req.query.text;
                const page =  req.query.page * 1;
                const per_page =  req.query.per_page * 1;
                const skip = (page - 1) * per_page;

                 let query = Person.find( {id: { $ne: 0 },"$or": [
                        { "first_name": { $regex: search, $options: "i" } },
                        { "last_name": { $regex: search, $options: "i" } }
                    
                    ]});

                query = query.select('id first_name last_name b38f26908a473cb2993a861d9590b687a9a0ca15');
                query = query.skip(skip).limit(per_page).sort({"b38f26908a473cb2993a861d9590b687a9a0ca15": -1 });

                const data = await query;


                res.status(200).json({ success: true, data: data})
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}
