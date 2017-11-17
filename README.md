## Pocket Tagger

#### Overview

Add tags to your Pocket unread articles

#### Notes 

- Add a Pocket consumer key to a `config/*.json`

- To obtain a platform consumer key follow [the Pocket API Documentation](https://getpocket.com/developer/docs/authentication) 

- To add rules for tags create `tagger/config/local.js` file, or use the default config

- Example of `tagger/config/*.js`

```
  tech: {
    label: 'tech',
    rule: {
      title: ['tech',]
    },
    children: {
      news: {
        label: 'news',
        rule: {
          link: ['bloomberg.com', 'gizmodo.com',]
          title: ['Google', 'Amazon',]
        },
      },
      guide: {
        label: 'guide',
        rule: {
          link: ['medium.com',]
        },
      },
    }
  },
  other: {
    label: 'other',
    rule: {
      link: ['.com', '.org',]
    },
  },
```

#### Usage

```
npm install
npm start
```
