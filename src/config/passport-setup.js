const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: '876036921794-d74j29b5ggdptlhono1cui9kepa46928.apps.googleusercontent.com', // process.env.GOOGLE_CLIENT_ID,
      clientSecret: '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', // process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      // Qui puoi gestire l'utente, ad esempio salvarlo nel database
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});