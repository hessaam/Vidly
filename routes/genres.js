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
}

router.get('/', (req, res) => {
	return res.status(200).send(genres);
});


router.get('/:id', (req, res) => {
	if (req.params?.id) {
		const desireGenre = genres.filter(genre => genre.id == req.params.id);
		return res.status(200).send(desireGenre);
	} else {
		return res.status(404).send("There is no genre with id");
	}
});

router.post('/', (req, res) => {
	const { error } = validateGenre(req.body);
	if (error) {
		return res.status(400).send(error?.details?.[0]?.message);
	}
	const newGenre = {
		id: genres?.length + 1,
		name: req.body.name
	};
	genres.push(newGenre);
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