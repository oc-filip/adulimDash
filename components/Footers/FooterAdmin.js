import React from "react";

export default function FooterAdmin() {
  return (
    <>
      <footer className="w-full block py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center md:justify-center justify-center">
            <div className="w-full px-4">
              <div className="text-sm ltr text-gray-500 font-semibold py-1 text-center">

              stardash © {new Date().getFullYear()}{" "}
                Powered By:
                <a
                  href="#"
                  className="text-blueGray-500 hover:text-blueGray-700 text-sm font-semibold py-1"
                >
                  <img alt="..." className="inline-block align-middle px-4 border-none" src="/img/joni.png" />
                 </a>
               
                
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
