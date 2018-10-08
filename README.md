## Pocket Tagger

### Overview

Adds tags to unread articles under your [Pocket](https://getpocket.com/) account

### Before and After

**Before running the pocket-tagger:**

![Pocket articles list before](https://user-images.githubusercontent.com/31717889/33049137-a96ae7c0-ce2c-11e7-965c-011916547077.png)

**And After:**

![Pocket articles list after](https://user-images.githubusercontent.com/31717889/33049143-b025f564-ce2c-11e7-94d6-13847b064d83.png)

### Notes 

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
