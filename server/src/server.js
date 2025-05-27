import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.get("/api/auth/login", (req, res) => {
  res.send("Login rout");
});

app.get("/api/auth/signup", (req, res) => {
  res.send("Sign Up rout");
});

app.get("/api/auth/logout", (req, res) => {
  res.send("Logout rout");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
