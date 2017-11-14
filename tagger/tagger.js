const fs = require('fs');
const path = require('path');

function Tagger()
{
  // using a sync version is appropriate during module loading
  let filename = './config/local.js';
  try {
    fs.statSync(__dirname + '/' + filename);
  } catch (err) {
    filename = './config/default.js';
  }

  this.config = require(filename);
}

Tagger.prototype.getAll = function (items, callback)
{
  if (items === undefined)
    return callback(new Error('Articles are empty. Please, provide a specified object'), null);

  if (this.config === undefined)
    return callback(new Error('Tags config is empty. Please, provide a specified object'), null);

  let i = 0;
  let tags = {};
  for (let id in items) {
    let item = items[id];
    if (item['tags'] === undefined) {
      tags[id] = this.getTags(item['resolved_title'], item['given_url']);
    }
  }

  return callback(null, tags);
}

Tagger.prototype.getTags = function (title, url)
{
  const tags = [];

  let canApplyRule = (rules, title, url) => {
    if (rules.link !== undefined) {
      for(let i in rules.link) {
        let regex = new RegExp(rules.link[i], 'ui');
        if (regex.test(url))
          return true;
      }
    }

    if (rules.title !== undefined) {
      for(let i in rules.title) {
        let regex = new RegExp(rules.title[i], 'ui');
        if (regex.test(title))
          return true;
      }
    }
    return false;
  }

	for (let label in this.config) {

    let config = this.config[label];
    if (config.rule !== undefined) {
      if (canApplyRule(config.rule, title, url)) {
        tags.push(label);
        for (let subLabel in config.children) {
          if (config.children[subLabel].rule !== undefined) {
            if (canApplyRule(config.children[subLabel].rule, title, url)) {
              tags.push(subLabel);
              break;
            }
          }
        }
        break;
      }
    }

    if (config.children === undefined) continue;

    for (let subLabel in config.children) {
      if (config.children[subLabel].rule !== undefined) {
        if (canApplyRule(config.children[subLabel].rule, title, url)) {
          tags.push(label);
          tags.push(subLabel);
          break;
        }
      }
    }

    if (tags.length) break;
  }

  if (!tags.length)
    tags.push('TBD'); // to be deleted

  return tags;
}


module.exports = Tagger;
