const sql = require("./db.js");
const sql2 = require("./async_db.js");

const Team = function (team) {
    this.name = team.name;
    this.university = team.university;
    this.coach_id = team.coach_id;
    this.league_id = team.league_id;
};

Team.create = (newTeam, result) => {
    sql.query("INSERT INTO teams SET ?", newTeam, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created team: ", res);
        result(null, { id: res.insertId, ...newTeam });
    });
}

Team.checkDuplicateName = async value => {
    let result = await sql2.query(`SELECT * FROM teams WHERE name = '${value}'`);
    if (result.length > 0) {
        return false;
    }
    return true;
}

Team.findById = (id, result) => {
    sql.query(`select teams.*, concat(first_name, ' ', last_name) as coach_name, email, phone from teams left join people on coach_id = people.id where teams.id = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found team with id ", id);
            result(null, res[0]);
            return;
        }

        result({ kind: "not_found" }, null);
    });
}

Team.getAll = (params, result) => {
    // let query = "select * from teams";
    let query = "select teams.*, concat(first_name, ' ',  last_name) as coach_name, email, phone from teams left join people on coach_id = people.id";

    if (params.filterCol && params.filterStr) {
        query += ` where ${params.filterCol} like '%${params.filterStr}%'`;
    }
    if (params.sortCol && params.sortDir) {
        let sortDir = "ASC";
        if (Array.from(params.sortDir)[0].toLowerCase() == "d") {
            sortDir = "DESC";
        }
        query += ` ORDER BY ${params.sortCol} ${sortDir}`;
    }
    if (params.limit && params.offset) {
        query += ` LIMIT ${params.offset}, ${params.limit}`;
    }

    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("getAll successful");
        result(null, res);
    });
};

Team.updateById = (id, team, result) => {
    sql.query(
        "UPDATE teams SET name = ?, coach_id = ?, league_id = ?, university = ? WHERE id = ?",
        [team.name, team.coach_id, team.league_id, team.university, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated team: ", { id: id, ...team });
            result(null, { id: id, ...team });
        }
    );
};

Team.remove = (id, result) => {
    sql.query("DELETE FROM teams WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("deleted team with id: ", id);
        result(null, res);
    });
};

Team.removeAll = result => {
    sql.query("DELETE FROM teams", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log(`deleted ${res.affectedRows} teams`);
        result(null, res);
    });
};

module.exports = Team;