import mongoose from "mongoose";

async function connectDB(URL) {
  try {
<<<<<<< HEAD

    const connectionOptions = {
      dbName: "EchoDB",
    };

=======
>>>>>>> 2b262d1ed7ea6228942ffae4e5c01aacbb663b70
    mongoose.connection.on("connected", () => {
      console.log("Connected to database successfully");
    });

    mongoose.connection.on("error", (error) => {
      console.log("Error in connecting to databse.", error);
    });

<<<<<<< HEAD
    await mongoose.connect(URL,connectionOptions);
  } catch (error) {
  
=======
    await mongoose.connect(URL, { dbName: "EchoDB" });
  } catch (error) {
>>>>>>> 2b262d1ed7ea6228942ffae4e5c01aacbb663b70
    console.error("Faild to connect database..", error);
    process.exit(1);
  }
}

export default connectDB;
