// const SqlString = require("mysql/lib/protocol/sqlString");

module.exports = app => {
    const playerController = require("../controllers/player.controller.js");

    var router = require("express").Router();

    // Create new team
    router.post(
        "/", 
        playerController.validate('create'), 
        playerController.create
    );

    // Update a team with id
    router.put(
        "/:id", 
        playerController.validate('update'),
        playerController.update
    );

    // Retrieve all teams
    router.get("/", playerController.findAll);

    // Retrieve a single team with id
    router.get("/:id", playerController.findOne);

    // delete a team with id
    router.delete("/:id", playerController.delete);

    // delete all teams
    router.delete("/", playerController.deleteAll);

    app.use("/players", router);

};