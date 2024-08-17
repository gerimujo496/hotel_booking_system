const errors = require("../../constants/errors");

const availableRoomsOnSpecificDatesAuthorization = (req, res, next) => {
  //both client and managers are allowed to access this endpoint
  return next();
};

const getRoomAuthorization = (req, res, next) => {
  if (!req.user.isManager) return res.status(403).send(errors.FORBIDDEN);
  next();
};

const createRoomAuthorization = (req, res, next) => {
    if (!req.user.isManager) return res.status(403).send(errors.FORBIDDEN);
    next();
  };

  const updateRoomAuthorization = (req, res, next) => {
    if (!req.user.isManager) return res.status(403).send(errors.FORBIDDEN);
    next();
  };

  const deleteRoomAuthorization = (req, res, next) => {
    if (!req.user.isManager) return res.status(403).send(errors.FORBIDDEN);
    next();
  };

const exportObj = {
  availableRoomsOnSpecificDatesAuthorization,
  getRoomAuthorization,
  createRoomAuthorization,
  updateRoomAuthorization,
  deleteRoomAuthorization
};
module.exports = exportObj;
