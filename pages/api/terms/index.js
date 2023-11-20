import dbConnect from '../../../utils/dbConnect';
import Terms from '../../../models/terms';
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


                const search = req.query.text; 
                const page =  req.query.page * 1;
                const per_page =  req.query.per_page * 1;
                const skip = (page - 1) * per_page;

                let query1
                 

                query1 = Terms.find( {...req.query,"$or": [
                        { "name": { $regex: search, $options: "i" } }                    
                    ]});

              

                query1 = query1.select('id');

                const termstotal = await query1;
                const total = termstotal.length;  

                    
                let query;

             
                   query = Terms.find( {...req.query,"$or": [
                       { "name": { $regex: search, $options: "i" } }
                   
                   ]});

             
                query = query.select('id name attr_id slug count');
                query = query.skip(skip).limit(per_page).sort({"id": -1 });

                const terms = await query;


                res.status(200).json({ success: true, data: terms, total: total })
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case 'POST':
            try {

                const attr_id = req.body.attr_id;
                const data = {
                    name: req.body.name,
                    slug:req.body.slug,
                }

                const post_to_wc =  await  WooCommerce.post(`products/attributes/${attr_id}/terms`, data);

                if(post_to_wc) {

                    const data_to_save = ({
                        ...req.body,
                        id:post_to_wc.data.id,
                    })


                    const term = await Terms.create(data_to_save);
                    res.status(201).json({ success: true, data: term , msg: "Term Created"});
                }

            } catch (error) {
                res.status(400).json({ success: false, msg: error });
            }
            break;
            case 'PUT':
                try {

                    const attr_id = req.body.attr_id;
                    const id = req.body.id;
                    const data = {
                        name: req.body.name,
                        slug:req.body.slug,
                    }
    
                    const update_to_wc =  await WooCommerce.put(`products/attributes/${attr_id}/terms/${id}`, data);
    
                    if(update_to_wc) {
                        const term = await Terms.findOneAndUpdate({ id:id}  ,update_to_wc.data);
                        res.status(201).json({ success: true, data: term , msg: "Term Updated"});
                    }
    
                } catch (error) {
                    res.status(400).json({ success: false, msg: error });
                }
                break;  
            case 'DELETE':
                try {

                    const attr_id = req.body.term_id;
                    const id = req.body.id;

                     const deleteInWc = await WooCommerce.delete(`products/attributes/${attr_id}/terms/${id}`, {
                        force: true
                      });
    
                      if (deleteInWc) {
                        const deletedTerm = await Terms.deleteOne({ id: id });
                        res.status(200).json({ success: true, data: deletedTerm , msg: "Term Deleted"});
                    }
    
                } catch (error) {
                    res.status(400).json({ success: false })
                }
                break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}