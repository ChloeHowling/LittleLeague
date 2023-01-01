// const SqlString = require("mysql/lib/protocol/SqlString");

module.exports = app => {
    const teamController = require("../controllers/team.controller.js");

    var router = require("express").Router();

    // Create new team
    router.post(
        "/", 
        teamController.validate('create'), 
        teamController.create
    );

    // Update a team with id
    router.put(
        "/:id", 
        teamController.validate('update'),
        teamController.update
    );

    // Retrieve all teams
    router.get("/", teamController.findAll);

    // Retrieve a single team with id
    router.get("/:id", teamController.findOne);

    // delete a team with id
    router.delete("/:id", teamController.delete);

    // delete all teams
    router.delete("/", teamController.deleteAll);

    app.use("/teams", router);

};