const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const encryptLib = require('../modules/encryption');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

router.post('/', (req, res) => {
    console.log(req.body);

    //  Need to hash passwords to stick in database
    const password1 = encryptLib.encryptPassword('a');
    
    console.log("password1: ", password1);
                            // pool.query('CREATE DATABASE "quotesify2_database";')
                            // .then((result) => {
                            // console.log("quotesify2_database created");
                pool.query(`
                CREATE TABLE "authorizations" (
                    "authorization_id" SERIAL PRIMARY KEY,
                    "type_of_company" VARCHAR (80) UNIQUE NOT NULL
                );
                
                INSERT INTO "authorizations" ("type_of_company")
                VALUES 
                ('Administrator'), ('Employer'), ('Broker'), ('Provider');
                
                
                --  Companies table lists companies and their associated authorizations
                CREATE TABLE "companies" (
                    "company_id" SERIAL PRIMARY KEY,
                    "name" VARCHAR (80) NOT NULL,
                    "authorization_id" INTEGER references authorizations
                );
                
                INSERT INTO "companies" ("name", "authorization_id")
                VALUES
                ('employer1', 2),
                ('employer2', 2),
                ('employer3', 2),
                ('employer4', 2),
                ('employer5', 2),
                ('employer6', 2),
                ('employer7', 2),
                ('employer8', 2),
                ('employer9', 2),
                ('broker1', 3),
                ('broker2', 3),
                ('broker3', 3),
                ('provider1', 4),
                ('provider2', 4),
                ('provider3', 4),
                ('administrator1', 1);
                
                
                --  The users table lists all the users 
                --  and references the company that employs them
                --  and through that company their authorization
                --  OF NOTE:  Companies have authorizations
                --  and not users, a user may only have one company
                --  and therefore one authorization with this database
                --  setup.
                
                CREATE TABLE "users" (
                    "user_id" SERIAL PRIMARY KEY,
                    "username" VARCHAR (80) UNIQUE NOT NULL,
                    "password" VARCHAR (1000) NOT NULL,
                    "company_id" INTEGER references companies
                );
                
                --  In the code passwords must be hashed/salted
                INSERT INTO "users" ("username", "password", "company_id")
                VALUES 
                ('employer1', '${password1}', 1),
                ('employer2', '${password1}', 2),
                ('employer3', '${password1}', 3),
                ('employer4', '${password1}', 4),
                ('employer5', '${password1}', 5),
                ('employer6', '${password1}', 6),
                ('employer7', '${password1}', 7),
                ('employer8', '${password1}', 8),
                ('employer9', '${password1}', 9),
                ('broker1', '${password1}', 10),
                ('broker2', '${password1}', 11),
                ('broker3', '${password1}', 12),
                ('provider1', '${password1}', 13),
                ('provider2', '${password1}', 14),
                ('provider3', '${password1}', 15),
                ('admin1', '${password1}', 16);
                
                
                --  Deal_statuses table lists the possible statuses
                --  for a deal which might be waiting for different
                --  steps to complete and might be represented
                --  as a graphic on the front end.
                
                CREATE TABLE "deal_statuses" (
                    "deal_status_id" SERIAL PRIMARY KEY,
                    "status" VARCHAR (80) UNIQUE NOT NULL
                );
                
                INSERT INTO "deal_statuses" ("status")
                VALUES 
                ('Awaiting data'), ('Ready for quote'), ('Data sent to provider');
                
                
                --  Deals table lists deals between 
                --  employers and brokers
                CREATE TABLE "deals" (
                    "deal_id" SERIAL PRIMARY KEY,
                    "employer_id" INTEGER references companies,
                    "broker_id" INTEGER references companies,
                    "date_email_sent_to_employer" DATE,
                    "deal_status_id" INTEGER references deal_statuses,
                    "csv_url" VARCHAR (1000) DEFAULT NULL
                );
                
                INSERT INTO "deals" ("employer_id", "broker_id", "date_email_sent_to_employer", "deal_status_id")
                VALUES 
                (1, 10, '01-01-2018', 1),
                (2, 10, '01-02-2018', 2),
                (3, 10, '01-03-2018', 3),
                (4, 11, '01-01-2018', 1),
                (5, 11, '01-02-2018', 2),
                (6, 11, '01-03-2018', 3),
                (7, 12, '01-01-2018', 1),
                (8, 12, '01-02-2018', 2),
                (9, 12, '01-03-2018', 3);
                
                --  Quotes table lists quotes for a deal (between a 
                --  broker and an employer) from a provider
                CREATE TABLE "quotes" (
                    "quote_id" SERIAL PRIMARY KEY,
                    "provider_id" INTEGER references companies,
                    "deal_id" INTEGER references deals,
                    "date_data_sent_to_provider" DATE,
                    "date_of_provider_decision" DATE DEFAULT NULL,
                    "sent_to_provider" BOOLEAN DEFAULT FALSE,
                    "decision_complete" BOOLEAN DEFAULT FALSE,
                    "provider_response_message" VARCHAR (1000) DEFAULT NULL,
                    "provider_response_file_location" VARCHAR (1000) DEFAULT NULL
                );
                
                INSERT INTO "quotes" (
                    "provider_id", 
                    "deal_id", 
                    "date_data_sent_to_provider",
                    "date_of_provider_decision", 
                    "sent_to_provider",
                    "decision_complete", 
                    "provider_response_message", 
                    "provider_response_file_location")
                    VALUES 
                    (13, 3, '01-04-2018', '01-05-2018', TRUE, TRUE, 'Approved', 'www.google.com'),
                    (14, 3, '01-04-2018', '01-05-2018', TRUE, TRUE, 'Denied:  Need more info', 'www.google.com'),
                    (15, 3, '01-04-2018', NULL, TRUE, FALSE, NULL, NULL),
                    (13, 6, '01-04-2018', NULL, TRUE, FALSE, NULL, NULL),
                    (14, 6, '01-04-2018', '01-05-2018', TRUE, TRUE, 'Approved', 'www.google.com'),
                    (15, 6, '01-04-2018', '01-05-2018', TRUE, TRUE, 'Denied:  Need more info', 'www.google.com'),
                    (13, 9, '01-04-2018', '01-05-2018', TRUE, TRUE, 'Denied:  Need more info', 'www.google.com'),
                    (14, 9, '01-04-2018', NULL, TRUE, FALSE, NULL, NULL),
                    (15, 9, '01-04-2018', '01-05-2018', TRUE, TRUE, 'Approved', 'www.google.com');
            
                
                `
                )
                .then((result) => {
                    res.sendStatus(200);
                console.log("tables created and filled")})
                .catch((error) => {
           console.log(`Error `, error);
           res.sendStatus(500); // Good server always responds
                            // })
                            // .catch((error) => {
                            // console.log(`Error making new database `, error);
                            // res.sendStatus(500); // Good server always responds
        });

});



router.post('/deleteData', (req, res) => {
    console.log(req.body);
    pool.query(`

    DROP TABLE quotes;
    DROP TABLE deals;
    DROP TABLE deal_statuses;
    DROP TABLE users;
    DROP TABLE companies;
    DROP TABLE authorizations;

    -- DELETE FROM quotes;
    -- DELETE FROM deals;
    -- DELETE FROM deal_statuses;
    -- DELETE FROM users;
    -- DELETE FROM companies;
    -- DELETE FROM authorizations;
    `)
        .then((result) => {
            res.sendStatus(201);
            console.log("tables cleared/deleted")
        })
        .catch((error) => {
            console.log(`Error `, error);
            res.sendStatus(500); // Good server always responds
            // })
            // .catch((error) => {
            // console.log(`Error making new database `, error);
            // res.sendStatus(500); // Good server always responds
        });

});

router.post('/addOnlyTables', (req, res) => {
    console.log(req.body);
    const password1 = encryptLib.encryptPassword('a');
    pool.query(`

    CREATE TABLE "authorizations"
(
    "authorization_id" SERIAL PRIMARY KEY,
    "type_of_company" VARCHAR (80) UNIQUE NOT NULL
);

 INSERT INTO "authorizations" ("type_of_company")
                VALUES 
                ('Administrator'), ('Employer'), ('Broker'), ('Provider');
             

--  Companies table lists companies and their associated authorizations

CREATE TABLE "companies"
(
    "company_id" SERIAL PRIMARY KEY,
    "name" VARCHAR (80) NOT NULL,
    "authorization_id" INTEGER references authorizations
);


--  The users table lists all the users 
--  and references the company that employs them
--  and through that company their authorization
--  OF NOTE:  Companies have authorizations
--  and not users, a user may only have one company
--  and therefore one authorization with this database
--  setup.

CREATE TABLE "users"
(
    "user_id" SERIAL PRIMARY KEY,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL,
    "company_id" INTEGER references companies
);


--  Deal_statuses table lists the possible statuses
--  for a deal which might be waiting for different
--  steps to complete and might be represented
--  as a graphic on the front end.

CREATE TABLE "deal_statuses"
(
    "deal_status_id" SERIAL PRIMARY KEY,
    "status" VARCHAR (80) UNIQUE NOT NULL
);

INSERT INTO "deal_statuses" ("status")
                VALUES 
                ('Awaiting data'), ('Ready for quote'), ('Data sent to provider');
                

--  Deals table lists deals between 
--  employers and brokers
CREATE TABLE "deals"
(
    "deal_id" SERIAL PRIMARY KEY,
    "employer_id" INTEGER references companies,
    "broker_id" INTEGER references companies,
    "date_email_sent_to_employer" DATE,
    "deal_status_id" INTEGER references deal_statuses,
    "csv_url" VARCHAR (1000) DEFAULT NULL
);


--  Quotes table lists quotes for a deal (between a 
--  broker and an employer) from a provider
CREATE TABLE "quotes"
(
    "quote_id" SERIAL PRIMARY KEY,
    "provider_id" INTEGER references companies,
    "deal_id" INTEGER references deals,
    "date_data_sent_to_provider" DATE,
    "date_of_provider_decision" DATE DEFAULT NULL,
    "sent_to_provider" BOOLEAN DEFAULT FALSE,
    "decision_complete" BOOLEAN DEFAULT FALSE,
    "provider_response_message" VARCHAR (1000) DEFAULT NULL,
    "provider_response_file_location" VARCHAR (1000) DEFAULT NULL
);

--  Also insert an admin user

--  Need a company for the admin user to belong to
INSERT INTO "companies" ("name", "authorization_id")
VALUES 
('administrator_company1', 1);

INSERT INTO "users" ("username", "password", "company_id")
                VALUES 
                ('admin1', '${password1}', 1);
 
    `)
        .then((result) => {
            res.sendStatus(201);
            console.log("tables cleared/deleted")
        })
        .catch((error) => {
            console.log(`Error `, error);
            res.sendStatus(500); // Good server always responds
            // })
            // .catch((error) => {
            // console.log(`Error making new database `, error);
            // res.sendStatus(500); // Good server always responds
        });

});




module.exports = router;