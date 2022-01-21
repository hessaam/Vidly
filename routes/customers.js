const { Customer, validate } = require('../models/customer');
const express = require('express');
const router = express.Router();

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
	const { error } = validate(req.body);
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

module.exports = router;