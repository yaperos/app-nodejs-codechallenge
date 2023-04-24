const moment = require('moment-timezone');

const TRANSACTION_STATUSES = {
  pending: 1,
  approved: 2,
  rejected: 3
};

const BROKER = 'kafka:9092';

const CURRENT_DATETIME =  moment().tz("America/Costa_Rica").format('YYYY-MM-DD h:mm:ss');

module.exports = {
  TRANSACTION_STATUSES,
  CURRENT_DATETIME,
  BROKER
}