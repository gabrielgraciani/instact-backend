const connection = require('../database/connection');
const moment = require('moment');

module.exports = {
	async index (req, res) {
		const mensagens = await connection
		.select('*')
		.from('mensagens');

		return res.json(mensagens);
	},

	async create (req, res) {
		try {

			const created_at = moment().format();
			const updated_at = moment().format();

			const { message } = req.body;
			const users_id = req.headers.authorization;
			const { conversas_id } = req.params;


			const [id] = await connection('mensagens').insert({
				created_at,
				message,
				users_id,
				conversas_id
			});

			await connection('conversas').where('id', conversas_id).update({
				updated_at
			});

			const conversas = await connection
			.select('*')
			.from('conversas')
			.where('users_id1', users_id)
			.orWhere('users_id2', users_id)
			.orderBy('updated_at', 'DESC');

			return res.json({
				success: true,
				message: "mensagem successfully created",
				obj: {
					id,
					created_at,
					message,
					users_id: parseInt(users_id),
					conversas_id: parseInt(conversas_id)
				},
				conversas
			});

		} catch (err) {
			console.log('err', err);
			return res.status(400).json({
				success: false,
				error: 'Bad Request',
				message: "Error inserting mensagem",
			});

		}
	},

	async find (req, res) {
		const {conversas_id} = req.params;

		const mensagens = await connection
		.select('*')
		.from('mensagens')
		.where('conversas_id', conversas_id);

		return res.json(mensagens);
	}
};