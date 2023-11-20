import React from "react";
import Sidebar from "components/Sidebar/Sidebar.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";
import PageLoader from "components/PageLoader/PageLoader.js";
import Router from "next/router";

import {getSession} from "next-auth/client";
import { useEffect, useState } from "react";


export default function Admin({ children }) {

  const [ isLoading, setisLoading ] = useState(true);
  useEffect( () => {
    getSession().then((session) => {
      if(!session) {
        window.location.href = 'https://dash.star.co.il/auth/login';
      }else{

        console.log('Session', session)
        setisLoading(false);
      }
    })
  },[]);


  Router.events.on("routeChangeStart", () => {
    setisLoading(true);
  });
  
  
  Router.events.on("routeChangeComplete", () => {
    setisLoading(false);
  });
  
  Router.events.on("routeChangeError", () => {
    setisLoading(false);
  });


  return (
    <>
      {isLoading && <PageLoader /> ? <PageLoader /> :  
      <>
      <Sidebar />
      <div className="relative md:mr-64 rtl bg-blueGray-100">
        <div className="px-4 md:px-4 mx-auto w-full relative">
      
          
          {children}
          <FooterAdmin />
        </div>
      </div>
      </>
      }
    </>
  );
};

