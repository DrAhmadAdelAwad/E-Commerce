import mongoose from "mongoose";

const connectDB = async ()=>{
    await mongoose.connect(process.env.DB_URL).then(()=>{
        console.log('DB CONNECTED');
    }).catch((error)=>{
        console.log('FAILED to CONNECT' , error);
    })
}

export default connectDB