exports.up = function(knex) {
	return knex.schema.createTable('users', function (table) {
		table.increments();
		table.string('name').notNullable();
		table.string('email').notNullable();
		table.string('username').notNullable();
		table.string('password').notNullable();
		table.string('biography').nullable();
		table.string('telephone').nullable();
		table.string('profile_image').nullable();
		table.dateTime('created_at').nullable();
	});
};

exports.down = function(knex) {
	return knex.schema.dropTable('users');
};
