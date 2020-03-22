const User = require("../models/usersModel.js");

exports.create = (req, res) => {
	if (!req.body) {
		res.status(400).send({
			message: "Content can not be empty!"
		});
	}

	const user = new User({
		email: req.body.email,
		name: req.body.name,
	});

	User.create(user, (err, data) => {
		if (err)
			res.status(500).send({
				message:
				err.message || "Some error occurred while creating the User."
			});
		else res.send(data);
	});
};

exports.findAll = (req, res) => {
	User.getAll((err, data) => {
		if (err)
			res.status(500).send({
				message:
				err.message || "Some error occurred while retrieving users."
			});
		else res.send(data);
	});
};

exports.findOne = (req, res) => {
	User.findById(req.params.userId, (err, data) => {
		if (err) {
			if (err.kind === "not_found") {
				res.status(404).send({
					message: `Not found User with id ${req.params.userId}.`
				});
			} else {
				res.status(500).send({
					message: "Error retrieving User with id " + req.params.userId
				});
			}
		} else res.send(data);
	});
};

exports.update = (req, res) => {
	if (!req.body) {
		res.status(400).send({
			message: "Content can not be empty!"
		});
	}

	console.log(req.body);

	User.updateById(
		req.params.userId,
		new User(req.body),
		(err, data) => {
			if (err) {
				if (err.kind === "not_found") {
					res.status(404).send({
						message: `Not found User with id ${req.params.userId}.`
					});
				} else {
					res.status(500).send({
						message: "Error updating User with id " + req.params.userId
					});
				}
			} else res.send(data);
		}
	);
};

exports.delete = (req, res) => {
	User.remove(req.params.userId, (err, data) => {
		if (err) {
			if (err.kind === "not_found") {
				res.status(404).send({
					message: `Not found User with id ${req.params.userId}.`
				});
			} else {
				res.status(500).send({
					message: "Could not delete User with id " + req.params.userId
				});
			}
		} else res.send({ message: `User was deleted successfully!` });
	});
};

exports.deleteAll = (req, res) => {
	User.removeAll((err, data) => {
		if (err)
			res.status(500).send({
				message:
				err.message || "Some error occurred while removing all users."
			});
		else res.send({ message: `All Users were deleted successfully!` });
	});
};
