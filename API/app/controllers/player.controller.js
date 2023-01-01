const Player = require("../models/player.model.js");
const { body, validationResult } = require('express-validator');

exports.validate = (method) => {

    let rules = [
        body('first_name', 'First name is required').not().isEmpty().trim().escape(),
        body('last_name', 'Last name is required').not().isEmpty().trim().escape(),
        body('person_type', 'person_type is required').exists().trim().escape(),
        body('email', 'Invalid email').exists().trim().escape(),
        body('phone', 'Invalid phone').exists().trim().escape(),
        body('state', 'Invalid State').exists().trim().escape()
    ];
    return rules;
}

// Create and Save a new Tutorial
exports.create = async (req, res) => {
    let errors = await validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).send(validationResult(req));
    } else if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    } else {
        const player = new Player({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            person_type: req.body.person_type,
            email: req.body.email,
            phone: req.body.phone,
            state: req.body.state
        });

        await Player.create(player, (err, data) => {
            if (err) {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the player."
                });
            }
            else res.status(201).send(data);
        });
    }
};

// Retrieve all Tutorials from the database (with condition).
exports.findAll = (req, res) => {
    const params = req.query;

    Player.getAll(params, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving players."
            });
        }
        else res.send(data);
    });
};

// Find a single Tutorial with a id
exports.findOne = (req, res) => {
    Player.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found player with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving player with id " + req.params.id
                });
            }
        } else res.send(data);
    });
};

// Update a Tutorial identified by the id in the request
exports.update = (req, res) => {
    if (!validationResult(req).isEmpty()) {
        console.log("validation error: ", validationResult(req));
        res.status(422).send(validationResult(req));
    } else if (!req.body) {
        res.status(400).send({ message: "Content can not be empty!" });
    } else {
        Player.updateById(req.params.id, new Player(req.body), (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found player with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating player with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
        );
    }
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
    Player.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found player with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error updating player with id " + req.params.id
                });
            }
        } else res.send({ message: `Player with id ${req.params.id} was deleted successfully!` });
    });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
    Player.removeAll((err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all players."
            });
        } else {
            res.send({ message: `All players were deleted successfully!` });
        }
    });
};
