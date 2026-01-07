const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();
dotenv.config();

app.use(cors())
app.use(express.raw({ type: '*/*' }));

const defaultHeader = {
  'Content-Type': "application/json",
  'x-api-key': process.env.API_KEY,
  'api-version': '1.0'
};

const adminHeader = {
  'Content-Type': "application/json",
  'x-api-key': process.env.API_KEY,
  'X-Incode-Hardware-Id': process.env.ADMIN_TOKEN,
  'api-version': '1.0'
};

app.post('/verify', async (req, res) => {
  const faceMatchData = JSON.parse(req.body.toString());
  const {token, transactionId, interviewToken} = faceMatchData;
  const verificationParams = { token,transactionId, interviewToken };
  
  let response={};
  try{
    const verifyAttemptUrl = `${process.env.API_URL}/omni/authentication/verify`;
    response = await doPost(verifyAttemptUrl, verificationParams, adminHeader);
  } catch(e) {
    console.log(e.message);
    res.status(500).send({success:false, error: e.message});
    return;
  }
  log = {
    timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
    data: {verificationParams, response}
  }
  res.status(200).send(response);
  console.log(log);
});


const doPost = async (url, bodyparams, headers) => {
  try {
    const response = await fetch(url, { method: 'POST', body: JSON.stringify(bodyparams), headers});
    if (!response.ok) {
      throw new Error('Request failed with code ' + response.status)
    }
    return response.json();
  } catch(e) {
    console.log({url, bodyparams, headers})
    throw new Error('HTTP Post Error: ' + e.message)
  }
}

const httpPort = 3000;

app.listen(httpPort, () => {
  console.log(`HTTP listening on: http://localhost:${httpPort}/`);
});

module.exports = app;