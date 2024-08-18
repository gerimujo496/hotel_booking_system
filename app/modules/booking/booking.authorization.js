const errors = require("../../constants/errors");

const makeBookingAuthorization = (req, res, next) => {
  next();
};

const deleteBookingAuthorization = (req, res, next) => {
  next();
};

const getBookingAuthorization = (req, res, next) => {
  next();
};
const putBookingAuthorization = (req, res, next) => {
    next();
  };

  const getCurrentClient = (req, res, next)=>{
    if(!req.user.isManager) return res.status(403).send(errors.FORBIDDEN)
  }

  const getBookingHistoryAuthorization = (req, res, next) => {
    next();
  };

  const getVoucherDocumentAuthorization = (req, res, next) => {
    next();
  };

const exportObj = {
  makeBookingAuthorization,
  deleteBookingAuthorization,
  getBookingAuthorization,
  putBookingAuthorization,
  getCurrentClient,
  getBookingHistoryAuthorization,
  getVoucherDocumentAuthorization
};

module.exports = exportObj;
