const calculateTotalAverage = (object) => {
  let apyTotal = 0;
  let length = 0;
  for (const apy in object) {
    apyTotal += parseInt(object[apy].integerValue);
    length++;
  }

  return Math.floor(apyTotal / length);
};

const calculate30DayAverage = (object) => {
  let start30DayAvg = new Date();
  let apyTotal = 0;
  let length = 0;

  //Set 30 day avg start date to compare to key date
  start30DayAvg = start30DayAvg.setDate(start30DayAvg.getDate() - 15);
  for (const date in object) {
    if (date >= start30DayAvg) {
      apyTotal += parseInt(object[date].integerValue);
      length++;
    }
  }

  return Math.floor(apyTotal / length);
};

module.exports = {
  calculateTotalAverage,
  calculate30DayAverage,
};
