import mongoose from "mongoose";

async function connectDB(URL) {
  try {

    const connectionOptions = {
      dbName: "EchoDB",
    };

    mongoose.connection.on("connected", () => {
      console.log("Connected to database successfully");
    });

    mongoose.connection.on("error", (error) => {
      console.log("Error in connecting to databse.", error);
    });

    await mongoose.connect(URL,connectionOptions);
  } catch (error) {
    if (error.name === 'MongooseServerSelectionError') {
      console.error("Possible reasons:");
      console.error("1. MongoDB server not running");
      console.error("2. Incorrect connection URL");
      console.error("3. Network issues preventing connection");
    }

    console.error("Faild to connect database..", error);
    process.exit(1);
  }
}

export default connectDB;
