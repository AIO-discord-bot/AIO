module.exports = async (req, res, next) => {
  if (!req.session.user) {

    const redirectURL = req.originalUrl.includes("login") || req.originalUrl === "/" ? "/servers" : req.originalUrl;
    console.log(redirectURL)
    const state = Math.random().toString(36).substring(5);
    console.log(state)
    req.client.states[state] = redirectURL;
    return res.redirect(`/api/login?state=${state}`);
  }
  return next();
};
