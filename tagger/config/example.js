module.exports = {
  tech: {
    label: 'tech',
    rule: {
      title: ['tech', 'digital',],
    },
    children: {
      news: {
        label: 'news',
        rule: {
          link: ['bloomberg.com', 'technologyreview.com', 'digg.com', 'gizmodo.com',],
          title: ['Google', 'Amazon',]
        },
      },
      guide: {
        label: 'guide',
        rule: {
          link: ['medium.com',],
        },
      },
    }
  },
  other: {
    label: 'other',
    rule: {
      link: ['.com', '.org',],
    },
  },
};
