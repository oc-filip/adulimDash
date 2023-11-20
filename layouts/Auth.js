import React from "react";

export default function Auth({ children }) {
  return (
    <>
      <main>
        <section className="relative w-full h-full py-10 min-h-screen">
          <div
            className="absolute top-0 w-full h-full bg-white bg-no-repeat bg-full"
          ></div>
          {children}
        </section>
      </main>
    </>
  );
}
