const bcrypt = require('bcryptjs');
const { response } = require('express');
const { generarJWT } = require('../helpers/jwt');
const Usuario = require('../models/Usuario');

const createUser = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        let usuario = await Usuario.findOne({email});

        if ( usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe'
            });
        }

        usuario = new Usuario( req.body );

        // Encriptar password
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        // Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contacte por favor con el administrador del sistema'
        });
    }
}

const loginUser = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        const usuario = await Usuario.findOne({email});

        if ( !usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario con ese email no existe'
            });
        }

        // Verificación del password encriptado
        const verificarPassword = bcrypt.compareSync(password, usuario.password);

        // Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);

        if ( !verificarPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'El password es incorrecto'
            });
        }

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contacte por favor con el administrador del sistema'
        });
    }

}

const renewToken = async(req, res = response) => {

    const { uid, name } = req;

    // Generar un nuevo token y retornarlo en la petición
    const token = await generarJWT(uid, name);

    res.json({
        ok: true,
        uid,
        name,
        token
    });
}

module.exports = {
    createUser,
    loginUser,
    renewToken
}