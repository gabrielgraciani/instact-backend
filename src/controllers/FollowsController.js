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

			const [id] = await connection('follows').insert({
				created_at,
				sent_users_id,
				received_users_id
			});

			return res.json({
				success: true,
				message: "Follow successfully created",
				follow_data: {
					id,
					sent_users_id: parseInt(sent_users_id),
					received_users_id: parseInt(received_users_id)
				}
			});

		} catch (err) {

			return res.status(400).json({
				success: false,
				error: 'Bad Request',
				message: "Error inserting follow",
			});

		}
	},

	async delete (req, res) {
		const { sent_users_id, received_users_id } = req.params;

		try {

			await connection('follows')
			.where('sent_users_id', sent_users_id)
			.where('received_users_id', received_users_id)
			.delete();

			return res.json({
				success: true,
				message: "Follow successfully deleted"
			});

		} catch (err) {

			return res.status(400).json({
				success: false,
				error: 'Bad Request',
				message: "Error deleting Follow",
			});

		}
	},

	async find (req, res) {
		const { id } = req.params;

		try {

			const follows = await connection('follows')
			.where('sent_users_id', id)
			.orWhere('received_users_id', id)
			.select('*');


			return res.json(follows);

		} catch (err) {

			return res.status(400).json({
				success: false,
				error: 'Bad Request',
				message: "Error finding follow",
			});

		}
	},

	async deleteAll (req, res) {
		await connection('follows')
		.delete();
	}

};