const Joi = require('joi');
const mongoose = require('mongoose');

const Genre = mongoose.model('Genre', new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 50
	}
}));

const validateGenre = (genre) => {
	const schema = {
		name: Joi.string().min(3).required()
	};
	const result = Joi.validate(genre, schema);
	console.log({result})
	return result;
};

exports.Genre = Genre;
exports.validate = validateGenre;