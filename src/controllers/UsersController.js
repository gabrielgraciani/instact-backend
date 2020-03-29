const connection = require('../database/connection');
const moment = require('moment');


module.exports = {
	async index (req, res) {
		const users = await connection('users').select('*');

		return res.json(users);
	},

	async create (req, res) {
		const { name, email, username, password } = req.body;

		try {

			const created_at = moment().format();

			const [id] = await connection('users').insert({
				name,
				email,
				username,
				password,
				created_at,
			});

			return res.json({
				success: true,
				message: "User successfully created"
			});

		} catch (err) {

			return res.status(400).json({
				success: false,
				error: {
					message: "Error inserting user"
				}
			});

		}
	},

	async update (req, res) {
		const { id } = req.params;

		const { name, email, username, password } = req.body;

		try {

			const user = await connection('users').where('id', id).select('*').first();

			if (!user) {
				return res.status(400).json({
					success: false,
					 error: {
						 message: 'No User found with this ID'
					 }
				});
			}

			await connection('users').where('id', id).update({
				name,
				email,
				username,
				password
			});

			return res.json({
				success: true,
				message: "User successfully updated"
			});

		} catch (err) {

			return res.status(400).json({
				success: false,
				error: {
					message: "Error updating user"
				}
			});

		}
	},

	async delete (req, res) {
		const { id } = req.params;

		try {

			const user = await connection('users').where('id', id).select('id').first();

			if (!user) {
				return res.status(400).json({
					success: false,
					error: {
						message: 'No User found with this ID'
					}
				});
			}

			await connection('users').where('id', id).delete();

			return res.json({
				success: true,
				 message: "User successfully deleted"
			});

		} catch (err) {

			return res.status(400).json({
				success: false,
				error: {
					message: "Error deleting user"
				}
			});

		}


	}
};