exports.up = function(knex) {
	return knex.schema.createTable('posts_likes', function (table) {
		table.increments();
		table.dateTime('created_at').nullable();
		table.int('posts_id').notNullable();
		table.foreign('posts_id').references('id').inTable('posts');
		table.int('users_id').notNullable();
		table.foreign('users_id').references('id').inTable('users');
	});
};

exports.down = function(knex) {
	return knex.schema.dropTable('posts_likes');
};
