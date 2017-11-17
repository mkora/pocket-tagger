const config = require('config');
const logger = require('./logger');
const passport = require('passport');
const PocketStrategy = require('passport-pocket');

passport.serializeUser((user, done) => {
  logger.debug('Passport: serialize user', user);
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  logger.debug('Passport: deserialize user', obj);
  done(null, obj);
});

module.exports = () => {
  logger.debug('Passport: initializing pocket strategy');

  const consumerKey = config.get('web.consumer_key');
  const callbackURL = config.get('web.redirect_url');

  if (consumerKey === 'pocket customer key') {
    logger.error('No customer key was provided. Check config/[NODE_ENV].json');
    return null;
  }

  const pocketStrategy = new PocketStrategy(
    { consumerKey, callbackURL },
    (username, accessToken, done) => {
      process.nextTick(() => done(null, { username, accessToken }));
    }
  );
  passport.use(pocketStrategy);
  return pocketStrategy;
};
