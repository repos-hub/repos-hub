const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User")

function initialize(passport) {
passport.use(
    new GitHubStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://127.0.0.1:5000/login/callback"
    }, async (accessToken, refreshToken, profile, cb) => {
      try {
        const user = await User.findOne({username: profile.username})
        if (!user) {
          const newuser = new User({
            username: profile.username
          })
          newuser.save()
        }
        await User.findOneAndUpdate({ username: profile.username}, { username: profile.username})
        return cb(null, profile)
      } catch (err) {
        console.log(err)
      }
    }
    )
  )
  
 passport.serializeUser((user, cb) => {
   return cb(null, user._json)
  })
  
  passport.deserializeUser(async (id, cb) => {
   // await User.findOne({username: user.username}, function (err, user) {
      cb(null, id)
  //  })
  }) 
}


module.exports = initialize