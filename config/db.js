import mongoose from "mongoose"

mongoose.set('strictQuery', false)

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`Database Connected ${conn.connection.host}`)
  } catch (error) {
    console.error(`Error: ${error.messsage}`)
    process.exit(1)
  }
}
