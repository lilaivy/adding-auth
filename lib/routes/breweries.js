const Router = require('express').Router;
const router = Router();
const Brewery = require('../models/brewery');

router
    .get('/', (req, res, next) => {
        Brewery.find()
            .lean()
            .select('name neighborhood specialties') //do I need to select?
            .then(breweries => res.send(breweries))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        const id = req.params.id;
        Brewery.findById(id).lean()
            .then(brewery => {
                if (!brewery) res.status(404).send(`${id} not found`);
                else res.send(brewery);
            })
            .catch(next);
    })

    .post('/', (req, res, next) => {
        new Brewery(req.body)
            .save()
            .then(brewery => res.send(brewery))
            .catch(next);
    });

module.exports = router;