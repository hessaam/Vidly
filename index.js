const genres = require('./routes/genres');
const express = require('express');
const app = express();

app.use(express.json());
app.get("/", (req, res) => {
	res.send("Hello world!")
});
app.use('/api/genres', genres);


app.listen(5000);