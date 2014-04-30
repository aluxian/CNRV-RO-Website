
module.exports = {
  facebook: {
    name: 'Facebook'
  , keyField: 'id'
  , parseProfile: function (profile) {
      var email = profile.emails[0].value;
      var avatarHash = require('crypto').createHash('md5').update(email).digest('hex');
      var userData = {
        givenName: profile.name.givenName || profile.username
      , familyName: profile.name.familyName
      , role: 'user'
      , email: email
      , username: profile.username
      , avatar: '//www.gravatar.com/avatar/' + avatarHash + '?s=100&d=mm'
      };
      return userData;
    }
  }
};
