const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { default: axios } = require("axios");
const { requestForPaymentPush } = require("./payment.controller");
const app = express();
require("dotenv").config();
app.use(express.json());
app.use(cors());
app.use(bodyParser.text({ type: "text/plain" }));

app.post("/initiate-payment", requestForPaymentPush);

app.post("/callback", async (req, res) => {
  try {
    const transaction = req.body;
    const callback = await axios.post(process.env.SME_CALLBACK, transaction);
    res.status(200).send(callback.data);
  } catch (error) {
    res
      .status(400)
      .send({ status: false, message: "Error processing callback" });
  }
});

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
