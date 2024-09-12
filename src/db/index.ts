import mongoose from "mongoose";

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URI as string).then(()=>{
    console.log('db is connected')
}).catch((err)=>{
    console.log('db conection failed', err)
});