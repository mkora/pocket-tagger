const config = require('config');

const passport = require('passport');
const PocketStrategy = require('passport-pocket');

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

module.exports = function() {

  const consumerKey = config.get('web.consumer_key');
  const redirectUrl = config.get('web.redirect_url');

  if(consumerKey === "pocket costumer key") {
    console.log('Please, provide your pocket costumer key');
  }

  const pocketStrategy = new PocketStrategy({
    consumerKey: consumerKey,
    callbackURL: redirectUrl
  }, (username, accessToken, done) => {
    process.nextTick(() => {
      return done(null, {
        username: username,
        accessToken: accessToken
      });
    });
  });

  passport.use(pocketStrategy);

  return pocketStrategy;
}
