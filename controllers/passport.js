const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User'); // Asegúrate de importar tu modelo de usuario
const config = require('../config/global');

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: config.googleClientId, // Tu ID de cliente de Google
      clientSecret: config.googleClientSecret, // Tu secreto de cliente de Google
      callbackURL: '/auth/google/callback', // URL de redirección después de la autenticación
    },
    async (token, tokenSecret, profile, done) => {
      // Verifica si el usuario ya existe en la base de datos
      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        return done(null, existingUser);
      }

      // Si el usuario no existe, crea un nuevo usuario en la base de datos
      const newUser = new User({
        googleId: profile.id,
        username: profile.displayName,
        // Otros campos del usuario, si es necesario
      });
      await newUser.save();
      done(null, newUser);
    }
  )
);
