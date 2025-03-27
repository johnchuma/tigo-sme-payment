const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { default: axios } = require("axios");
const {
  requestForPaymentPush,
  processCallback,
} = require("./payment.controller");
const app = express();
require("dotenv").config();
app.use(express.json());
app.use(cors());
app.use(bodyParser.text({ type: "text/plain" }));

app.post("/initiate-payment", requestForPaymentPush);

app.post("/callback", processCallback);

app.get("/", (req, res) => {
  try {
    res.status(200).send("Tigopesa SME payment gateway");
  } catch (error) {
    res.status(500).send({ status: false, message: "Internal server error" });
  }
});

app.listen(process.env.APPLICATION_PORT, () => {
  console.log(`Server started at port ${process.env.APPLICATION_PORT}`);
});
