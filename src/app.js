import express from "express";
const app = express();
const PORT = 7777;

app.get("/", (req, res) => {
  res.send("welcome to dashboard");
});

app.listen(PORT, () => {
  console.log("server is listening on port", PORT);
});
