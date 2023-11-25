
import Persons from '../../../models/person';
import dbConnect from '../../../utils/dbConnect';

dbConnect();

export async function GetPersons() {

    try {

    const res = await fetch(`https://api.pipedrive.com/v1/persons?api_token=5bafa4354cf7e47f6dbfcd414d36877fbe1fa68a&start=0&limit=500`);
    const persons = await res.json();

    
    const data = await Persons.create(persons);

    console.log('persons', data)

    res.status(201).json({ success: true, status:"saved", data: data })



    } catch (error) {
        res.status(400).json({ success: false ,error: error});
    }

}    

