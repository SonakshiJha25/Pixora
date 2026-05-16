import refreshUserCreditsFromDb from "../utils/refreshUserCreditsFromDb.js";

/** IST rollover runs in Mongo via ensureDailyCredits — must run after JWT so req.user.id is set. */
export default async function creditRefreshMiddleware(req, res, next) {
  try {
    if (!req.user?.id) return next();
    await refreshUserCreditsFromDb(req.user.id);
    next();
  } catch (err) {
    next(err);
  }
}
