const express = require('express');
const path = require('path');
const config = require('config');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const methodOverride = require('method-override');

const	passport = require('passport');
const PocketStrategy = require('passport-pocket');

const Tagger = require('./tagger/tagger');
const T = new Tagger();

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

const pocket = require('./auth')();
app.use(passport.initialize());
app.use(passport.session());

app.get('/', passport.authenticate('pocket'), (req, res, next) => {
  if(req.user) {
    console.log('User authorized ' + JSON.stringify(req.user));

		pocket.getUnreadItems(req.user.accessToken, (err, items) => {
			if (err) return next(err);

      res.send(`Welcome ${req.user.username}!`);
      console.log('There are ' + Object.keys(items.list).length + ' unreaded items');

      console.log('Loading tags');
      T.getAll(items.list, (err, tags) => {
			  if (err) return next(err);
        let toSaveLength = Object.keys(tags).length;
        if (!toSaveLength) {
          console.log('Nothing to save. All your articles were already categorized');
          return;
        }
        console.log(toSaveLength + ' articles were categorized');

        let data = [], i = 0;
        const chunckSize = 50;
        for (let id in tags) {
          i++;
          data.push({
          	"action" : "tags_add",
          	"item_id" : id,
          	"tags": tags[id].join(',')
          });

          if (i % chunckSize === 0) {
            pocket.modify(data, req.user.accessToken, (err, res) => {
			        if (err) return next(err);
              if (res.status == 1) {
                console.log(`Data (of size ${res['action_results'].length}) was saved to the Pocket account`);
              } else {
                console.log(`An error occured while saving tags`);
                console.log(res);
              }
            });
            data = [];
          }
        }

        pocket.modify(data, req.user.accessToken, (err, res) => {
          if (err) return next(err);
          if (res.status == 1) {
            console.log(`Last data (of size ${res['action_results'].length}) was saved to the Pocket account`);
          } else {
            console.log(`An error occured while saving tags`);
            console.log(res);
          }
        });
      });

    });

	} else {
		res.send(`You're not authorized.`);
    console.log(`Can't find user to retreive information`);
    return next();
	}

});

app.get('/auth/pocket/callback', passport.authenticate('pocket', { failureRedirect: '/' }),
  function(req, res) {
      res.redirect('/');
  });

app.use(function(err, req, res, next) {
  console.error(err.stack);
  if (res.headersSent) {
      return next(err);
  }
  res.status(err.status || 500).send('Something went wrong!');
  res.render('error');
});

const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
