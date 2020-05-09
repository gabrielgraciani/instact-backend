const connection = require('../database/connection');
const moment = require('moment');
const fs = require('fs');
const aws = require('aws-sdk');
const s3 = new aws.S3();
const path = require('path');
const { promisify } = require('util');

module.exports = {
	async index (req, res) {
		const users = await connection('users').select('*');

		return res.json(users);
	},

	async create (req, res) {
		const { name, email, username, password } = req.body;

		try {

			const user = await connection('users').where('email', email).select('*').first();
			const user_username = await connection('users').where('username', username).select('*').first();

			if(user){
				return res.status(409).json({
					success: false,
					error: 'Bad Request',
					message: "E-mail already used",
				});
			}

			if(user_username){
				return res.status(409).json({
					success: false,
					error: 'Bad Request',
					message: "Username already used",
				});
			}

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
				error: 'Bad Request',
				message: "Error inserting user",
			});

		}
	},

	async update (req, res) {
		const { id } = req.params;

		const { name, email, username, biography = '', telephone = '', password = '', newpassword = '', newpasswordconfirm = '' } = req.body;

		try {

			const user = await connection('users').where('id', id).select('*').first();

			if (!user) {
				return res.status(404).json({
					success: false,
					error: 'Bad Request',
					message: "No User found with this ID",
				});
			}

			if(password !== '' && newpassword !== '' && newpasswordconfirm !== ''){
				if(newpassword === newpasswordconfirm && password === user.password){
					await connection('users').where('id', id).update({
						password: newpassword
					});
				} else{
					return res.status(400).json({
						success: false,
						error: 'Bad Request',
						message: "Passwords do not match",
					});
				}
			}

			const usernameCheck = await connection('users').where('username', username).select('*').first();
			if(usernameCheck){
				if(id !== usernameCheck.id){
					return res.status(400).json({
						success: false,
						error: 'Bad Request',
						message: "Username already used",
					});
				}

			}

			await connection('users').where('id', id).update({
				name,
				email,
				username,
				biography,
				telephone
			});

			return res.json({
				success: true,
				message: "User successfully updated"
			});

		} catch (err) {

			return res.status(400).json({
				success: false,
				error: 'Bad Request',
				message: "Error updating user",
			});

		}
	},

	async delete (req, res) {
		const { id } = req.params;

		try {

			const user = await connection('users').where('id', id).select('id').first();

			if (!user) {
				return res.status(404).json({
					success: false,
					error: 'Bad Request',
					message: "No User found with this ID",
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
				error: 'Bad Request',
				message: "Error deleting user",
			});

		}
	},

	async find (req, res) {
		const { id } = req.params;

		try {

			const user = await connection
			.select([
				'users.*',
				connection.raw('(SELECT COUNT(*) from posts WHERE posts.users_id = users.id) AS qt_posts'),
				connection.raw('(SELECT COUNT(*) from follows WHERE follows.sent_users_id = users.id) as qt_followers'),
				connection.raw('(SELECT COUNT(*) from follows WHERE follows.received_users_id = users.id) as qt_following')
			])
			.from('users')
			.where('users.id', id)
			.first();

			if (!user) {
				return res.status(404).json({
					success: false,
					error: 'Bad Request',
					message: "No User found with this ID",
				});
			}

			return res.json(user);

		} catch (err) {

			return res.status(400).json({
				success: false,
				error: 'Bad Request',
				message: "Error finding user",
			});

		}
	},

	async findByUsername (req, res) {
		const { username } = req.params;

		try {

			const user = await connection
			.select([
				'users.*',
				connection.raw('(SELECT COUNT(*) from posts WHERE posts.users_id = users.id) AS qt_posts'),
				connection.raw('(SELECT COUNT(*) from follows WHERE follows.sent_users_id = users.id) as qt_followers'),
				connection.raw('(SELECT COUNT(*) from follows WHERE follows.received_users_id = users.id) as qt_following')
			])
			.from('users')
			.where('users.username', username)
			.first();

			if (!user) {
				return res.status(404).json({
					success: false,
					error: 'Bad Request',
					message: "No User found with this username",
				});
			}

			return res.json(user);

		} catch (err) {

			return res.status(400).json({
				success: false,
				error: 'Bad Request',
				message: "Error finding user",
			});

		}
	},

	async sendProfileImage (req, res) {
		const { id } = req.params;

		try {

			const user = await connection('users').where('id', id).select('*').first();

			if (!user) {
				return res.status(404).json({
					success: false,
					error: 'Bad Request',
					message: "No User found with this ID",
				});
			}

			if(user.profile_image !== ''){
				if(process.env.STORAGE_TYPE === 's3'){
					await s3.deleteObject({
						Bucket: process.env.BUCKET,
						Key: `users/${user.id}/${user.profile_image}`
					}).promise();
				} else {
					promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'tmp', 'uploads', `${user.profile_image}`));
				}
			}



			await connection('users').where('id', id).update({
				profile_image: req.file.filename || req.file.filename
			});

			//console.log(`${process.env.APP_URL}/files/${req.file.key}`);
			//console.log(req.file);

			return res.json({
				success: true,
				message: "Profile Image successfully updated",
				profile_image: req.file.filename || req.file.filename
			});


		} catch (err) {

			return res.status(400).json({
				success: false,
				error: 'Bad Request',
				message: "Error uploading profile image",
			});

		}
	},

	async sugestions (req, res) {

		const { id } = req.params;

		const users = await connection
		.select('users.*', 'follows.sent_users_id', 'follows.received_users_id')
		.from('users')
		.leftJoin('follows', 'follows.sent_users_id', '=', 'users.id')
		.whereNot('users.id', id)
		.whereNull('follows.received_users_id')
		.limit(5);

		return res.json(users);
	},

	async search (req, res) {
		const { search } = req.params;
		const users_id = req.headers.authorization;

		const users = await connection
		.select('*')
		.from('users')
		.where('username', 'like', `%${search}%`)
		.whereNot('id', users_id)
		.orderBy('name', 'DESC')
		.limit(20);

		return res.json(users);
	}
};