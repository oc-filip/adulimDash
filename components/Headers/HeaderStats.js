import React from "react";

// components

import CardStats from "components/Cards/CardStats.js";

export default function HeaderStats({monthtotal,monthpickup,monthshipping,monthfailed}) {
  return (
    <>
      {/* Header */}
      <div className="relative py-4">
        <div className="mx-auto w-full">
          <div>
            {/* Card stats */}
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="סך כל ההזמנות החודש"
                  statTitle={monthtotal}
                  //statArrow="up"
                  //statPercent="3.48"
                  //statPercentColor="text-emerald-500"
                  //statDescripiron="Since last month"
                  statIconName="far fa-chart-bar"
                  statIconColor="bg-blueGray-600"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="משלוחים"
                  statTitle={monthshipping}
                  //statArrow="down"
                  //statPercent="3.48"
                  //statPercentColor="text-red-500"
                  //statDescripiron="Since last week"
                  statIconName="far fa-chart-bar"
                  statIconColor="bg-blueGray-600"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="איסוף עצמי"
                  statTitle={monthpickup}
                  //statArrow="down"
                  //statPercent="1.10"
                  //statPercentColor="text-orange-500"
                  //statDescripiron="Since yesterday"
                  statIconName="far fa-chart-bar"
                  statIconColor="bg-blueGray-600"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="שגויים"
                 statTitle={monthfailed}
                  //statArrow="up"
                  //statPercent="12"
                  //statPercentColor="text-emerald-500"
                  //statDescripiron="Since last month"
                  statIconName="far fa-chart-bar"
                  statIconColor="bg-blueGray-600"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
