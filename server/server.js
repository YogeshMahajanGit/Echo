import express from "express";
import userRouter from "./routes/userRoutes.js";

const app = express();

app.use("/api/user", userRouter);

//testing
app.get("/", (req, res) => {
  res.send("Welcome Home");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
