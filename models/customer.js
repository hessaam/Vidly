const mongoose = require('mongoose');
const Joi = require('joi');

const Customer = mongoose.model('Customer', new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 50,
	},
	phone: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 50,
	},
	isGold: {
		type: Boolean,
		default: false,
	}
}));

const validateCustomer = (customer) => {
	const schema = {
		name: Joi.string().min(5).max(50).required(),
		phone: Joi.string().min(5).max(50).required(),
		isGold: Joi.boolean()
	};
	const result = Joi.validate(customer, schema);
	console.log({result})
	return result;
};

exports.Customer = Customer;
exports.validate = validateCustomer;