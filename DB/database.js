var pg = require('pg');

TestDB.connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/test';

var TestDB = module.exports;
