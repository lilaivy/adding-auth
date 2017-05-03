const Router = require('express').Router;
const router = Router();
const Brewery = require('../models/brewery');

router
    .get('/', (req, res, next) => {
        Brewery.find()
            .lean()
            .select('name neighborhood specialties') //do I need to select?
            .then(actors => res.send(actors))
            .catch(next);
    });















module.exports = router;