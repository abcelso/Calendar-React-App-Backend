const { response } = require('express');
const Evento = require('../models/Evento');


const getEvents = async(req, res = response) => {

    const eventos = await Evento.find()
                                .populate('user', 'name');

    res.json({
        ok: true,
        msg: eventos
    });
}

const createEvents = async(req, res = response) => {

    const evento = new Evento(req.body);

    try {
        const {uid} = req;

        evento.user = uid;

        const eventoGuardado = await evento.save();

        res.json({
            ok: true,
            event: eventoGuardado
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const updateEvents = async(req, res = response) => {

    const eventoId = req.params.id;

    try {
        const evento = await Evento.findById( eventoId );

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'El id introducido no existe'
            });
        }

        if (evento.user.toString() !== req.uid) {
            return res.status(401).json({
                ok: false,
                msg: 'El usuario no tiene privilegios para modificar'
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: req.uid
        }

        const updateEvento = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, {new: true});

        res.json({
            ok: true,
            evento: updateEvento
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const delEvents = async(req, res = response) => {

    const eventoId = req.params.id;

    try {

        const evento = await Evento.findById(eventoId);

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'El evento con no existe'
            });
        }

        if (evento.user.toString() !== req.uid) {
            return res.status(401).json({
                ok: false,
                msg: 'El usuario no tiene los permisos suficientes para borrar'
            });
        }

        await Evento.findByIdAndDelete( eventoId );

        res.json({
            ok: true,
            msg: 'Evento borrado exitosamente!'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

module.exports = {
    getEvents,
    createEvents,
    updateEvents,
    delEvents
}