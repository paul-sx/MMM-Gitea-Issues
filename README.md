# Module: Magic Mirror Gitea Issues (MMM-Gitea-Issues)


This is a module for <a href="https://github.com/MichMich/MagicMirror">Magic
Mirror</a>.

`MMM-Gitea-Issues` displays cards with issues listed in the designated Gitea
repositories.  You have to supply the gitea server.

## Installation
1. Navigate to your MagicMirror `modules` directory.
2. Execute `git clone https://github.com/paul-sx/MMM-Gitea-Issues.git`
3. Add the module to your MagicMirror's `config.js` file.

## Using the Module
To use this module, add it to the modules array in the `config/config.js` file:

```javascript
modules: [
{
   module: 'MMM-Gitea-Issues',
   position: 'top_left',
   header: 'Issues',
   config: {
      token: 'User token from gitea',
      updateInterval: 10, //Minutes
      showBody: false,
      repos: [
         'https://gitea.example.org/owner/repo'
      ],
      ignoreTags: [
         'do not show this issue'
      ]
   }
}
]
```

### Parameters

* `token`: User access token
* `updateInterval`: Update time in minutes
* `showBody`: Display the issue body in addition to the heading
* `repos`: Full URL to repo to show add URL parameters
* * `state=[open|closed|all]`: Issue state
* * `labels=one,two,three`: Include only issues with one or more of the comma separated labels
* * `q=search`: Show only issues that match the query
* * `limit=#`: Limit to this # of issues
* `ignoreTags`: Do not show issues with any of these tags. (Overrides labels query)


