const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User")

function initialize(passport) {
passport.use(
    new GitHubStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: `${process.env.URL}/login/callback`
    }, async (accessToken, refreshToken, profile, cb) => {
      try {
        console.log(profile)
        const user = await User.findOne({username: profile.username})
        if (!user) {
          const newuser = new User({
            username: profile.username,
            isAdmin: false
           })
          newuser.save()
        }
        await User.findOneAndUpdate({ username: profile.username}, { username: profile.username})
        return cb(null, { profile, accessToken })
      } catch (err) {
        console.log(err)
      }
    }
    )
  )
  
 passport.serializeUser((user, cb) => {
  const profile = user.profile._json
  const accessToken = user.accessToken
   return cb(null, {profile, accessToken})
  })
  
  passport.deserializeUser(async (id, cb) => {
   // await User.findOne({username: user.username}, function (err, user) {
      cb(null, id)
  //  })
  }) 
}


module.exports = initialize