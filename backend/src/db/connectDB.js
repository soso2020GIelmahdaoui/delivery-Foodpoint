import mongoose from "mongoose";

export const connectDB=async()=>{
  try{
    const conn=await mongoose.connect(process.env.DATABASE_URL)
    console.log(`Mongoo cennected :${conn.connection.host}`)
  }catch(error){
    console.error(`Error connecting to MongoDB: ${error.message}`)
    process.exit(1) 
  }
}