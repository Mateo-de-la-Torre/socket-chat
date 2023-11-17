const {Router} = require('express');
const { buscar } = require('../controllers/buscarController');


const buscarRoutes = Router();



buscarRoutes.get('/:coleccion/:termino', buscar)









module.exports = buscarRoutes;