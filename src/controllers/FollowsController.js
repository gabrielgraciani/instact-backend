const connection = require('../database/connection');
const moment = require('moment');

module.exports = {
	async index (req, res) {
		const follows = await connection('follows').select('*');

		return res.json(follows);
	},

	async create (req, res) {
		const { sent_users_id, received_users_id } = req.params;

		try {

			const created_at = moment().format();

			await connection('follows').insert({
				created_at,
				sent_users_id,
				received_users_id
			});

			return res.json({
				success: true,
				message: "Follow successfully created"
			});

		} catch (err) {

			return res.status(400).json({
				success: false,
				error: 'Bad Request',
				message: "Error inserting follow",
			});

		}
	},

};