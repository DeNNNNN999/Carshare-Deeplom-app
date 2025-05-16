const auth = require('./auth');
const admin = require('./admin');
const manager = require('./manager');
const errorHandler = require('./errorHandler');

module.exports = {
  auth,
  admin,
  manager,
  errorHandler
};
