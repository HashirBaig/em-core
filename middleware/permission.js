const { ACCESS_DENIED, ACCESS_DENIED_MESSAGE } = require("../common/messages")

// middleware for doing role-based permissions
const permission = (...permittedRoles) => {
  // return a middleware
  return (request, response, next) => {
    const { user } = request

    if (user && permittedRoles.includes(user.role)) {
      next() // role is allowed, so continue on the next middleware
    } else {
      response.status(403).json({
        status: ACCESS_DENIED,
        message: ACCESS_DENIED_MESSAGE,
      }) // user is forbidden
    }
  }
}

module.exports = permission
