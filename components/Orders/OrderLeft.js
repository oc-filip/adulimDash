import React from "react";

// components

export default function OrderLeft( { order } ) {


  let street_number;
  let house_number;
  let entry;
  let floor;

  order.meta_data.map(meta=> {

    if( meta.key == "_billing_street_number"){
        street_number = meta.value
    }
    if( meta.key == "_billing_house_number"){
      house_number = meta.value
    }
    if( meta.key == "_billing_entry"){
      entry = meta.value
    }
    if( meta.key == "_billing_floor_number"){
      floor = meta.value
    }
    
    
})


  return (
    <>
    
      <div key={order.id} className="relative flex flex-col min-w-0 break-words w-full mb-6  border-0">
        <div className="shadow-lg rounded-lg bg-white py-3 px-3">
          <div className="text-center flex justify-between">
            <h6 className="text-blueGray-600 text-xl font-bold"> פרטי הזמנה #{order.id} </h6>
           
          </div>
        </div>
        <div className="flex-auto px-4 lg:px-4 shadow-lg rounded-lg bg-white py-4 mt-4">
        
          <form>
          <div className="flex flex-wrap">
          <div className="w-full lg:w-6/12 mb-12">
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
          חיוב
              </h6>
            <div className="flex flex-wrap">
             
              <div className="w-full px-4 lg:w-6/12">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    שם פרטי
                  </label>
                  <input 
                    type="text"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm border focus:outline-none w-full ease-linear transition-all duration-150"
                    defaultValue={order.billing.first_name} readOnly={true}
                  />
                </div>
              </div>
              <div className="w-full px-4 lg:w-6/12">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    שם משפחה
                  </label>
                  <input
                    type="text"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm border focus:outline-none w-full ease-linear transition-all duration-150"
                    defaultValue={order.billing.last_name} readOnly={true}
                  />
                </div>
              </div>
              <div className="w-full px-4 lg:w-6/12">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    כתובת אימייל
                  </label>
                  <input
                    type="email"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm border focus:outline-none  w-full ease-linear transition-all duration-150"
                    defaultValue={order.billing.email} readOnly={true}
                  />
                </div>
              </div>


              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    טלפון
                  </label>
                  <input
                    type="text"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm border focus:outline-none w-full ease-linear transition-all duration-150"
                    defaultValue={order.billing.phone} readOnly={true}
                  />
                </div>
              </div>

              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    עיר 
                  </label>
                  <input
                    type="text"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm border focus:outline-none w-full ease-linear transition-all duration-150"
                    defaultValue={order.billing.city} readOnly={true}
                  />
                </div>
              </div>

              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    רחוב
                  </label>
                  <input
                    type="text"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm border focus:outline-none  w-full ease-linear transition-all duration-150"
                    defaultValue={order.billing.address_1} readOnly={true}
                  />
                </div>
              </div>
              

              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    מספר בית
                  </label>
                
                     
                      <input
                    type="text"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm border focus:outline-none  w-full ease-linear transition-all duration-150"
                    defaultValue={street_number} readOnly={true}
                  />
                     
                  
                </div>
              </div>

              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    מספר דירה
                  </label>
                
                     
                      <input
                    type="text"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm border focus:outline-none w-full ease-linear transition-all duration-150"
                    defaultValue={house_number} readOnly={true}
                  />
                     
                  
                </div>
              </div>


              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    כניסה
                  </label>
                
                     
                      <input
                    type="text"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm border focus:outline-none w-full ease-linear transition-all duration-150"
                    defaultValue={entry} readOnly={true}
                  />
                     
                  
                </div>
              </div>

              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    קומה
                  </label>
                
                     
                      <input
                    type="text"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm border focus:outline-none  w-full ease-linear transition-all duration-150"
                    defaultValue={floor} readOnly={true}
                  />
                     
                  
                </div>
              </div>


            </div>

            </div>
            <div className="w-full lg:w-6/12 mb-12">
            <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            משלוחעריכה
              </h6>
              <div className="flex flex-wrap">
             
             <div className="w-full px-4 lg:w-6/12">
               <div className="relative w-full mb-3">
                 <label
                   className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                   htmlFor="grid-password"
                 >
                  שם פרטי
                 </label>
                 <input
                   type="text"
                   className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm border focus:outline-none  w-full ease-linear transition-all duration-150"
                   defaultValue={order.shipping.first_name} readOnly={true}
                 />
               </div>
             </div>
             <div className="w-full px-4 lg:w-6/12">
               <div className="relative w-full mb-3">
                 <label
                   className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                   htmlFor="grid-password"
                 >
                   שם משפחה
                 </label>
                 <input
                   type="text"
                   className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm border focus:outline-none  w-full ease-linear transition-all duration-150"
                   defaultValue={order.shipping.last_name} readOnly={true}
                 />
               </div>
             </div>
             <div className="w-full px-4 lg:w-6/12">
               <div className="relative w-full mb-3">
                 <label
                   className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                   htmlFor="grid-password"
                 >
                   כתובת אימייל
                 </label>
                 <input
                   type="email"
                   className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm border focus:outline-none  w-full ease-linear transition-all duration-150"
                   defaultValue={order.billing.email} readOnly={true}
                 />
               </div>
             </div>


             <div className="w-full lg:w-6/12 px-4">
               <div className="relative w-full mb-3">
                 <label
                   className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                   htmlFor="grid-password"
                 >
                   טלפון
                 </label>
                 <input
                   type="text"
                   className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm border focus:outline-none  w-full ease-linear transition-all duration-150"
                   defaultValue={order.shipping.phone} readOnly={true}
                 />
               </div>
             </div>

             <div className="w-full lg:w-6/12 px-4">
               <div className="relative w-full mb-3">
                 <label
                   className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                   htmlFor="grid-password"
                 >
                   עיר 
                 </label>
                 <input
                   type="text"
                   className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm border focus:outline-none  w-full ease-linear transition-all duration-150"
                   defaultValue={order.shipping.city} readOnly={true}
                 />
               </div>
             </div>

             <div className="w-full lg:w-6/12 px-4">
               <div className="relative w-full mb-3">
                 <label
                   className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                   htmlFor="grid-password"
                 >
                   רחוב
                 </label>
                 <input
                   type="text"
                   className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm border focus:outline-none  w-full ease-linear transition-all duration-150"
                   defaultValue={order.shipping.address_1} readOnly={true}
                 />
               </div>
             </div>
             





             <div className="w-full lg:w-6/12 px-4">
               <div className="relative w-full mb-3">
                 <label
                   className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                   htmlFor="grid-password"
                 >
                   מספר בית
                 </label>
               
                    
                     <input
                   type="text"
                   className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm border focus:outline-none  w-full ease-linear transition-all duration-150"
                   defaultValue={street_number} readOnly={true}
                 />
                    
                 
               </div>
             </div>

             <div className="w-full lg:w-6/12 px-4">
               <div className="relative w-full mb-3">
                 <label
                   className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                   htmlFor="grid-password"
                 >
                   מספר דירה
                 </label>
               
                    
                     <input
                   type="text"
                   className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm border focus:outline-none  w-full ease-linear transition-all duration-150"
                   defaultValue={house_number} readOnly={true}
                 />
                    
                 
               </div>
             </div>


             <div className="w-full lg:w-6/12 px-4">
               <div className="relative w-full mb-3">
                 <label
                   className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                   htmlFor="grid-password"
                 >
                   כניסה
                 </label>
               
                    
                     <input
                   type="text"
                   className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm border focus:outline-none  w-full ease-linear transition-all duration-150"
                   defaultValue={entry} readOnly={true}
                 />
                    
                 
               </div>
             </div>

             <div className="w-full lg:w-6/12 px-4">
               <div className="relative w-full mb-3">
                 <label
                   className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                   htmlFor="grid-password"
                 >
                   קומה
                 </label>
               
                    
                     <input
                   type="text"
                   className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm border focus:outline-none  w-full ease-linear transition-all duration-150"
                   defaultValue={floor} readOnly={true}
                 />
                    
                 
               </div>
             </div>


           </div>

            </div>
            </div>
           


           
            <div className="flex flex-wrap">
              <div className="w-full lg:w-12/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                     הערה מהלקוח
                  </label>
                  <textarea
                    type="text"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm border focus:outline-none  w-full ease-linear transition-all duration-150"
                    rows="4"
                    defaultValue={order.customer_note} readOnly={true}
                  ></textarea>
                </div>
              </div>
            </div>

          </form>
        </div>

        <div className="flex-auto shadow-lg rounded-lg bg-white mt-8">
          <table className="border-collapse table-auto w-full text-sm">
              <thead>
                <tr>
                  <th className="border-b dark:border-slate-600 font-medium p-4 bg-gray-100 text-slate-400 dark:text-slate-200 text-right">תמונה</th>
                  <th className="border-b dark:border-slate-600 font-medium p-4 bg-gray-100 text-slate-400 dark:text-slate-200 text-right">פריט</th>
                  <th className="border-b dark:border-slate-600 font-medium p-4 bg-gray-100 text-slate-400 dark:text-slate-200 text-center">עלות</th>
                  <th className="border-b dark:border-slate-600 font-medium p-4 bg-gray-100 text-slate-400 dark:text-slate-200 text-center">כמות</th>
                  <th className="border-b dark:border-slate-600 font-medium p-4 bg-gray-100 text-slate-400 dark:text-slate-200 text-center">סה"כ</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800">
              {order.line_items.map(item => {

                return (
                <>  
                <tr key={item.name}>
                  <td className="lg:w-1/12 border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
                    <img alt="..." className="align-middle border-none" width="40" src={item.image.src ? item.image.src : "/img/star_logo.png"}/>
                  </td>
                  <td className="lg:w-8/12 border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">{item.name}</td>
                  <td className="lg:w-1/12 border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-center">₪{(item.total / item.quantity).toFixed(2) }</td>
                  <td className="lg:w-1/12 border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-center">x {item.quantity}</td>
                  <td className="lg:w-1/12 border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-center">₪{item.total}</td>
                </tr>

               {item.meta_data.map(item_m => {

                  let has_meta = false;
                  
                  if(item_m.display_key !== "discount" && item_m.display_key !== "org_price" &&  item_m.display_key !== "_reduced_stock"){
                    has_meta = true
                  }

                      return (
                      <>  
                      {has_meta &&
                      <tr key={item_m.id}>    
                        <td className="lg:w-3/12 border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-right">{item_m.display_key }</td>                   
                        <td className="lg:w-3/12 border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-right">{item_m.display_value }</td>
                        <td className="lg:w-2/12 border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-center"></td>                   
                        <td className="lg:w-2/12 border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-center"></td>                   
                        <td className="lg:w-2/12 border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-center"></td>                   
                      </tr>
                      }
                      </>
                    )
                    })
                }
                </>
              )
              })}
                </tbody>
              </table>
            </div> 
            <div className="flex-auto shadow-lg rounded-lg bg-white mt-8">
            <table className="border-collapse table-auto w-full text-sm">
            <thead></thead>
            <tbody>
               {order.shipping_lines.map(line => {
                  return (
                <>  
               
                <tr key={line.meta_data.id}>
                  <td className="lg:w-1/12 border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
                    <img alt="..." className="align-middle border-none" src="/img/delivery.png"/>
                  </td>

                  <td className="lg:w-8/12 border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">{line.method_title}</td>
                  <td className="lg:w-1/12 border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-center"></td>
                  <td className="lg:w-1/12 border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-center"></td>
                  <td className="lg:w-1/12 border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-center">₪{line.total}</td>
                </tr>
                </>
              )
              })}
              </tbody>
               </table>
              </div>
              <div className="flex-auto shadow-lg rounded-lg bg-white mt-8">
                <table className="border-collapse table-auto w-full text-sm">
                <tbody className="bg-white dark:bg-slate-800">
                  <tr>
                    <td className="lg:w-1/12 border-b border-slate-100 font-bold dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-left"></td>
                    <td className="lg:w-1/12 border-b border-slate-100 font-bold dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-left"></td>
                    <td className="lg:w-1/12 border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-left"></td>
                    <td className="lg:w-8/12 border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-left">סכום משנה של פרטים:</td>
                    <td className="lg:w-1/12 border-b border-slate-100 font-bold dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-center">₪{(order.total - order.shipping_total).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="lg:w-1/12 border-b border-slate-100 font-bold dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-left"></td>
                    <td className="lg:w-1/12 border-b border-slate-100 font-bold dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-left"></td>
                    <td className="lg:w-1/12 border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-left"></td>
                    <td className="lg:w-8/12 border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-left">משלוח:</td>
                    <td className="lg:w-1/12 border-b border-slate-100 font-bold dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-center">₪{order.shipping_total}</td>
                  </tr>
                  <tr>
                    <td className="lg:w-1/12 border-b border-slate-100 font-bold dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-left"></td>
                    <td className="lg:w-1/12 border-b border-slate-100 font-bold dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-left"></td>
                    <td className="lg:w-1/12 border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-left"></td>
                    <td className="lg:w-8/12 border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-left">סך כל ההזמנה:</td>
                    <td className="lg:w-1/12 border-b border-slate-100 font-bold dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-center">₪{order.total}</td>
                  </tr>
                </tbody>
              
          </table>
        </div>   
      </div>
    </>
  );
}
