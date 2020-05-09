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

			const { users_id1, users_id2, username1, username2, nome1, nome2, profile_image1, profile_image2 } = req.body;


			const [id] = await connection('conversas').insert({
				created_at,
				updated_at,
				users_id1,
				nome1,
				username1,
				users_id2,
				nome2,
				username2,
				profile_image1,
				profile_image2
			});

			return res.json({
				success: true,
				message: "Conversa successfully created",
			});

		} catch (err) {

			console.log('err', err);
			return res.status(400).json({
				success: false,
				error: 'Bad Request',
				message: "Error inserting conversa",
			});

		}
	},

	async find (req, res) {

		const { users_id } = req.params;

		const conversas = await connection
		.select('*')
		.from('conversas')
		.where('users_id1', users_id)
		.orWhere('users_id2', users_id);

		return res.json(conversas);
	},

};