const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { default: axios } = require("axios");
const app = express();
require("dotenv").config();
app.use(express.json());
app.use(cors());
app.use(bodyParser.text({ type: "text/plain" }));

app.post("/initiate-payment", async (req, res) => {
  try {
    console.log("payment initiated");
    const transaction = await axios.post(
      process.env.TIGOPESA_PAYMENT_PUSH_URL,
      req.body
    );
    res.status(200).send({ status: true, transaction });
  } catch (error) {
    res
      .status(500)
      .send({ status: false, error, message: "Failed to initiate payment" });
  }
});

app.post("/callback", async (req, res) => {
  try {
    const transaction = req.body;
    const callback = await axios.post(process.env.SME_CALLBACK, transaction);
    res.status(200).send(callback.data);
  } catch (error) {
    res
      .status(500)
      .send({ status: false, error, message: "Error processing callback" });
  }
});
app.get("/", (req, res) => {
  try {
    res.status(200).send("Tigo SME payment gateway");
  } catch (error) {
    res
      .status(500)
      .send({ status: false, error, message: "Internal server error" });
  }
});
app.listen(process.env.APPLICATION_PORT, () => {
  console.log(`Server started at port ${process.env.APPLICATION_PORT}`);
});
