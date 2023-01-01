const sql = require("./db.js");
const sql2 = require("./async_db.js");

const Player = function (player) {
    this.first_name = player.first_name
    this.last_name = player.last_name
    this.person_type = player.person_type
    this.email = player.email
    this.phone = player.phone
    this.state = player.state
};

Player.create = (newPlayer, result) => {
    sql.query("INSERT INTO people SET ?", newPlayer, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created player: ", res);
        result(null, { id: res.insertId, ...newPlayer });
    });
}

Player.findById = (id, result) => {
    sql.query(`select * from people where id = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found player with id ", id);
            result(null, res[0]);
            return;
        }

        result({ kind: "not_found" }, null);
    });
}

Player.getAll = (params, result) => {
    let query = "select * from people";

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

Player.updateById = (id, player, result) => {
    sql.query(
        "UPDATE people SET first_name = ?, last_name = ?, person_type = ?, email = ?, phone = ?, state = ? WHERE id = ?",
        [player.first_name, player.last_name, player.person_type, player.email, player.phone, player.state, id],
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

            console.log("updated team: ", { id: id, ...player });
            result(null, { id: id, ...player });
        }
    );
};

Player.remove = (id, result) => {
    sql.query("DELETE FROM people WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("deleted player with id: ", id);
        result(null, res);
    });
};

Player.removeAll = result => {
    sql.query("DELETE FROM people", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log(`deleted ${res.affectedRows} teams`);
        result(null, res);
    });
};

module.exports = Player;