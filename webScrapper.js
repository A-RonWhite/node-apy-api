const puppeteer = require("puppeteer-extra");

const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

const puppeteerScrapper = async (url, xPath, source) => {
  console.log(source, "starting...");

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  let timedOut = false;

  try {
    const page = await browser.newPage();

    // See if this fixes francium time out issue
    await page.setDefaultNavigationTimeout(0);
    await page.goto(url).catch(() => {
      console.log(`${source}timed out`);
    });

    await page.waitForTimeout(5000);

    const APYSelector = (await page.$x(xPath))[0];

    const text = await page.evaluate((el) => {
      return el.textContent;
    }, APYSelector);

    console.log("Text print", source, text);

    // tulip data not loading yet
    if (text === "0.00 %" || undefined || null) {
      await page.waitForTimeout(2000);
      text = await page.evaluate((el) => {
        return el.textContent;
      }, APYSelector);

      console.log("Text variable was 0, undefined or null - new value: ", text);
    }

    return text;
  } catch (e) {
    console.log("There was an error: ", e);
  } finally {
    console.log("Closing browser.");
    await browser.close();
  }
};

const calculateAPY = (vaultTokens) => {
  var t = 80 * (13194.444444444443 / vaultTokens) * 365;
  var x = Math.round(100 * (Math.pow(1 + t / 29200, 29200) - 1));
  return x;
};

module.exports = {
  puppeteerScrapper,
  calculateAPY,
};
