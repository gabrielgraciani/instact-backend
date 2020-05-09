const connection = require('../database/connection');
const moment = require('moment');

module.exports = {
	async index (req, res) {
		const conversas = await connection
		.select('*')
		.from('conversas');

		return res.json(conversas);
	},

	async create (req, res) {
		try {

			const created_at = moment().format();
			const updated_at = moment().format();

			const { users_id1, users_id2 } = req.body;


			const [id] = await connection('conversas').insert({
				created_at,
				updated_at,
				users_id1,
				users_id2
			});

			return res.json({
				success: true,
				message: "Conversa successfully created",
			});

		} catch (err) {

			return res.status(400).json({
				success: false,
				error: 'Bad Request',
				message: "Error inserting conversa",
			});

		}
	},

};