module.exports = {
  'your-category': {
    label: 'your-category',
    title: 'your-title',
    rule: {
      link: [
        'rule-one', 'rule-two'
      ],
      title: [
        'or-rule-one', 'or-rule-two'
      ]
    },
    children: {
      label: 'your-sub-category',
      title: 'your-sub-title',
      rule: {
        link: [
          'other-rule-one', 'other-rule-two'
        ],
        title: [
          'or-other-rule-one', 'or-other-rule-two'
        ]
      }
    }
  }
}
