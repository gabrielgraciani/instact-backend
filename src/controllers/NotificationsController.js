const connection = require('../database/connection');
const moment = require('moment');

module.exports = {
	async index (req, res) {

		const { users_id } = req.params;

		const followers = await connection('follows')
		.select('follows.*', 'users.name', 'users.username', 'users.profile_image', 'users.id as users_id')
		.innerJoin('users', 'users.id', '=', 'follows.received_users_id')
		.whereIn('sent_users_id', [users_id])
		.orderBy('follows.created_at', 'DESC');

		return res.json(followers);
	},

	async viewed (req, res) {

		const { users_id } = req.params;

		await connection('follows').where('sent_users_id', users_id).update({
			viewed: 1,
		});

		const followers = await connection('follows')
		.select('follows.*', 'users.name', 'users.username', 'users.profile_image', 'users.id as users_id')
		.innerJoin('users', 'users.id', '=', 'follows.received_users_id')
		.whereIn('sent_users_id', [users_id])
		.orderBy('follows.created_at', 'DESC');

		return res.json(followers);
	}

};