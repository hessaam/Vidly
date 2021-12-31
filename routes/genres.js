const Joi = require('joi');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

mongoose.connect('mongodb://localhost/Genres')
	.then(() => console.log('Connecting to Database....'));

const genresSchema = new mongoose.Schema({
	name: String
});

const Genre = mongoose.model('Genre', genresSchema);

const createGenre = async (document) => {
	const genre = new Genre({
		...document
	});
	const result = await genre.save();
	console.log({ result });
};

const getGenres = async (query) => {
	const genres = await Genre.find(query);
	return genres;
}

router.get('/', async (req, res) => {
	const genres = await getGenres({});
	return res.status(200).send(genres);
});


router.get('/:id', async (req, res) => {
	if (req.params?.id) {
		const desireGenre = await getGenres({ _id: req.params.id });
		return res.status(200).send(desireGenre);
	} else {
		return res.status(404).send("There is no genre with id");
	}
});

router.post('/', async (req, res) => {
	const { error } = validateGenre(req.body);
	if (error) {
		return res.status(400).send(error?.details?.[0]?.message);
	}
	await createGenre({ name: req.body.name })
	const newGenre = await getGenres({ name: req.body.name })
	res.status(201).send(newGenre);
});

router.put('/:id', (req, res) => {
	const genre = genres.find(g => g.id === parseInt(req.params.id));
	console.log({ genre });
	if (!genre) {
		return res.status(404).send("The genre with the given ID was not found!")
	}
	const { error } = validateGenre(req.body);
	
	if (error) {
		return res.status(400).send(error.details[0].message)
	}
	
	genre.name = req.body.name;
	res.status(200).send(genre);

});

router.delete('/:id', (req, res) => {
	const genre = genres.find(g => g.id === parseInt(req.params.id));
	if (!genre) {
		return res.status(404).send("The genre with the given ID was not found!") 
	};

	const index = genres.indexOf(genre);
	genres.splice(index, 1);

	res.status(200).send(genre);
})


const validateGenre = (genre) => {
	const schema = {
		name: Joi.string().min(3).required()
	};
	const result = Joi.validate(genre, schema);
	console.log({result})
	return result;
};


module.exports = router;