import dbConnect from '../../../utils/dbConnect';
import Order from '../../../models/order';

dbConnect();


   

export default async (req, res) => {

    const { method } = req;


    switch (method) {
        case 'GET':

        const auth = req.headers.authorization;
            if(auth == "Basic c3RhcmRhc2g6UjJwSXRqNjkhajhAcm4=") {


            try {

                const per_page =  20;

                let query;

                query = Order.find( {status:{ $in: ["completed","processing"] } , payment_method: "pelecard", sapexport:"no"});


                query = query.select('id status billing.first_name billing.last_name billing.phone billing.address_1 billing.city billing.email date_created total customer_note line_items meta_data shipping_lines ');
                query = query.limit(per_page).sort({"id": -1 });

                const orders = await query;

                let data = [];
                
                let street_number;
                let entry;
                let house_number;
                let floor;
                let NumberOfPayments;
                let voucher_number;
                let token;
                let owner_id;
                let credit_card;
                let credit_type;
                let card_num;
                let card_valid;
                let ordernumber;
                let customername;
                let customerphone;
                let customercity;
                let customeraddress;
                let customernote;
                let orderdate;
                let ordertotal;
                let u_supply;
                let u_supply_text;
                let u_install;
                

                orders.map(item => {

                    let data_items = [];
                    ordernumber = item.id;
                    customername = item.billing.first_name  +  ' ' + item.billing.last_name;
                    customerphone = "0" + item.billing.phone;
                    customercity = item.billing.city;
                    customeraddress = item.billing.address_1.substring(0, 39);
                    customernote = item.customer_note;
                    orderdate = item.date_created;
                    ordertotal = item.total;

                    item.meta_data.map(meta=> {

                        if( meta.key == "_billing_street_number"){
                            street_number = meta.value
                        }
                        if( meta.key == "_billing_house_number"){
                            house_number = meta.value
                        }       
                        if( meta.key == "_billing_floor_number"){
                            floor = meta.value
                        }  
                        if( meta.key == "_billing_entry"){
                            entry = meta.value
                        }  

                        if(meta.key == "_transaction_data") {

                            credit_card = meta.value.CreditCardBrand;
                            credit_type =  meta.value.CreditType;
                            NumberOfPayments = meta.value.TotalPayments;
                            voucher_number = meta.value.VoucherId;
                            token = meta.value.ConfirmationKey;
                            owner_id = meta.value.CardHolderID;
                            card_num = meta.value.CreditCardNumber;
                            card_valid = meta.value.CreditCardExpDate;                      
                        }

                    })

                    

                    item.line_items.map(line => {
                           
                        let item_discount;
                        let item_orgprice;
                        
                        if(line.product_id == 37628 || line.product_id == 45779 || line.product_id == 38414 ||line.product_id == 52088 ){
                            u_install = 1;
                        } else {
                            u_install = 0;
                        }

                        line.meta_data.map(linemeta => {

                            

                            if(linemeta.key == "discount"){
                                item_discount = linemeta.value
                            } 
                            if(linemeta.key == "org_price"){
                                item_orgprice = linemeta.value
                            } 
                            

                        })    

                        data_items.push({ 
                            ItemCode: line.sku,
                            Quantity:line.quantity,
                            U_install: u_install,
                            //PriceBefDisc: item_orgprice ? item_orgprice : line.price.toFixed(2),
                            DiscPrcnt: item_discount ? item_discount : "0.0",
                            PriceAfVAT: line.price.toFixed(2)
                        })
                    })


                    item.shipping_lines.map(shippline => {

                        if(shippline.instance_id == 3) {
                            u_supply = 5;
                            u_supply_text = "no";
                        }
                        else if(shippline.instance_id == 4 ) {
                            u_supply = 1;
                            u_supply_text = "no";
                        }
                        else if(shippline.instance_id == 9) {
                            u_supply = 1;
                            u_supply_text = 'משלוח';
                        }
                        else if(shippline.instance_id == 17 ) {
                            u_supply = 4;
                            u_supply_text = 'משלוח מהיר';
                        }
                        else  {
                            u_supply = 1;
                        }

                        if(u_supply_text !== "no") {    
                            data_items.push({ 
                                ItemCode: u_supply_text,
                                Quantity:1,
                                U_install: u_install,
                                //PriceBefDisc: shippline.total,
                                DiscPrcnt: "0.0",
                                PriceAfVAT: shippline.total
                            })
                        }


                    })

                    if(token) {
                    data.push({
                        
                        OrderNo: ordernumber, 
                        CardName: customername,
                        Phone: customerphone,
                        City: customercity,
                        Street: customeraddress,
                        StreetNo: street_number ? street_number :null, 
                        Entry: entry ? entry : null,
                        Floor: parseInt(floor) ? parseInt(floor) : 0,
                        HomeNo:house_number ? house_number : 0,
                        RemarkDelivery: customernote ? customernote : null,
                        DocDueDate: orderdate,
                        DocDate: orderdate, 
                        CreditCard: credit_card,    
                        CrCardNum: card_num.slice(-4),  
                        CardValid: card_valid,
                        CrTypeCode: credit_type, 
                        OwnerIdNum: owner_id, 
                        DocTotal: ordertotal,
                        NumOfPmnts: NumberOfPayments,
                        VoucherNum: voucher_number, 
                        ConfNum: token,
                        U_supply: u_supply,
                        items:data_items
         
                    })
                    }    

                })  

               const datalength = data.length;
                res.status(200).json(data);

                
                
            } catch (error) {
                res.status(400).json({ success: false });
            }

        }else {
            res.status(401).json({ success: false , msg: "Not Authorized"});
        }  
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }

    
}
