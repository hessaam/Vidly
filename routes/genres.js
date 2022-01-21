const { Genre, validate } = require('../models/genre');
const express = require('express');
const router = express.Router();


const createGenre = async (document) => {
	const genre = new Genre({
		...document
	});
	const result = await genre.save();
	return result;
};

const getGenres = async (query) => {
	const genres = await Genre.find(query).sort('name');
	return genres;
}

router.get('/', async (req, res) => {
	const genres = await getGenres({});
	return res.send(genres);
});
 

router.get('/:id', async (req, res) => {
	const genre = await getGenres({ _id: req.params.id });
	
	if (!genre) {
		return res.status(404).send("There is no genre with ID");
	}

	res.send(genre);
});

router.post('/', async (req, res) => {
	const { error } = validate(req.body);
	if (error) {
		return res.status(400).send(error?.details?.[0]?.message);
	}
	
	const newGenre = await createGenre({ name: req.body.name });
	
	res.status(201).send(newGenre);
});

router.put('/:id', async (req, res) => {
	const { error } = validate(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message)
	}

	try {
		var genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
	} catch (err) {
		if (!genre) {
			return res.status(404).send("The genre with the given ID was not found!")
		} else {
			console.log({ err });
		}
	}

	res.send(genre);

});

router.delete('/:id', async (req, res) => {

	try {
		var genre = await Genre.findByIdAndRemove(req.params.id);
	} catch (err) {
		if (!genre) {
			return res.status(404).send("The genre with the given ID was not found!");
		} else {
			console.log({ err });
		}
	}

	res.send(genre);
});

module.exports = router;