import userAuth from "./auth.js";
import creditRefreshMiddleware from "./creditRefresh.js";

/** Authenticated routes that should apply IST daily rollover from MongoDB before handlers run. */
export default [userAuth, creditRefreshMiddleware];
