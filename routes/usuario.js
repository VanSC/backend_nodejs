// Rutas usuario
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Crear un nuevo usuario (POST /api/usuarios)
router.post('/', userController.crearUsuario);

// Obtener un usuario (POST /api/usuarios/obtener)
router.post('/obtener', userController.obtenerUsuario);

// Editar un usuario (PUT /api/usuarios/editar/:userId)
router.put('/editar/:userId', userController.editarUsuario);

// Eliminar un usuario (DELETE /api/usuarios/eliminar/:userId)
router.delete('/eliminar/:userId', userController.eliminarUsuario);

// Obtener lista de usuarios (GET /api/usuarios)
router.get('/', userController.obtenerListaUsuarios);

module.exports = router;

