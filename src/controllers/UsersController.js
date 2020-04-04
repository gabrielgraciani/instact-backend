const connection = require('../database/connection');
const moment = require('moment');
const fs = require('fs');

module.exports = {
	async index (req, res) {
		const users = await connection('users').select('*');

		return res.json(users);
	},

	async create (req, res) {
		const { name, email, username, password } = req.body;

		try {

			const user = await connection('users').where('email', email).select('*').first();

			if(user){
				return res.status(400).json({
					success: false,
					error: 'Bad Request',
					message: "E-mail already used",
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

	async sendProfileImage (req, res) {
		const { id } = req.params;

		try {

			const user = await connection('users').where('id', id).select('*').first();

			if (!user) {
				return res.status(400).json({
					success: false,
					error: 'Bad Request',
					message: "No User found with this ID",
				});
			}

			if (req.files === null) {
				return res.status(400).json({
					success: false,
					error: 'Bad Request',
					message: "No file uploaded",
				});
			}

			const file = req.files.file;
			const base_path = __basedir;
			const file_path = `${base_path}/media/users/${user.id}`;
			const file_name = `${Date.now()}-${file.name}`;

			if(fs.existsSync(file_path) && user.profile_image !== ''){
				fs.unlinkSync(`${file_path}/${user.profile_image}`);
			}

			if (!fs.existsSync(file_path)) {
				fs.mkdirSync(file_path);
			}

			file.mv(`${file_path}/${file_name}`);

			await connection('users').where('id', id).update({
				profile_image: file_name,
			});



			return res.json({
				success: true,
				message: "Profile Image successfully updated"
			});

		} catch (err) {

			return res.status(400).json({
				success: false,
				error: 'Bad Request',
				message: "Error uploading profile image",
			});

		}
	},

	async update (req, res) {
		const { id } = req.params;

		const { name, email, username, password, biography, telephone, newpassword, newpasswordconfirm } = req.body;

		try {

			const user = await connection('users').where('id', id).select('*').first();

			if (!user) {
				return res.status(400).json({
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
			else{
				await connection('users').where('id', id).update({
					name,
					email,
					username,
					password,
					biography,
					telephone
				});
			}

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
				return res.status(400).json({
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

			const user = await connection('users').where('id', id).select('*').first();

			if (!user) {
				return res.status(400).json({
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

	async getProfileImage (req, res) {
		const { id } = req.params;

		try{

			const user = await connection('users').where('id', id).select('*').first();

			if (!user) {
				return res.status(400).json({
					success: false,
					error: 'Bad Request',
					message: "No User found with this ID",
				});
			}

			const base_path = __basedir;
			const file_path = `${base_path}/media/users/${id}`;

			return res.sendFile(`${file_path}/${user.profile_image}`);

		} catch (err) {
			return res.status(400).json({
				success: false,
				error: 'Bad Request',
				message: "Error finding profile image",
			});

		}
	}
};