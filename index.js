const mongoose = require('mongoose');
const genres = require('./routes/genres');
const express = require('express');
const app = express();

mongoose.connect('mongodb://localhost/vidly')
	.then(() => console.log('Connected to MongoDB...'))
	.catch(err => console.log('Could not connect to MongoDB...'));

app.use(express.json());
app.get("/", (req, res) => {
	res.send("Hello world!")
});
app.use('/api/genres', genres);

app.listen(5000);