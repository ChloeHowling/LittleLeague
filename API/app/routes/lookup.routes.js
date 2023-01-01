
const sql = require("../models/db.js");
module.exports = app => {
     app.get("/lookups/:lookupTable", async (req, res)=>{
        let query="";
        switch(req.params.lookupTable){
          case 'coaches':
            query = "SELECT CONCAT(first_name, ' ', last_name) as label, id as value FROM people WHERE person_type='coach'";
            break;
          case 'teams':
            query = "SELECT name as label, id as value FROM teams";
            break;
          case 'leagues':
            query = "SELECT name as label, id as value FROM leagues";
            break;
          case 'person_type':
            query = "SELECT DISTINCT person_type as 'label', person_type as 'value' FROM people";
        }
        sql.query(query, (err, data) => {
            if (err) {
                res.status(500).send(err);
                console.log(err.message);
                return;
            }
            res.send(data);
        });
    });
  };