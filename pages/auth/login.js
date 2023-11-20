import React from "react";
import Link from "next/link";
import { useRef, useEffect, useState } from 'react';
import { signIn } from 'next-auth/client';
import { useRouter } from 'next/router';
import {getSession} from "next-auth/client";
import PageLoader from "components/PageLoader/PageLoader.js";

import Auth from "layouts/Auth.js";

export default function Login() {

  const usernameInputRef = useRef();
  const passwordInputRef = useRef();


  const router = useRouter();

  const [ isLoading, setisLoading ] = useState(true);
  const [ errMsg, seterrMsg ] = useState();
  const [ userIP, setuserIP ] = useState();
  const [ userCountry, setuserCountry ] = useState();
  const [ accessStatus, setaccessStatus ] = useState();
  const [ accessStatusType, setaccessStatusType ] = useState();

  async function getGeoInfo() {
    const res = await fetch('https://ipapi.co/json/');
    const geoinfo = await res.json();
    console.log('GeoInfo',geoinfo);

    setuserIP(geoinfo.ip);
    setuserCountry(geoinfo.country_name);

    if(geoinfo.country_name == "North Macedonia" || geoinfo.country_name == "Israel"){
      setaccessStatusType(true);
      setaccessStatus("Allowed");
    } else {
      setaccessStatusType(false);
      setaccessStatus("Not Allowed");
    }
  }
  
  useEffect( () => {
    getGeoInfo();
    getSession().then((session) => {
      if(session) {
        router.replace('/admin/dashboard');
      }else{
        setisLoading(false);
      }
    })
  },[]);

  if(isLoading) {
      return <PageLoader />
  }

  async function submitHandler(event) {
    event.preventDefault();
    setisLoading(true);


    const enteredUsername = usernameInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    // optional: Add validation


      const result = await signIn('credentials', {
        redirect: false,
        username: enteredUsername,
        password: enteredPassword,
      });

     
      

      if (!result.error) {
        // set some auth state
        router.replace('/admin/dashboard');
      }
      else{
        seterrMsg(result.error);
        setisLoading(false);
      }

     
     
  }

  return (
    <>
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          
          <div className="w-full lg:w-3/12 px-4 mb-8">
            <img alt="..." className="relative align-middle mx-auto border-none px-6 mb-4" src="/img/star_logo.png"/>
            <p className="relative text-center font-bold text-3xl text-blueGray-600">התחברות</p>
            <p className="relative text-center font-bold  text-blueGray-600 mt-4">IP: {userIP}</p>
            <p className="relative text-center font-bold  text-blueGray-600">Country: {userCountry}</p>
            <p className="relative text-center text-blueGray-600 font-bold">Access Status:  <span className={accessStatus === "Allowed" ? 'text-emerald-600' : 'text-red-500'}>{accessStatus}</span></p>
          </div>
        </div>
        <div className="flex content-center items-center mt-10 rtl justify-center h-full">
        {accessStatusType && (
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-100 border-0">
              <div className="flex-auto px-4 lg:px-10 py-10 pt-10">
           
                <form onSubmit={submitHandler}>
                  <div className="relative w-full mb-3">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="username">שם משתמש</label>
                    <input id="username" type="text"
                      className="border-0 px-3 py-3 placeholder-blueGray-600 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="" required ref={usernameInputRef}
                    />
                  </div>

                  <div className="relative w-full mb-3">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="password">סיסמא</label>
                    <input type="password" id="password"
                      className="border-0 px-3 py-3 placeholder-blueGray-600 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="" required ref={passwordInputRef}
                    />
                  </div>

                  <div className="text-center mt-6">
                    <button 
                      className="bg-blueGray-600 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      type="submit"
                    >
                      התחבר
                    </button>
                  </div>
                  {errMsg && (
                  <div className="mt-6 relative text-center">
                    <h1 id="message" className="text-red-500 font-bold">{errMsg}</h1>
                  </div>
                  )}
                </form>
              </div>
            </div>
            <div className="flex flex-wrap mt-6 relative">
              {/* <div className="w-1/2">
                <a href="#" onClick={(e) => e.preventDefault()} className="text-blueGray-200">
                  <small>Forgot password?</small>
                </a>
              </div>
              <div className="w-1/2 text-right">
                <Link href="/auth/register">
                  <a href="#" className="text-blueGray-200">
                    <small>Create new account</small>
                  </a>
                </Link>
              </div> */}
            </div>
          </div>
          )}
        </div>
      </div>
    </>
  );
}

Login.layout = Auth;
