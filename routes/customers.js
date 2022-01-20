const Joi = require('joi');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();


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


const createCustomer = async (document) => {
	const customer = new Customer({
		...document
	});
	const result = await customer.save();
	return result;
};

const getCustomers = async (query) => {
	const customers = await Customer.find(query).sort('name');
	return customers;
}

router.get('/', async (req, res) => {
	const customers = await getCustomers({});
	return res.send(customers);
});
 

router.get('/:id', async (req, res) => {
	const customer = await getCustomers({ _id: req.params.id });
	
	if (!customer) {
		return res.status(404).send("There is no customer with ID");
	}

	res.send(customer);
});

router.post('/', async (req, res) => {
	const { error } = validateCustomer(req.body);
	if (error) {
		return res.status(400).send(error?.details?.[0]?.message);
	}
	
	const newGenre = await createCustomer({
		name: req.body.name,
		phone: req.body.phone,
		isGold: req.body.isGold,
	});
	
	res.status(201).send(newGenre);
});

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

module.exports = router;