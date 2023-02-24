const express = require('express');
const cors = require('cors');
const mariadb = require('mariadb');
const Pusher = require("pusher");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const pool = mariadb.createPool({
  host: 'localhost',
  port:3307,
  user: 'root',
  password: '',
  database: 'chat'
});

const pusher = new Pusher({
  appId: "1558180",
  key: "4ea25cba3748175c1de6",
  secret: "1506a7d26bedd3d32d19",
  cluster: "eu",
  useTLS: true
});

app.post('/messages', async (req, res) => {
  try {
    const { username, message } = req.body;
    const connection = await pool.getConnection();
    const query = 'INSERT INTO chat (messages, username) VALUES (?, ?)';
    const result = await connection.query(query, [message, username]);
    console.log('Message inserted in database:', result);

    // Retrieve all messages from database
    const allMessages = await connection.query('SELECT * FROM chat');
    connection.release();

    res.status(200).json({ messages: allMessages });

    pusher.trigger('my-channel', 'new-message', { username, message });
  } catch (error) {
    console.error('Error inserting message in database:', error);
    res.status(500).json({ error: 'Error inserting message in database' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
