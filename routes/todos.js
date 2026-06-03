var express = require("express");
var router = express.Router();
const { pool } = require("../config/db");

// GET /api/todos
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM todos ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/todos
router.post("/", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim() == "") {
      return res.status(400).json({ error: "Text kosong" });
    }
    const [result] = await pool.query(`INSERT INTO todos (text) VALUES (?)`, [
      text.trim(),
    ]);
    const [rows] = await pool.query(`SELECT * FROM todos WHERE id = ?`, [
      result.insertId,
    ]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/todos/:id
router.patch("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const [check] = await pool.query(`SELECT * FROM todos WHERE id = ?`, [id]);
    if (check.length === 0) return res.status(404).json({ error: "Not Found" });
    await pool.query(`UPDATE todos SET done = NOT done WHERE id = ?`, [id]);
    const [rows] = await pool.query(`SELECT * FROM todos WHERE id = ?`, [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/todos/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const [check] = await pool.query(`SELECT * FROM todos WHERE id = ?`, [id]);
    if (check.length === 0) return res.status(404).json({ error: "Not Found" });
    await pool.query(`DELETE FROM todos WHERE id = ?`, [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
