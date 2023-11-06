const jwt = require('jsonwebtoken');

const User = require("../models/User");
const config = require('../config/global');

exports.crearUsuario = async (req, res) => {

    try {
        
        const { username, email, password } = req.body;
        const user = new User(
            {
               username,
               email,
               password
            } 
         );

        
        user.password = await user.encryptPassword(user.password)
        await user.save();

        const token = jwt.sign({id: user._id}, config.secret, {
            expiresIn: 60 * 60 * 24
        })
        //res.json({message: 'Received'})
        res.json({auth: true, token})

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

// Función para obtener la lista de usuarios
exports.obtenerListaUsuarios = async (req, res) => {
    try {
        const users = await User.find({}, 'username email');
        res.json({ users });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al obtener la lista de usuarios');
    }
}

// Función para autenticar un usuario
exports.obtenerUsuario = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).send("El usuario no existe");
        }

        const validPassword = await user.validatePassword(password);

        if (!validPassword) {
            return res.status(401).json({ auth: false, token: null });
        }

        const token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 60 * 60 * 24
        });

        // Llama a la función para obtener la lista de usuarios
        await exports.obtenerListaUsuarios(req, res);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.editarUsuario = async (req, res) => {
    const { userId, newData } = req.body; // Asegúrate de que req.body contenga los datos necesarios para la actualización.

    try {
        const user = await User.findByIdAndUpdate(userId, newData, { new: true }); // Utiliza el método findByIdAndUpdate para actualizar el usuario.

        if (!user) {
            return res.status(404).send("El usuario no existe");
        }

        // Opcional: Puedes volver a firmar un token si es necesario después de la actualización.

        res.json({ auth: true, user });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al editar el usuario');
    }
}

exports.eliminarUsuario = async (req, res) => {
    const { userId } = req.params; // Asegúrate de que req.params contenga el ID del usuario a eliminar.

    try {
        const user = await User.findByIdAndDelete(userId); // Utiliza el método findByIdAndDelete para eliminar el usuario.

        if (!user) {
            return res.status(404).send("El usuario no existe");
        }

        // Opcional: Puedes realizar otras acciones después de eliminar el usuario si es necesario.

        res.json({ auth: true, message: "Usuario eliminado correctamente" });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al eliminar el usuario');
    }
}

