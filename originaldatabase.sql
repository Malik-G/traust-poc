--CREATE DATABASE "quotesify_database";

--The Authorizations table lists the available types of companies
--that the admin can create
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
('administrator_company1', 1),
('employer_company1', 2),
('employer_company2', 2),
('employer_company3', 2),
('broker_company1', 3),
('broker_company2', 3),
('broker_company3', 3),
('provider_company1', 4),
('provider_company2', 4),
('provider_company3', 4);


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

INSERT INTO "users" ("username", "password", "company_id")
VALUES 
('Neesha', 'MADAMADMIN', 1),
('Inmar_the_admin', 'Inmar_the_admin', 1),
('administrator_user1', 'administrator_user1', 1),
('Shirley65', 'Shirley65', 2),
('EmployerHideki', 'EmployerHideki', 3),
('employer_user1', 'employer_user1', 4),
('Jamal', 'BigSales2019', 5), 
('BrokerAbdul', 'BrokerAbdul', 6),
('broker_user1', 'broker_user1', 7),
('Diamond', 'AffleckUser', 7), 
('ProviderPeggie', 'ProviderPeggie', 8),
('provider_user1', 'provider_user1', 9);

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
(2, 5, '01-01-2018', 1),
(3, 6, '01-02-2018', 2),
(4, 7, '01-03-2018', 3);

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
(8, 3, '01-04-2018', '01-05-2018', TRUE, TRUE, 'Approved', 'www.google.com'),
(9, 3, '01-04-2018', '01-05-2018', TRUE, TRUE, 'Denied:  Need more info', 'www.google.com'),
(10, 3, '01-04-2018', NULL, TRUE, FALSE, NULL, NULL);

--  Employee table contains all uploaded datasets of employees
--  for all deals


CREATE TABLE "employees" (
	--  +++++++++++++++++++++++++++++
	--  Change company to user please
	--  +++++++++++++++++++++++++++++
    "company" INTEGER references users,
    "employer_supplied_unique_id" INTEGER DEFAULT NULL,
    "date_of_birth" VARCHAR,
    "date_of_hire" VARCHAR,
    "union_status" VARCHAR, 
    "salary_per_year" VARCHAR, 
    "gender" VARCHAR (80), 
    "status" VARCHAR (80), 
    "state" VARCHAR (80),
    "role" VARCHAR (80),
    "employer_supplied_company_code" VARCHAR,
    "is_valid" BOOLEAN DEFAULT FALSE
);




INSERT INTO "employees" (
	--  +++++++++++++++++++++++++++++
	--  Change company to user please
	--  +++++++++++++++++++++++++++++
    "company",
 
    "employer_supplied_unique_id",
    "date_of_birth",
    "date_of_hire",
    "union_status",
    "role", 
    "salary_per_year", 
    "gender", 
    "status", 
    "state",
    "employer_supplied_company_code",

    "is_valid"
)

VALUES 
(1, 6902, '05-06-1972', '08-14-2012', 'FALSE', 'quality assurance', '63487', 'male', 'Active', 'Alabama', '103', TRUE),
(1, 6903, '05-07-1972', '08-15-2013', 'FALSE', 'qa', '6347', 'male', 'Active', 'Alabama', '103', TRUE),
(1, 2481, '05-06-1984', '08-14-2010', 'TRUE', 'CEO', '245621', 'other', 'Active', 'Vermont', '205', TRUE ),
(1, 8765, '05-06-1990', '08-14-2014', 'TRUE', 'Attorney', '48888', 'NA', 'Active', 'MN', '056', TRUE );

--Testing Data--

SELECT "quotes".*,"deals"."csv_url", "broker"."name" as "broker", "employer"."name" as "employer" FROM "quotes"
JOIN "deals" on "quotes"."deal_id" ="deals"."deal_id"
JOIN "companies" as "broker" on "deals"."broker_id" ="broker"."company_id"
JOIN "companies" as "employer" on "deals"."employer_id" ="employer"."company_id"
WHERE "provider_id"=8;