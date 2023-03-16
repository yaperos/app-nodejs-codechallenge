'use strict'

const moment = require(`moment-timezone`)
moment.locale(`es`)
moment.tz.setDefault(`America/Lima`)

module.exports = {
  getCurrentDate () {
    return moment().format(`YYYY-MM-DD`)
  },

  getCurrentDateTime () {
    return moment().tz(`America/Lima`).format(`YYYY-MM-DD HH:mm:ss`)
  },

  getCurrentDateAndHour () {
    return moment().format(`YYYY-MM-DD HH:mm:ss`)
  },

  getSecondsBetweenDates (date1, date2) {
    const newDate1 = moment(date1).format(`YYYY-MM-DD HH:mm:ss`)
    const newDate2 = moment(date2).format(`YYYY-MM-DD HH:mm:ss`)
    return moment(newDate2).diff(newDate1, `seconds`)
  },

  getDay () {
    const day = moment().format(`dddd`)
    return day[0].toUpperCase() + day.slice(1)
  },

  addHourToDate (hour) {
    const currentDate = this.getCurrentDate()
    return moment(`${currentDate} ${hour}`, `YYYY/MM/DD HH:mm a`)
  },

  validateBetweenDate (startTime, endTime) {
    return moment().isBetween(startTime, endTime, null, `[]`)
  },

  formatDateAndHour (startTime) {
    return moment(startTime, `YYYY-MM-DD HH:mm:ss`)
  }
}
