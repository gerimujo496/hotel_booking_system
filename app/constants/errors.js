module.exports = {
  NOT_FOUND: (entity, id) => `${entity} with the id: ${id} is not found.`,
  BOOKING_IS_EMPTY: `There are no bookings in the history.`,
  ROOMS_NOT_AVAILABLE_ON_THOSE_DATES: `There are no available rooms in the provided dates. `,
  ERROR_STATUS_500: (action, entity) =>
    `An error occurred while ${action} the ${entity}. `,
  INVALID_ID: `Invalid ID format`,
  USER_ALREADY_REGISTERED: `User already registered. `,
  UNAUTHORIZED: `Please log in with valid credentials and try again.`,
  FORBIDDEN: `You do not have permission to access this resource. If you believe this is an error, please contact the administrator.`,
  INVALID_CREDENTIALS: `The credentials you provided are incorrect. Please check your username and password and try again.`,
};
