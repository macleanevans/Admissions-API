# Admissions-API


API to collect data on immersive candidates using Node.js, Express and PostgreSQL


# Set up

`npm install` in the root of the folder to install all dependencies 

`npm test` to show all tests for all existing routes 

#### Local database setup

`mkdir dev_db` to make a folder for the local database cluster.

`initdb dev_db/` to initialize the local database cluster.

`postgres -D dev_db` to start the database's server.


##### In a new tab:

`createdb admissions_api_dev` to set up a database for dev.

`createdb admissions_api_test` to set up a database for testing.

`knex migrate:latest` to apply schemas to the dev database.

`NODE_ENV=test knex migrate:latest` to apply schemas to the test database.

`knex seed:run` to seed the database.


# Endpoints 

GET to `/users` with user info in the request query will give you back a 200 if the user can schedule an interview

GET to `/users/all` will give you back every user in the system 

GET to `/interview/soft` will give you a list of all canidates that are past their blackout period and havent schedule a follow up next interview 

GET to `/users/search` will give you back all interviews by a specific user 

POST to `/users/blackout` will set a soft reject period for a specific candidate 

POST to `/interviewer/create` will create a new fellow in the system 

POST to `/interview/create` will create a new interview 
