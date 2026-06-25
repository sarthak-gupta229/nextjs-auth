import mongoose from "mongoose";
export async function connect() {
    try {
        await mongoose.connect(process.env.MONGO_URL!)
        const connection =  mongoose.connection;
        connection.on('connected',()=>{
            console.log("✅ mongoDB connected")
        })
         connection.on('error',(err)=>{
            console.log("❌ mongoDB connection error. make sure mongoDb is running" + err)
            process.exit()
        })

    } catch (error) {
        console.log("Something went Wrong ")
        console.log(error);
        
    }
}