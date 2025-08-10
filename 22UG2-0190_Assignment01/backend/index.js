const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.PGHOST || 'db',
  user: process.env.PGUSER || 'user',
  password: process.env.PGPASSWORD || 'password',
  database: process.env.PGDATABASE || 'contactsdb',
  port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432
});

async function waitForDb(maxAttempts = 30) {
  let attempts = 0;
  while (attempts < maxAttempts) {
    try {
      await pool.query('SELECT 1');
      console.log('Connected to DB');
      return;
    } catch (err) {
      attempts++;
      console.log(`Waiting for DB (${attempts}/${maxAttempts})...`);
      await new Promise(res => setTimeout(res, 2000));
    }
  }
  throw new Error('Could not connect to database after multiple attempts');
}

app.get('/api/contacts', async (req, res) => {
  try {
    const r = await pool.query('SELECT * FROM contacts ORDER BY id DESC');
    res.json(r.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/contacts', async (req, res) => {
  const { name, phone } = req.body;
  if (!name || !phone) return res.status(400).json({ error: 'name and phone required' });
  try {
    const r = await pool.query(
      'INSERT INTO contacts (name, phone) VALUES ($1, $2) RETURNING *',
      [name, phone]
    );
    res.status(201).json(r.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.delete('/api/contacts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM contacts WHERE id=$1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

const PORT = process.env.PORT || 3000;

waitForDb()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Backend listening on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });

