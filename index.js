const express = require('express');
const connectDB = require('./config/db');

connectDB();

const app = express();

app.use(express.json({ extended: false }));

app.get('/', (req, res) => {
  res.send('API running');
});

// Define routes
app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('Server started on port', PORT));
