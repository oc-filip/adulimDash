import mongoose from 'mongoose';


const options = {
    useUnifiedTopology: false, 
    useNewUrlParser: true, 
  };
const connection = {};

async function dbConnect() {
    try {
            if (connection.isConnected) {
                return;
            }

            const db =  await mongoose.connect(process.env.MONGO_URI, options);
            

            connection.isConnected = db.connections[0].readyState;

       } catch (error) {
        console.log('DB Error',error);
    } 
}

export default dbConnect;
