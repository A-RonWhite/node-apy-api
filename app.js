const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const { puppeteerScrapper, calculateAPY } = require("./webScrapper");
const { firebaseInit, getFirebaseDoc } = require("./firebaseFunctions");
const {
  calculateTotalAverage,
  calculate30DayAverage,
} = require("./helperFunction");

const cron = require("node-cron");

let franciumAPY = 0;
let tulipAPY = 0;
let basisAPY = 0;

let vaultTokens;
let apyObj = {};
let apyAveragesObj = {};

const db = firebaseInit();

let basisAvg;
let basisMonthAvg;
let tulipAvg;
let tulipMonthAvg;
let francAvg;
let francMonthAvg;

//Run every 15 mins
cron.schedule("*/1 * * * *", () => {
  let basisAPYDump = getFirebaseDoc("BASIS", db);
  let tulipAPYDump = getFirebaseDoc("Tulip", db);
  let franciumAPYDump = getFirebaseDoc("Francium", db);

  Promise.all([basisAPYDump, tulipAPYDump, franciumAPYDump]).then(
    ([bObj, tObjs, fObjs]) => {
      basisAvg = calculateTotalAverage(bObj._fieldsProto);
      basisMonthAvg = calculate30DayAverage(bObj._fieldsProto);
      tulipAvg = calculateTotalAverage(tObjs._fieldsProto);
      tulipMonthAvg = calculate30DayAverage(tObjs._fieldsProto);
      francAvg = calculateTotalAverage(fObjs._fieldsProto);
      francMonthAvg = calculateTotalAverage(fObjs._fieldsProto);

      apyAveragesObj = {
        totalAvg: {
          basis: basisAvg,
          tulip: tulipAvg,
          francium: francAvg,
        },
        monthAvg: {
          basis: basisMonthAvg,
          tulip: tulipMonthAvg,
          francium: francMonthAvg,
        },
      };

      console.log(apyAveragesObj);
    }
  );
});

//every 5 mins
cron.schedule("*/1 * * * *", () => {
  franciumAPY = puppeteerScrapper(
    "https://francium.io/app/lend",
    '//*[contains(text(), "BASIS")]/parent::*/parent::*/td[2]',
    "Francium: "
  );
  tulipAPY = puppeteerScrapper(
    "https://tulip.garden/lend",
    '//*[contains(text(), "BASIS")]/parent::*/parent::*/parent::*//*[contains(text(), "%")]',
    "Tulip: "
  );

  vaultTokens = puppeteerScrapper(
    "https://solscan.io/account/3sBX8hj4URsiBCSRV26fEHkake295fQnM44EYKKsSs51",
    '//*[@id="root"]/section/main/div/div[2]/div/div[1]/div/div[2]/div[4]/div[2]/text()[1]',
    "Solscan: "
  );

  Promise.all([franciumAPY, tulipAPY, vaultTokens]).then(
    ([franciumAPYVal, tulipAPYVal, vaultTokensVal]) => {
      //Promise.all keeps index based on order of promises called - franc, tulip, vaulttokens

      //clean up values
      franciumAPY = Math.floor(franciumAPYVal.replace(/[&\/\\#+()$~%]/g, ""));
      tulipAPY = Math.floor(tulipAPYVal.replace(/[&\/\\#+()$~%]/g, ""));

      //calc basis APY
      basisAPY = calculateAPY(vaultTokensVal.replace(/,/g, ""));

      apyObj = { basis: basisAPY, tulip: tulipAPY, francium: franciumAPY };
      console.log(apyObj);
    }
  );
});

var app = express();
app.use(cors(), helmet());

const port = process.envPORT || 8000;

app.get("/apy", (req, res) => {
  console.log(`API Key: ${req.query.API_KEY}`);

  if (req.query.API_KEY === env.process.APY_API_KEY) {
  }

  res.send(apyObj);
});

app.get("/avg-apy", (req, res) => {
  res.send(apyAveragesObj);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
