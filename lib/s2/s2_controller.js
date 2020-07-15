var express = require('express');
var router = express.Router();
var rp = require('request-promise');
const dotenv = require('dotenv');
dotenv.config();

router.post('/', async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send(new Error('Falta un cuerpo con información en el mensaje'));
        }
        if (!req.body.sistema || !req.body.tipo || !req.body.clave || !req.body.email) {
            return res.status(400).send(new Error('Debe incluir el siatema, el tipo, la clave y el correo en la solicitud del mensaje'));
        }
        var url = process.env.ARIADNA_S2_URL + '/intercambio';
        var sistema = req.body.sistema;
        var tipo = req.body.tipo;
        var clave = req.body.clave;
        var email = req.body.email;
        var options = {
            method: 'POST',
            uri: url,
            body: {
                sistema,
                tipo,
                clave,
                email
            },
            json: true // Automatically stringifies the body to JSON
        };
        var respuesta = await rp(options);
        res.json(respuesta);
    } catch (error) {
        return res.status(500).send(error);
    }
});

router.post('/factura-tienda', async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send(new Error('Falta un cuerpo con información en el mensaje'));
        }
        if (!req.body.tipo || !req.body.clave || !req.body.email) {
            return res.status(400).send(new Error('Debe incluir el siatema, el tipo, la clave y el correo en la solicitud del mensaje'));
        }
        var url = process.env.ARIADNA_S2_URL + '/intercambio';
        var sistema = process.env.TIENDA_DATABASE;
        var tipo = req.body.tipo;
        var clave = req.body.clave;
        var email = req.body.email;
        var options = {
            method: 'POST',
            uri: url,
            body: {
                sistema,
                tipo,
                clave,
                email
            },
            json: true // Automatically stringifies the body to JSON
        };
        var respuesta = await rp(options);
        res.json(respuesta);
    } catch (error) {
        return res.status(500).send(error);
    }
});

router.post('/factura-telefonia', async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send(new Error('Falta un cuerpo con información en el mensaje'));
        }
        if (!req.body.tipo || !req.body.clave || !req.body.email) {
            return res.status(400).send(new Error('Debe incluir el siatema, el tipo, la clave y el correo en la solicitud del mensaje'));
        }
        var url = process.env.ARIADNA_S2_URL + '/intercambio';
        var sistema = process.env.TELEFONIA_DATABASE;
        var tipo = req.body.tipo;
        var clave = req.body.clave;
        var email = req.body.email;
        var options = {
            method: 'POST',
            uri: url,
            body: {
                sistema,
                tipo,
                clave,
                email
            },
            json: true // Automatically stringifies the body to JSON
        };
        var respuesta = await rp(options);
        res.json(respuesta);
    } catch (error) {
        return res.status(500).send(error);
    }
});

router.post('/factura-gasolinera', async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send(new Error('Falta un cuerpo con información en el mensaje'));
        }
        if (!req.body.tipo || !req.body.clave || !req.body.email) {
            return res.status(400).send(new Error('Debe incluir el siatema, el tipo, la clave y el correo en la solicitud del mensaje'));
        }
        var url = process.env.ARIADNA_S2_URL + '/intercambio';
        var sistema = process.env.GASOLINERA_DATABASE;
        var tipo = req.body.tipo;
        var clave = req.body.clave;
        var email = req.body.email;
        var options = {
            method: 'POST',
            uri: url,
            body: {
                sistema,
                tipo,
                clave,
                email
            },
            json: true // Automatically stringifies the body to JSON
        };
        var respuesta = await rp(options);
        res.json(respuesta);
    } catch (error) {
        return res.status(500).send(error);
    }
});


router.post('/factura-tratamientos', async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send(new Error('Falta un cuerpo con información en el mensaje'));
        }
        if (!req.body.tipo || !req.body.clave || !req.body.email) {
            return res.status(400).send(new Error('Debe incluir el siatema, el tipo, la clave y el correo en la solicitud del mensaje'));
        }
        var url = process.env.ARIADNA_S2_URL + '/intercambio';
        var sistema = process.env.TRATAMIENTOS_DATABASE;
        if (req.body.sistema) {
            sistema = req.body.sistema;
        }
        var tipo = req.body.tipo;
        var clave = req.body.clave;
        var email = req.body.email;
        if (process.env.TRATAMIENTOS_DATABASE !== 'ariagro') tipo = 'FAC';
        var options = {
            method: 'POST',
            uri: url,
            body: {
                sistema,
                tipo,
                clave,
                email
            },
            json: true // Automatically stringifies the body to JSON
        };
        var respuesta = await rp(options);
        res.json(respuesta);
    } catch (error) {
        return res.status(500).send(error);
    }
});

router.post('/factura-varias', async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send(new Error('Falta un cuerpo con información en el mensaje'));
        }
        if (!req.body.sistema || !req.body.tipo || !req.body.clave || !req.body.email) {
            return res.status(400).send(new Error('Debe incluir el siatema, el tipo, la clave y el correo en la solicitud del mensaje'));
        }
        var url = process.env.ARIADNA_S2_URL + '/intercambio';
        var sistema = req.body.sistema;
        var tipo = req.body.tipo;
        var clave = req.body.clave;
        var email = req.body.email;
        var options = {
            method: 'POST',
            uri: url,
            body: {
                sistema,
                tipo,
                clave,
                email
            },
            json: true // Automatically stringifies the body to JSON
        };
        var respuesta = await rp(options);
        res.json(respuesta);
    } catch (error) {
        return res.status(500).send(error);
    }
});

//
module.exports = router;
