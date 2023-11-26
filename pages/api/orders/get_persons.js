import dbConnect from '../../../utils/dbConnect';

import Persons from '../../../models/person';

dbConnect();

export default async (req, res) => {

    try {

    const p = await fetch(`https://api.pipedrive.com/v1/persons?api_token=5bafa4354cf7e47f6dbfcd414d36877fbe1fa68a&start=0&limit=5`);
    const persons = await p.json();

    //console.log('persons', persons)
    const data = await Persons.insertMany(persons.data);

    

    res.status(201).json({ success: true, status:"saved" })



    } catch (error) {
        res.status(400).json({ success: false ,error: error});
    }

}    