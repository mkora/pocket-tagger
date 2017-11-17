const fs = require('fs');
const path = require('path');
const logger = require('../util/logger');

module.exports = class Tagger {
  constructor() {
    // @todo
    try {
      fs.statSync(path.resolve(__dirname, './config/local.js'));
      this.config = require('./config/local.js'); // eslint-disable-line global-require
    } catch (err) {
      this.config = require('./config/default.js'); // eslint-disable-line global-require
    }
  }

  getAll(items, callback) {
    if (items === undefined) {
      return callback(new Error('Articles are empty. Please, provide a specified object'), null);
    }

    if (this.config === undefined) {
      return callback(new Error('Tags config is empty. Please, provide a specified object'), null);
    }

    const tags = {};
    Object.keys(items).forEach((id) => {
      const item = items[id];
      if (item.tags === undefined) {
        tags[id] = this.getTags(item.resolved_title, item.given_url);
        logger.debug('Tagger: Found ', {
          tags: tags[id],
          url: item.given_url,
          title: item.resolved_title
        });
      }
    });
    return callback(null, tags);
  }

  getTags(title, url) {
    const canApplyRule = (rules, itemUrl, itemTitle) => {
      if (rules === undefined) return false;
      if (rules.link !== undefined) {
        for (let i = 0; i < rules.link.length; i += 1) {
          const regex = new RegExp(rules.link[i], 'ui');
          if (regex.test(itemUrl)) return true;
        }
      }
      if (rules.title !== undefined) {
        for (let i = 0; i < rules.title.length; i += 1) {
          const regex = new RegExp(rules.title[i], 'ui');
          if (regex.test(itemTitle)) return true;
        }
      }
      return false;
    };

    const tags = [];
    const labels = Object.keys(this.config);
    for (let i = 0; i < labels.length; i += 1) {
      const label = labels[i];
      const top = this.config[label];

      // add top level tag, if there rules for it
      if (canApplyRule(top.rule, url, title)) {
        tags.push(label);
      }

      // add second level tag, if there are rules for it
      if (top.children !== undefined) {
        const labelIns = Object.keys(top.children);
        for (let j = 0; j < labelIns.length; j += 1) {
          const labelIn = labelIns[j];
          const inner = top.children[labelIn];
          if (canApplyRule(inner.rule, url, title)) {
            // add top level if it's not found before
            if (tags.length === 0) tags.push(label);
            tags.push(labelIn);
            break;
          }
        }
      }

      if (tags.length) break; // if s/th found, stop searching
    }

    // if nothing found, it's considered trush
    if (!tags.length) tags.push('TBD'); // to be deleted

    return tags;
  }
};
