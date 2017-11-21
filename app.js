const express = require('express');
const config = require('config');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const methodOverride = require('method-override');
const passport = require('passport');
const morgan = require('morgan');
const logger = require('./util/logger');
const Tagger = require('./tagger/tagger');

const T = new Tagger();

const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(session({
  secret: config.get('cookie.secret'),
  resave: false,
  saveUninitialized: true
}));
app.use(cookieParser());
app.use(morgan('combined'));

const pocket = require('./util/auth')();

app.use(passport.initialize());
app.use(passport.session());

logger.info(`For authentification go to http://localhost:${port}`);
app.get('/', passport.authenticate('pocket'), (req, res, next) => {
  if (!req.user) {
    res.send('You\'re not authorized.');
    logger.error('Authentication failed. Please check credentials');
    return next();
  }

  logger.info(`User ${JSON.stringify(req.user)} authorized`);
  logger.debug('Getting unreaded articles');

  pocket.getUnreadItems(req.user.accessToken, (err, items) => {
    if (err) return next(err);

    res.send(`Welcome ${req.user.username}!`);
    logger.info(`Found ${Object.keys(items.list).length} articles`);
    logger.debug('Running Tagger');

    /* eslint no-shadow: ["error", { "allow": ["err", "res"] }] */
    T.getAll(items.list, (err, tags) => {
      if (err) return next(err);

      const ids = Object.keys(tags);
      if (ids.length === 0) {
        logger.info('Nothing to save. All your articles were already categorized');
        return next();
      }

      logger.info(`Found tags for ${ids.length} articles`);

      const chunckSize = 50;
      let data = [];

      logger.debug(`${Math.round(ids.length / chunckSize) + 1} requests to be sent`);

      for (let i = 0; i < ids.length; i += 1) {
        data.push({
          action: 'tags_add',
          item_id: ids[i],
          tags: tags[ids[i]].join(',')
        });

        if (
          (((i + 1) % chunckSize === 0))
          || (i === (ids.length - 1))
        ) {
          pocket.modify(data, req.user.accessToken, (err, res) => {
            if (err) return next(err);
            logger.debug('Preparing to send a request');
            if (res.status === 1) {
              logger.info(`Data.length = ${res.action_results.length} was saved to the Pocket account`);
            } else {
              logger.error('An error occured while saving tags', res);
            }
            return res;
          });
          data = [];
        }
      }
      return null;
    });
    return null;
  });

  return null;
});

app.get(
  '/auth/pocket/callback',
  passport.authenticate('pocket', { failureRedirect: '/' }),
  (req, res) => res.redirect('/')
);

app.use((err, req, res, next) => {
  logger.error('An error occured', err.stack);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).send('Something went wrong!');
  return null;
});

app.listen(port, () => logger.debug(`App: listening on ${port}`));
