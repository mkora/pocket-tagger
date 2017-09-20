## pocket-tagger
Add tags to your Pocket unread articles

#### Usage

```
npm install
npm start
```

#### Configure 

1. Follow [the Pocket API Documentation](https://getpocket.com/developer/docs/authentication) to obtain a platform consumer key

2. Add a consumer key to a config file `config/default.json`

3. Add rules to a tagger config file `tagger/config/default.js`

```
 "your tag name goes in there" : {
  "rule" : {
   "link" : ["any regexp for an article url"],
   "title" : ["OR any regexp for an article title"]
  }
 }
```

