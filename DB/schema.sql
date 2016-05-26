CREATE TABLE users (
  user_id SERIAL,
  name varchar(80),
  email varchar(30),
  github varchar(30),
  accepted boolean,
  hard_rejected boolean,
  blackout date,
  PRIMARY KEY (user_id)
);

CREATE TABLE interviews (
  interview_id SERIAL,
  user_id INTEGER,
  interviewer_id INTEGER,
  decision varchar(50),
  descision_notes text,
  technical_grade varchar(2),
  technical_notes text,
  personal_grade  varchar(2),
  personal_notes text,
  maker_prep  varchar(5),
  PRIMARY KEY (interview_id)
);


CREATE TABLE interviewer(
  interviewer_id SERIAL,
  full_name varchar(70),
  github varchar(100),
  PRIMARY KEY (interviewer_id)
);

ALTER TABLE interviews ADD FOREIGN KEY (interviewer_id) REFERENCES interviewer (interviewer_id);
ALTER TABLE interviews ADD FOREIGN KEY (user_id) REFERENCES users(user_id);
