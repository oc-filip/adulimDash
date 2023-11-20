import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "next-auth/client";

export default function Sidebar() {

  
  function logoutHandler() {
    signOut({ callbackUrl: 'https://dash.star.co.il/' });
  }

  const [collapseShow, setCollapseShow] = React.useState("hidden");
  const router = useRouter();
  return (
    <>
      <nav className="md:right-0 rtl md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
          {/* Toggler */}
          <button
            className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
            type="button"
            onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
          >
            <i className="fas fa-bars"></i>
          </button>
          {/* Brand */}
          <Link href="/admin/dashboard">
            <a
              
              className="md:block text-center md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
            >
              <img
              alt="..."
              className="mx-auto align-middle border-none px-6 mb-4"
              src="/img/logo.png"
            />
              
            </a>
          </Link>

          <div
            className={
              "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
              collapseShow
            }
          >
            {/* Collapse header */}
            <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-blueGray-200">
              <div className="flex flex-wrap">
                <div className="w-6/12">
                  <Link href="/admin/dashboard">
                    <a href="#"
                      className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
                    >
                      
                    </a>
                  </Link>
                </div>
                <div className="w-6/12 flex justify-end">
                  <button
                    type="button"
                    className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                    onClick={() => setCollapseShow("hidden")}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>


            <ul className="md:flex-col md:min-w-full flex flex-col list-none">
              <li className="items-center text-center">
                <Link href="/admin/dashboard">
                  <a
                    href="#"
                    className={
                      "text-xs uppercase py-1 text-lg font-bold block " +
                      (router.pathname.indexOf("/admin/dashboard") !== -1
                        ? "text-blueGray-700 underline hover:text-lightBlue-600"
                        : "text-blueGray-500 hover:text-blueGray-500")
                    }
                  >
                    {" "}
                    בית
                  </a>
                </Link>
              </li>

              <li className="items-center text-center">
                <Link href="/admin/orders">
                  <a
                    href="#"
                    className={
                      "text-xs uppercase py-1 text-lg font-bold block " +
                      (router.pathname.indexOf("/admin/orders") !== -1
                        ? "text-blueGray-700 underline hover:text-lightBlue-600"
                        : "text-blueGray-500 hover:text-blueGray-500")
                    }
                  >
                    {" "}
                    הזמנות
                  </a>
                </Link>
              </li>

              <li className="items-center text-center">
                <Link href="/admin/products">
                  <a
                    href="#"
                    className={
                      "text-xs uppercase py-1 text-lg font-bold block " +
                      (router.pathname.indexOf("/admin/products") !== -1
                        ? "text-blueGray-700 underline hover:text-lightBlue-600"
                        : "text-blueGray-500 hover:text-blueGray-500")
                    }
                  >
                    {" "}
                    מוצרים
                  </a>
                </Link>
              </li>

              <li className="items-center text-center">
                <Link href="/admin/product_categories">
                  <a
                    href="#"
                    className={
                      "text-xs uppercase py-1 text-lg font-bold block " +
                      (router.pathname.indexOf("/admin/product_categories") !== -1
                        ? "text-blueGray-700 underline hover:text-lightBlue-600"
                        : "text-blueGray-500 hover:text-blueGray-500")
                    }
                  >
                    {" "}
                    קטגוריות מוצרים
                  </a>
                </Link>
              </li>
              


            </ul>

            <hr className="my-4 md:min-w-full" />

            <ul className="md:flex-col md:min-w-full flex flex-col list-none">
              <li className="items-center">
               
                  <button
                    onClick={logoutHandler}
                    className="w-full bg-blueGray-600 active:bg-blueGray-600 text-white font-bold 
                    uppercase text-xs px-4 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                  >
                   
                   התנתק
                  </button>
                
              </li>
            </ul>  
          

           
          </div>
        </div>
      </nav>
    </>
  );
}
