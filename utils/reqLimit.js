const { rateLimit } = require("express-rate-limit");

function rateLimitter(time, timeType, maxReq, message) {
  let limit = rateLimit({
    windowMs: time ? time : 15 * 60 * 1000, // 15 minutes
    limit: maxReq ? maxReq : 50, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Set `RateLimit` and `RateLimit-Policy` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
      status: false,
      code: "TOO_MANY_REQUESTS",
      message:
        message +
          `, Please Try again after ${
            time ? time + " " + timeType : "15 minutes"
          }` ||
        ` Too Many Requests, Please Try again after ${
          time ? time + " " + timeType : "15 minutes"
        }`,
    },
    // store: ... , // Use an external store for more precise rate limiting
  });

  return limit;
}

module.exports = rateLimitter;
