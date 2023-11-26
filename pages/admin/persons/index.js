import React from "react";
import fetch from 'isomorphic-unfetch';
import PersonsTable from "components/Persons/PersonsTable.js";

import Admin from "layouts/Admin.js";

export default function  Persons ({ totalPersons })  {
  return (
    <>

      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <PersonsTable totalPersons={totalPersons}/>
        </div>
      </div>
    </>
  );
}


export const getServerSideProps = async () => {
  const res = await fetch(`${process.env.API_URL}/persons/gettotals`);
  const  persons  = await res.json();
  const totalPersons = persons.total;

  return {
    props: {
      totalPersons
    },
  };
  
}

Persons.layout = Admin;
