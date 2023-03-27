const express = require("express");
const cors = require("cors");
const axios = require("axios");
require('dotenv').config()
const app = express();
const PORT = 8000;
app.use(cors());
app.use(express.json());

app.post("/compile", (req, res) => {
    //getting the required data from the request
    let code = req.body.code;
    let language = req.body.language;
    let input = req.body.input;

    let data = ({
        source_code : code,
        language_id : language,
        stdin : input
    });
    let config = {
        method: 'post',
        url: process.env.RAPID_API_URL,
        params: { base64_encoded: "false", fields: "*" },
        headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Host": process.env.RAPID_API_HOST,
            "X-RapidAPI-Key": process.env.RAPID_API_KEY,
        },
        data: data
    };
    //calling the code compilation API
    axios
      .request(config)
      .then(function (response) {
        console.log("res.data", response.data);
        const token = response.data.token;
        checkStatus(token).then((data)=>res.json(data));
        
      })
      .catch((err) => {
        let error = err.response ? err.response.data : err;
        console.log(error);
      });
})


const checkStatus = async (token) => {
    const options = {
      method: "GET",
      url: process.env.RAPID_API_URL + "/" + token,
      params: { base64_encoded: "false", fields: "*" },
      headers: {
        "X-RapidAPI-Host": process.env.RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.RAPID_API_KEY,
      },
    };
    try {
      let response = await axios.request(options);
      let statusId = response.data.status?.id;

      // Processed - we have a result
      if (statusId === 1 || statusId === 2) {
        // still processing
        setTimeout(() => {
          checkStatus(token)
        }, 2000)
        return
      } else {
        // setOutputDetails(response.data)
        console.log('response.data', response.data)
        return response.data
      }
    } catch (err) {
      console.log("err", err);
    }
  };

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
