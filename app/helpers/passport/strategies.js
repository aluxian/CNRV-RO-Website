module.exports = {
  facebook: {
    name: 'Facebook'
  , keyField: 'id'
  , parseProfile: function (profile) {
      var userData = {
        givenName: profile.name.givenName || profile.username
      , familyName: profile.name.familyName
      , role: 'user'
      , email: profile.emails[0].value
      , username: profile.username
      , avatar: '//graph.facebook.com/' + profile.id + '/picture?height=100&width=100'
      };
      return userData;
    }
  }
};
