const Team = require("../models/team.model.js");
const { body, validationResult } = require('express-validator');

exports.validate = (method) => {

    let rules = [
        body('name', 'Team name is required').not().isEmpty().trim().escape(),
        body('university', 'University is required').exists().trim().escape(),
        body('coach_id', 'Invalid Coach ID').exists().isInt(),
        body('league_id', 'Invalid League ID').isInt(),
    ];

    if (method == 'create') {
        rules.push(
            body('name').custom(async (value) => {
                let result = await Team.checkDuplicateName(value);
                if (!result) {
                    return Promise.reject();
                }
                return Promise.resolve();
            }).withMessage('duplicate team name')
        );
    }
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
        const team = new Team({
            name: req.body.name,
            university: req.body.university,
            coach_id: req.body.coach_id,
            league_id: req.body.league_id
        });

        await Team.create(team, (err, data) => {
            if (err) {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the Team."
                });
            }
            else res.status(201).send(data);
        });
    }
};

// Retrieve all Tutorials from the database (with condition).
exports.findAll = (req, res) => {
    const params = req.query;

    Team.getAll(params, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving teams."
            });
        }
        else res.send(data);
    });
};

// Find a single Tutorial with a id
exports.findOne = (req, res) => {
    Team.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Team with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving Cusomter with id " + req.params.id
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
        Team.updateById(req.params.id, new Team(req.body), (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Team with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating Team with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
        );
    }
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
    Team.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Team with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error updating Team with id " + req.params.id
                });
            }
        } else res.send({ message: `Team with id ${req.params.id} was deleted successfully!` });
    });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
    Team.removeAll((err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while removing al teams."
            });
        } else {
            res.send({ message: `All teams were deleted successfully!` });
        }
    });
};
