import mongoose from "mongoose";

async function connectDB(URL) {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Connected to database successfully");
    });

    mongoose.connection.on("error", (error) => {
      console.log("Error in connecting to databse.", error);
    });

    await mongoose.connect(URL, { dbName: "EchoDB" });
  } catch (error) {
    console.error("Faild to connect database..", error);
    process.exit(1);
  }
}

export default connectDB;
