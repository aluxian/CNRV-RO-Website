
module.exports = {
  facebook: {
    name: 'Facebook'
  , keyField: 'id'
  , parseProfile: function (profile) {
    console.log(profile);
      var userData = {
        givenName: profile.name.givenName || profile.username
      , familyName: profile.name.familyName
      , role: 'user'
      , email: profile.emails[0]
      , username: profile.username
      };
      return userData;
    }
  }
};
