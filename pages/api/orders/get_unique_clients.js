import dbConnect from '../../../utils/dbConnect';
import AllOrders from '../../../models/allorders';
import OrdersGrouped from '../../../models/ordersgrouped';

dbConnect();

export default async (req, res) => {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {

                let query = AllOrders.find({is_cancelled:false,document_type:{$in:[1,2]}});

                const orders = await query;


                const clients = orders; // assuming the clients data is in the message payload


                console.log('Clients data received')
                
                const uniqueClients = Array.from(new Set(clients.map(client => client.customer_id))).map(customer_id => {
                    const clientOrders = clients.filter(client => client.customer_id === customer_id)
                        .sort((a, b) => {
                            const dateA = new Date(`${a.document_date.split('/').reverse().join('-')} ${a.document_time}`);
                            const dateB = new Date(`${b.document_date.split('/').reverse().join('-')} ${b.document_time}`);
                            return dateA - dateB;
                        });
                    let DocNotFit = 0;
                    const frequency = [];
                    const amounts = [];
                
                    clientOrders.reverse();


                    
                
                    const slicedArray = clientOrders.slice(0,5);
                    for (let i = 0; i < slicedArray.length; i++) {

                
                        if (slicedArray[i].amount > 0 ) {
                                let AmountsDataToPush = {
                                    "amount": slicedArray[i].amount > 0 ? slicedArray[i].amount : 0,
                                }
                                amounts.push(AmountsDataToPush);
                        }
                
                       
                    }    
                    let totalAmounts = 0;
                    let numAmounts = 0;
                    let last5;
                    for (let i = 0; i < amounts.length; i++) {
                        totalAmounts += amounts[i].amount;
                        numAmounts++;
                
                        last5 = totalAmounts / numAmounts;
                
                    }   
                
                       
                    for (let i = 0; i < clientOrders.length - 1; i++) {
                       // if (clientOrders[i].document_type_name !== "חשבונית מס")
                        //{
                            //DocNotFit++;
                        //}

                        //if (clientOrders[i].document_type == 1 || clientOrders[i].document_type == 2) {
                        const dateA = new Date(`${clientOrders[i].document_date.split('/').reverse().join('-')} ${clientOrders[i].document_time}`);
                        const dateB = new Date(`${clientOrders[i + 1].document_date.split('/').reverse().join('-')} ${clientOrders[i + 1].document_time}`);
                        const timeDiff = Math.abs(dateB - dateA);
                        const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                        let DataToPush = {
                            "diffDays": diffDays,
                            "dateA": dateA,
                            "dateB": dateB,
                            "orderA": clientOrders[i].document_number,
                            "orderB": clientOrders[i + 1].document_number,
                
                        }
                        frequency.push(DataToPush);
                        //}
                    }

                    let lastamount
                    if (amounts.length > 0) {
                        lastamount = amounts[0].amount;
                    } else {
                        lastamount = 0
                    }


                    
                
                    return {
                        customer_id,
                        avgamounts:amounts,
                        lastamount: lastamount,
                        numAmounts: numAmounts,
                        totalAmounts: totalAmounts,
                        last5Avg: Math.round(last5),
                        orders: clientOrders,
                        orderNum: clientOrders.length,
                        frequency: frequency.length === 0 ? [{ "diffDays": 999 }] : frequency
                    }
                });

                
                const uniqueClientsData = uniqueClients;

               console.log('uniqueClientsData received')
               
                
                                
                let userAverage = [];

                


                for (let i = 0; i < uniqueClientsData.length; i++) {
                    let totalFrequency = 0;
                    let numFrequencies = 0;
                   
                    for (let j = 0; j < uniqueClientsData[i].frequency.length; j++) {
                        totalFrequency += uniqueClientsData[i].frequency[j].diffDays;
                        numFrequencies++;

                        
                    }

                    let userAverageFrequency = totalFrequency / numFrequencies;
                    let userLastOrder = uniqueClientsData[i].orders[0];


                    let lastOrderTimestamp = Math.floor(Date.parse(userLastOrder.document_date) / 1000); // Convert to Unix timestamp in seconds
                    let averageSeconds = Math.floor(userAverageFrequency * 24 * 60 * 60); // Convert average frequency in days to seconds
                    let nextOrderTimestamp = lastOrderTimestamp + averageSeconds; // Add the average frequency to the last order timestamp
                    let currentTimestamp = Math.floor(Date.now() / 1000); // Get the current Unix timestamp in seconds
                    let NextOrder;


                    if (nextOrderTimestamp <= currentTimestamp) {
                        // The next order date has already passed
                        NextOrder = false;
                    } else {
                        // The next order date is in the future
                        NextOrder = true;
                    }


                    const Dateparts = userLastOrder.document_date.split('/');
                    const Newdate = Dateparts[1] + '-' + Dateparts[0] + '-' + Dateparts[2];
                    
                    const newdate = new Date(Newdate);
                    newdate.setDate(newdate.getDate() + Math.round(userAverageFrequency))


                   
                    
                    userAverage.push({ 
                        UserID: uniqueClientsData[i].customer_id, 
                        AverageFrequency: Math.round(userAverageFrequency), 
                        LastOrder: userLastOrder,
                        LastOrderDate: new Date(Newdate),
                        NextOrderDate: newdate,
                        NumOfOrders: uniqueClientsData[i].orderNum,
                        CallToUser: NextOrder,
                        NumAmounts: uniqueClientsData[i].numAmounts,
                        TotalAmounts: uniqueClientsData[i].totalAmounts,
                        Last5amounts: uniqueClientsData[i].avgamounts,
                        Lastamount: uniqueClientsData[i].lastamount,
                        Last5Avg: uniqueClientsData[i].last5Avg ? uniqueClientsData[i].last5Avg : 0,
                        });
                }

               const userAverageData = userAverage;

               const count =  userAverageData.length;

               const dataSaved =  await OrdersGrouped.insertMany(userAverageData);




                res.status(200).json({ success: true,  data: dataSaved})
            } catch (error) {
       
                res.status(400).json({ success: false ,error: error});
            }
            break;
            default:
                res.status(400).json({ success: false });
                break;
        }
    
}
