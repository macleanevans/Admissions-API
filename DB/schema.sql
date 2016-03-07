CREATE TABLE users (
  user_id SERIAL,
  first_name varchar(25),
  last_name varchar(25),
  email varchar(30),
  gitub varchar(30),
  blackout date,
  PRIMARY KEY (user_id)
);

CREATE TABLE interviews (
  interview_id SERIAL,
  interviewer_id INTEGER,
  decision INTEGER,
  technical_grade INTEGER,
  personal_grade  INTEGER,
  makerPrep  INTEGER,
  notes varchar(250),
  PRIMARY KEY (interview_id)
);

CREATE TABLE decision(
  decision_id SERIAL,
  description varchar(50),
  PRIMARY KEY (decision_id)
);

CREATE TABLE grades(
  grade_id SERIAL,
  description varchar(10),
  PRIMARY KEY (grade_id)
);

CREATE TABLE makerPrep (
  makerPrep_id SERIAL,
  description varchar(10),
  PRIMARY KEY (makerPrep_id)
);

CREATE TABLE interviewer(
  interviewer_id SERIAL,
  first_name varchar(30),
  last_name varchar(30),
  PRIMARY KEY (interviewer_id)
);

ALTER TABLE interviews ADD FOREIGN KEY (decision) REFERENCES decision (decision_id);
ALTER TABLE interviews ADD FOREIGN KEY (technical_grade) REFERENCES grades (grade_id);
ALTER TABLE interviews ADD FOREIGN KEY (personal_grade) REFERENCES grades (grade_id);
ALTER TABLE interviews ADD FOREIGN KEY (MakerPrep) REFERENCES makerPrep (makerPrep_id);
ALTER TABLE interviews ADD FOREIGN KEY (interviewer_id) REFERENCES interviewer (interviewer_id);




//Things I really need

//Users Tables
//Interviews Tables
//Interviewer Table
