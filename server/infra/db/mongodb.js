import 'dotenv/config';
import { mongoose } from 'mongoose';

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI,{
            dbName: 'PaperWise'
        });
        console.log("Mongodb connected...");
    } catch (error) {
        console.log("Error connecting mongodb:", error.message);
    }
}

export default connectDb;