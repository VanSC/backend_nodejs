// Rutas usuario
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const passport = require('passport');

// Crear un nuevo usuario (POST /api/usuarios)
router.post('/', userController.crearUsuario);

// Obtener un usuario (POST /api/usuarios/obtener)
router.post('/obtener', userController.obtenerUsuario);

// Editar un usuario (PUT /api/usuarios/editar/:userId)
router.put('/editar/:userId', userController.editarUsuario);

// Eliminar un usuario (DELETE /api/usuarios/eliminar/:userId)
router.delete('/eliminar/:userId', userController.eliminarUsuario);

// Obtener lista de usuarios (GET /api/usuarios)
router.get('/lista', userController.obtenerListaUsuarios);

// Ruta para iniciar la autenticación con Google
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Ruta de redirección después de la autenticación de Google
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  // Redirige al usuario a la página principal o a donde desees después de la autenticación exitosa
  res.redirect('/obtener');
});


module.exports = router;

