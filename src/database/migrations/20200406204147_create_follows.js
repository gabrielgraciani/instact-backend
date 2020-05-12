exports.up = function(knex) {
	return knex.schema.createTable('follows', function (table) {
		table.increments();
		table.dateTime('created_at').nullable();
		table.int('sent_users_id').notNullable();
		table.foreign('sent_users_id').references('id').inTable('users');
		table.int('received_users_id').notNullable();
		table.foreign('received_users_id').references('id').inTable('users');
		table.int('viewed').nullable();
	});
};

exports.down = function(knex) {
	return knex.schema.dropTable('follows');
};
