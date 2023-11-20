import React from "react";
import { useRouter } from 'next/router';
import PageLoader from "components/PageLoader/PageLoader.js";

import {getSession} from "next-auth/client";
import { useEffect, useState } from "react";
export default function Index() {

  const router = useRouter();

  const [ isLoading, setisLoading ] = useState(true);


  useEffect(() => {
    getSession().then((session) => {
      if(!session) {
        window.location.href = '/auth/login';
      }else{
        const {pathname} = router
        if(pathname == '/' ){
          router.push('/admin/dashboard')
        }
        if(pathname == '.' ){
          router.push('/admin/dashboard')
        }

      }
    }) 
  });


  if(isLoading) {
    return <PageLoader />
}

  return (
    <>

    </>
  );
}

