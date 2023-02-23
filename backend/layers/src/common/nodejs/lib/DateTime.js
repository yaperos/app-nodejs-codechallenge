"use strict";

const moment = require("moment-timezone");

const DEFAULT_TIMEZONE = "America/Lima";

class DateTime {
  static SIMPLE_FORMAT_DATE = "YYYY-MM-DD";
  static SIMPLE_FORMAT_DATE_TIME = "YYYY-MM-DD HH:mm:ss";
  static REQUEST_DATE_FORMAT = "DD-MM-YYYY_HH:mm:ss";

  constructor(date, tz) {
    this.dateObj = date
      ? moment(date).tz(tz ? tz : DEFAULT_TIMEZONE)
      : moment().tz(tz ? tz : DEFAULT_TIMEZONE);
  }

  format(format) {
    return format ? this.dateObj.format(format) : this.dateObj.format();
  }

  add(units, measurementUnit) {
    return new DateTime(this.dateObj.add(units, measurementUnit).format());
  }

  diff(dateToCompare, measurementUnit) {
    const dateObjToCompare =
      dateToCompare instanceof DateTime
        ? dateToCompare.dateObj
        : moment(dateToCompare);

    return this.dateObj.diff(dateObjToCompare, measurementUnit);
  }

  getStartMonthDate() {
    return new DateTime(this.dateObj.startOf("month").format());
  }

  getEndMonthDate() {
    return new DateTime(this.dateObj.endOf("month").format());
  }

  static unix(date) {
    return moment(date).unix()
  }
}

module.exports = DateTime;
