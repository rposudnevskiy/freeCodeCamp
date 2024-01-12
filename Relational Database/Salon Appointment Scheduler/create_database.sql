CREATE DATABASE salon OWNER freecodecamp;

\c salon
SET ROLE freecodecamp;

CREATE TABLE customers(
	customer_id SERIAL PRIMARY KEY,
	name VARCHAR(20) NOT NULL,
	phone VARCHAR(20) NOT NULL UNIQUE
);


CREATE TABLE services(
	service_id SERIAL PRIMARY KEY,
	name VARCHAR(20) NOT NULL
);

CREATE TABLE appointments(
	appointment_id SERIAL PRIMARY KEY, 
	time VARCHAR(10) NOT NULL,
	customer_id INT NOT NULL,
	CONSTRAINT fk_customer_id
		FOREIGN KEY(customer_id)  
		REFERENCES customers(customer_id)
		ON DELETE NO ACTION,
	service_id INT NOT NULL,
	CONSTRAINT fk_service_id
		FOREIGN KEY(service_id)  
		REFERENCES services(service_id)
		ON DELETE NO ACTION
);


INSERT INTO services(name) VALUES ('cut');
INSERT INTO services(name) VALUES ('color');
INSERT INTO services(name) VALUES ('perm');
INSERT INTO services(name) VALUES ('style');
INSERT INTO services(name) VALUES ('trim');
