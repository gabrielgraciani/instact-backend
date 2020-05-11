const connection = require('../database/connection');
const moment = require('moment');

module.exports = {
	async index (req, res) {
		const followers = await connection('follows')
		.select('follows.*', 'users.name', 'users.username', 'users.profile_image')
		.innerJoin('users', 'users.id', '=', 'follows.received_users_id')
		.whereIn('sent_users_id', [1]);

		return res.json(followers);
	}

};