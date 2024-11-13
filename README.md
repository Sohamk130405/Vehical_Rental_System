# SQL SCHEMA

CREATE DATABASE VEHICLE_RENTAL_SYSTEM;
USE VEHICLE_RENTAL_SYSTEM;
CREATE TABLE Users (
user_id INT PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(100),
email VARCHAR(100) UNIQUE,
password VARCHAR(255),
phone_number VARCHAR(15),
address TEXT,
license_number VARCHAR(50) UNIQUE, -- Only for customers, admins can leave it NULL
role ENUM('customer', 'admin') DEFAULT 'customer', -- Role field differentiates users
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Vehicles (
vehicle_id INT PRIMARY KEY AUTO_INCREMENT,
model VARCHAR(50),
brand varchar(50),
img varchar(256),
year INT,
license_plate VARCHAR(20) UNIQUE,
vehicle_type VARCHAR(50), -- e.g., car, bike, bus
daily_rate DECIMAL(10, 2),
hourly_rate DECIMAL(10, 2),
status ENUM('available', 'rented', 'maintenance') DEFAULT 'available',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Rentals (
rental_id INT PRIMARY KEY AUTO_INCREMENT,
customer_id INT,
vehicle_id INT,
rental_date DATE,
return_date DATE,
total_cost DECIMAL(10, 2),
status ENUM('ongoing', 'completed', 'canceled') DEFAULT 'ongoing',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (customer_id) REFERENCES Users(user_id),
FOREIGN KEY (vehicle_id) REFERENCES Vehicles(vehicle_id)
);

CREATE TABLE Payments (
payment_id INT PRIMARY KEY AUTO_INCREMENT,
rental_id INT,
payment_date DATE,
amount DECIMAL(10, 2),
payment_method ENUM('credit_card', 'debit_card', 'cash', 'online'),
status ENUM('paid', 'pending') DEFAULT 'pending',
FOREIGN KEY (rental_id) REFERENCES Rentals(rental_id)
);

set foreign_key_checks = 1;

DELIMITER $$

CREATE PROCEDURE InsertPayment(
IN rental_id INT,
IN amount DECIMAL(10, 2),
IN payment_method ENUM('credit_card', 'debit_card', 'cash', 'online')
)
BEGIN
-- Insert payment into the payments table
INSERT INTO payments (rental_id, amount, payment_method, status)
VALUES (rental_id, amount, payment_method, 'paid');

    -- Update the rental status to 'completed'
    UPDATE rentals
    SET status = 'completed'
    WHERE rental_id = rental_id;

END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE CompleteRental(IN rental_id INT, IN vehicle_id INT)
BEGIN
-- Your logic to complete the rental
-- Example: update rental status, update vehicle status, etc.
UPDATE rentals SET status = 'completed' WHERE rental_id = rental_id;
UPDATE vehicles SET status = 'available' WHERE vehicle_id = vehicle_id;
END $$

DELIMITER ;

CREATE VIEW rental_payment_details AS
SELECT r.\*,
v.brand,
v.model,
v.hourly_rate,
c.name,
c.phone_number,
p.amount AS payment_amount,
p.payment_date,
p.payment_method,
p.status AS payment_status
FROM users c
JOIN rentals r ON r.customer_id = c.user_id
JOIN vehicles v ON v.vehicle_id = r.vehicle_id
LEFT JOIN payments p ON p.rental_id = r.rental_id;

# Instructions

1. Create .env.local file and add this:-
   MYSQL_DATABASE= 'VEHICLE_RENTAL_SYSTEM'
   MYSQL_PASSWORD= 'your password'
   MYSQL_USER= 'root'
   MYSQL_HOST='localhost'
   NEXTAUTH_URL = 'http://localhost:3000'
   NEXTAUTH_SECRET = 'yourSecretKey'

2. run following command for installations
   npm install

3. run following command for run
   npm run dev
