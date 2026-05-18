import userAuth from "./auth.js";
import creditRefreshMiddleware from "./creditRefresh.js";
import { areCreditsEnforced } from "../config/creditsEnabled.js";

/** Authenticated routes — credit refresh only when enforcement is enabled. */
export default areCreditsEnforced() ? [userAuth, creditRefreshMiddleware] : [userAuth];
