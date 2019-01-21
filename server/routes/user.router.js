const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get('/', rejectUnauthenticated, (req, res) => {
  console.log('router.get to deal with authentication,  File:  user.router, URL: /');

  // Send back user object from the session (previously queried from the database)
  res.send(req.user);
});

// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post('/register', (req, res, next) => { 
  console.log('router.post to add a company to companies table,  File:  user.router, URL: /register');

  // all registered users belong to a company; 
  console.log('VALUES FOR ALL TABLES', req.body);
  console.log('VALUES FOR COMPANIES TABLE');  
  const name = req.body.company_name;
  const authorization_id = req.body.authorization_id;
  const queryText = 'INSERT INTO "companies" (name, authorization_id) VALUES ($1, $2) RETURNING company_id';
  pool.query(queryText, [name, authorization_id])
    .then((result) => { 
      // adds company to user table creating login with provided email and a password
      const company_id = parseInt(result.rows[0].company_id);
      const username = req.body.username;
      const password = encryptLib.encryptPassword(req.body.password);
      console.log('VALUES FOR USER TABLE', company_id, username, password)
      const queryText2 = 'INSERT INTO "users" ( username, password, company_id ) VALUES ($1, $2, $3) RETURNING company_id;';
      pool.query(queryText2, [username, password, company_id])
       .then((result) => {
        // all employers belong to a deal 
        // check to make sure user has the correct authorization to be an employer
        if (authorization_id === 2){
          // the brokers compnay id is inserted into the Deals table colunm broker_id
          const broker_id = req.body.broker_id;
          // the employers company id is inserted into the Deals table colunm employer_id 
          const company_id = parseInt(result.rows[0].company_id);
          // adding the date the email with the login values was sent to a new Employer
          const date = new Date();
          // add pending value to deals table
          const deal_status_id = 1;
          // const date = req.body.date_sent;
          console.log('VALUES FOR DEAL TABLE', broker_id, company_id, date, deal_status_id)
          const queryText3 = 'INSERT INTO "deals" ( broker_id, employer_id, date_email_sent_to_employer, deal_status_id ) VALUES ($1, $2, $3, $4);';
          pool.query(queryText3, [broker_id, company_id, date, deal_status_id])
          .then((result)=>{
            res.sendStatus(201);
          })
          .catch((err) => {
            next(err);
          })
        } else {
          res.sendStatus(201);
        }
        
      })
      .catch((err) => { next(err); })
    })
     
    .catch((err) => { next(err); });
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  console.log('router.post to deal with authentication and log in a user,  File:  user.router, URL: /login');
  res.sendStatus(200);
});

// clear all server session information about this user
router.post('/logout', (req, res) => {
  console.log('router.post to deal with authentication and log out a user,  File:  user.router, URL: /logout');

  // Use passport's built-in method to log out the user
  req.logout();
  res.sendStatus(200);
});

module.exports = router;
