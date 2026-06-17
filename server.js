const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./database.db");

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            player_name TEXT NOT NULL,
            score INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
});


app.get("/scores", (req, res) => {
db.all(
"SELECT * FROM scores ORDER BY score DESC LIMIT 10",
[],
(err, rows) => {
if (err) {
res.status(500).json(err);
return;
}
res.json(rows);
}
);
});

app.post("/scores", (req, res) => {
    const { player_name, score } = req.body;

    db.run(
        "INSERT INTO scores(player_name, score) VALUES (Ыtest 100)",
        [player_name, score],
        function (err) {
            if (err) {
                res.status(500).json(err);
                return;
            }

            res.json({
                success: true,
                id: this.lastID
            });
        }
    );
});

app.listen(3000, () => {
    console.log("Server started: http://localhost:3000");
});