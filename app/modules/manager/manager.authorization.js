const errors = require("../../constants/errors");

const approveBookingAuthorization = (req, res, next) => {
  if (!req.user.isManager) {
    return res.status(403).send(errors.FORBIDDEN);
  }
  next();
};

const getBookingHistoryAuthorization = (req, res, next) => {
  if (!req.user.isManager) {
    return res.status(403).send(errors.FORBIDDEN);
  }
  next();
};

const exportObj = {
  approveBookingAuthorization,
  getBookingHistoryAuthorization,
};

module.exports = exportObj;
