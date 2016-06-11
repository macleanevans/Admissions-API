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

DEPRECATED - GET to `/api/users` with user info in the request query will give you back a 200 if the user can schedule an interview. Used to create a user if none existed and 404 if the user was currently in a blackout period.

POST to `/api/users/findOrCreate` will return a 200 or 201 depending on if user was found or created. 404's if there is currently a blackout period for this user.

GET to `/api/users/check` will give a 200 or 404 depending on if the user is in the system or not.

GET to `/api/users/all` will give you back every user in the system 

GET to `/api/interview/soft` will give you a list of all canidates that are past their blackout period and havent schedule a follow up next interview 

GET to `/api/users/search` will give you back all interviews by a specific user 

POST to `/api/users/blackout` will set a soft reject period for a specific candidate 

POST to `/api/interviewer/create` will create a new interviewer in the system 

GET to `/api/interviewer/all` will return all of the current interviewers

POST to `/interview/create` will create a new interview 
