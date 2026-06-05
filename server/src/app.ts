import express from "express";
import {PORT} from "./config/env.js"
const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to the subscription tracker api");
});
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
