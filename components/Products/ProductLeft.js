import React, { useEffect, useState, useRef } from "react";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Snackbar from '@mui/material/Snackbar';


export default function ProductLeft( { product } ) {

  const [selectType, setSelectType] = useState(product.type);
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType]= useState('error');
  const [alertContent, setAlertContent] = useState('');
 
  let editorRef = useRef();
  const { CKEditor, ClassicEditor } = editorRef.current || {}; 

  let [loaded, setLoaded] = useState(false);

 useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor, // v3+
      ClassicEditor: require("@ckeditor/ckeditor5-build-classic"),
    };

    setLoaded(true);
  }, []); // run on mounting



  const ChangeType = async (selectedType) => {

    if (window.confirm(`Are you sure you want to change product type?`)) {
        
        changeProductType(product.id, selectedType)
 
    }
  };

  const changeProductType = async (id, type )=> {
    const res = await fetch(`${process.env.API_URL}/products/updatetype`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id, type}),
    });
  
    const data = await res.json();
    setAlertType('info');
    setAlertContent(data.msg);
    setOpen(true);
    setSelectType(type);      
  }

  // Closing the Alert Message //
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };


  return (
    <>


      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
        <Alert severity={alertType} variant="filled">
          <AlertTitle sx={{ marginBottom: 0 }}> <strong>{alertContent}</strong></AlertTitle>
        </Alert>
      </Snackbar>
    
      <div key={product.id} className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
        <div className="rounded-t bg-blueGray-700 mb-0 px-6 py-6">
          <div className="text-center flex justify-between items-center">
            <h6 className="w-full lg:w-6/12 text-left text-white text-xl font-semibold"> Product {product.name} </h6>
            <div className="relative">
              <label className="mr-2 text-white text-xl">Type</label>
              <select className="mb-1" labelid="type-select-label" id="type-select" label="Type" value={selectType} onChange={(e) => ChangeType(e.target.value)}>
                  <option value="simple">Simple Product</option>
                  <option value="grouped">Grouped Product</option>
                  <option value="external">External/Affiliate Product</option>
                  <option value="variable">Variable Product</option>
              </select> 
            </div>  
          </div>
        </div>
        <div className="flex-auto px-4 lg:px-10 py-10 pt-4">
        <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                Product Info
              </h6>
          <form>
            
            <div className="flex flex-wrap">

              <div className="w-full px-4 lg:w-6/12">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm border focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    defaultValue={product.name}
                  />
                </div>
              </div>
              <div className="w-full px-4 lg:w-6/12">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Slug
                  </label>
                  <input
                    type="text"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm border focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    defaultValue={decodeURI(product.slug)}
                  />
                </div>
              </div>

              <div className="w-full lg:w-4/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Price
                  </label>
                  <input
                    type="text"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm border focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    defaultValue={product.price}
                  />
                </div>
              </div>

              <div className="w-full lg:w-4/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Sku
                  </label>
                  <input
                    type="text"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm border focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    defaultValue={product.sku}
                  />
                </div>
              </div>

              <div className="w-full px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Short Description
                  </label>
             
                 {loaded &&
                  <CKEditor
                  editor={ClassicEditor}
                  data={product.short_description}
                  onReady={(editor) => {
                    // You can store the "editor" and use when it is needed.
                    console.log("Editor is ready to use!", editor);
                  }}
                  onChange={(event, editor) => {  // do something when editor's content changed
                    const data = editor.getData();
                    console.log({ event, editor, data });
                  }}
                  onBlur={(event, editor) => {
                    console.log("Blur.", editor);
                  }}
                  onFocus={(event, editor) => {
                    console.log("Focus.", editor);
                  }}
                />}

              </div>
            </div>


            </div>

            

          </form>
        </div>
      </div>
    </>
  );
}
