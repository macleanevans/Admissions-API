# Admissions-API


API to collect data on immersive candidates using node, express and postgress

run npm install in the root of the folder to install all dependencies 

running npm test will show all tests set up for the current routes in place 

Possible Request: 

GET to "/users" with user info in the request query will give you back a 200 if the user can schedule an interview

GET to "/users/all" will give you back every user in the system 

GET to "/interview/soft" will give you a list of all canidates that are past their blackout period and havent schedule a follow up next interview 

GET to "/users/search" will give you back all interviews by a specific user 

POST to "/users/blackout" will set a soft reject period for a specific candidate 

POST to "/interviewer/create" will create a new fellow in the system 

POST to "/interview/create" will create a new interview 
