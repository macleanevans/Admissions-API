var fs = require("fs");
var path = require("path");

exports.up = function(knex, Promise) {
  return knex.schema.raw(String(fs.readFileSync(path.join(__dirname, "../DB/schema.sql"))))
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('users'),
    knex.schema.dropTable('interviews'),
    knex.schema.dropTable('interviewer'),
    knex.schema.dropTable('decision'),
    knex.schema.dropTable('grade'),
    knex.schema.dropTable('maker_prep'),
  ])
};
