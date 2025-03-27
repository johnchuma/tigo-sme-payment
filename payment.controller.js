const { default: axios } = require("axios");
const https = require("https");
const httpAgent = new https.Agent({
  rejectUnauthorized: false,
});

const createHeaders = async () => {
  try {
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cache-Control": "no-cache",
      Accept: "*/*",
    };

    const data = new URLSearchParams();
    data.append("username", process.env.TIGOPESA_USERNAME);
    data.append("password", process.env.TIGOPESA_PASSWORD);
    data.append("grant_type", "password");

    return await axios.post(process.env.TIGOPESA_ACCESS_TOKEN_URL, data, {
      headers: headers,
      httpsAgent: httpAgent,
    });
  } catch (error) {
    return error;
  }
};

const requestForPaymentPush = async (req, res) => {
  try {
    const { phone, amount, referenceId } = req.body;
    console.log(req.body);
    const headerResponse = await createHeaders();
    const accessToken = headerResponse.data.access_token;
    const payload = {
      CustomerMSISDN: phone,
      BillerMSISDN: process.env.TIGOPESA_BILLER_MSISDN,
      Amount: amount,
      Remarks: "Kwanza payment",
      ReferenceID: `${process.env.TIGOPESA_BILLER_CODE}${referenceId}`,
    };

    const headers = {
      Authorization: `bearer ${accessToken}`,
      "Content-Type": "application/json",
      Accept: "*/*",
      Username: process.env.TIGOPESA_USERNAME,
      Password: process.env.TIGOPESA_PASSWORD,
      "Cache-Control": "no-cache",
    };

    const pushRequestResponse = await axios.post(
      process.env.TIGOPESA_PUSH_URL,
      payload,
      {
        headers: headers,
        httpsAgent: httpAgent,
      }
    );
    res.status(200).send(pushRequestResponse.data);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: false,
      message: "Failed to initiate payment",
      error,
    });
  }
};

module.exports = { requestForPaymentPush };
