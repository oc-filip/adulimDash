import dbConnect from '../../../utils/dbConnect';

import OrdersGrouped from '../../../models/ordersgrouped';

dbConnect();

export default async (req, res) => {

    try {

        let today = new Date();
        today.setHours(0, 0, 0, 0);


        console.log('today', today)

        
        const data = await OrdersGrouped.find(
            {
            "LastOrder.customer_name": { $not: /.*כרטיס כפול.*/i },
            "reccuring": { $in: [null, "58"] },
            "LastOrder.document_type": { $in: [1, 2] },
            'NextOrderDate': today
            }
        );

        console.log('data',data)

        res.status(201).json({ success: true, data: data })



    } catch (error) {
        res.status(400).json({ success: false ,error: error});
    }

}    
