const express = require("express");
const cors = require("cors");
const expressValidator = require('express-validator');

const app = express();

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(expressValidator.expressValidator());
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Chloe's application." });
}); 

require("./app/routes/team.routes.js")(app);
require("./app/routes/lookup.routes.js")(app);
require("./app/routes/player.routes.js")(app);

// const PORT = process.env.PORT || 8080;
const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});