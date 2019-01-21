const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
var moment = require('moment');

// For the Broker view, fill the table of quotes from the database
router.get('/quotestable/:id', rejectUnauthenticated, (req, res) => {
  let brokerId = req.params.id;
  const sqlText = `SELECT employers.name as employer_name, providers.name as provider_name, deals.date_email_sent_to_employer, quotes.decision_complete, deals.broker_id FROM "deals" 
   JOIN "companies" as "employers" ON deals.employer_id = employers.company_id 
   JOIN "quotes" ON deals.deal_id = quotes.deal_id
   JOIN "companies" as "providers" ON quotes.provider_id = providers.company_id
   WHERE deals.broker_id = $1;`;
  pool.query(sqlText, [brokerId])
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      console.log("quotes table get was NOT successful");
      res.sendStatus(500);
    })
});



// This will retrieve the quotes from the DB for the Provider
router.get('/', (req, res) => {
  const queryText = `SELECT "quotes".*, "deals"."csv_url", "broker"."name" as "broker", "employer"."name" as "employer" FROM "quotes"
    JOIN "deals" on "quotes"."deal_id" ="deals"."deal_id"
    JOIN "companies" as "broker" on "deals"."broker_id" ="broker"."company_id"
    JOIN "companies" as "employer" on "deals"."employer_id" ="employer"."company_id"
    WHERE "provider_id"=${req.user.company_id};`;
  pool.query(queryText)
    .then((result) => { 
      res.send(result.rows); 
    })
    .catch((error) => {
      console.log('Error completing GET quotes query:', error);
      res.sendStatus(500);
    });
});

// PUT route to update the quotes once the Provider has responded to the quote
router.put('/:quote_id', (req, res) => {
  const quote = req.body;
  const now = new Date();
  const sqlText = `UPDATE "quotes" SET 
   "provider_response_file_location"=$1, 
   "decision_complete"=true, 
   "provider_response_message"=$2, 
   "date_of_provider_decision"=$3 
   WHERE quote_id=$4;`;
  const queryValues = [
    quote.file_url,
    quote.message,
    now,
    quote.quote_id,
  ];
  pool.query(sqlText, queryValues)
    .then((response) => {
      res.sendStatus(200);
    })
    .catch((error) => {
      res.sendStatus(500);
    })
});

// This will POST a new quote on our DB when the data is sent out to a provider
router.post('/', async (req, res) => {
  let quoteArray = req.body
  const client = await pool.connect();
  const date = moment().format('YYYY-MM-DD');
  try {
    await client.query('BEGIN');
    //  This post uses transactions.  Either all the inserts in the loop post or none do (async + await)
    for (let i = 0; i < quoteArray.length; i++) {
      await client.query(`INSERT INTO "quotes" ("provider_id", "deal_id", "date_data_sent_to_provider")
                          VALUES ($1, $2, $3)`,
        [quoteArray[i].company_id,
        quoteArray[i].deal_id,
          date,]);
    };  // end for
    await client.query('COMMIT');
  } catch (error) {
    //  If a post in the loop failed, roll the server back to previous ("BEGIN") state before any posting.
    await client.query('ROLLBACK');
    console.log('*********************');
    console.log('error posting quote');
    console.log('*********************');
    throw error;
  } finally { 
    //  If all posts in the for loop succeeded, release the wait and complete all changes
    client.release(); 
    console.log('*********************');
    console.log('quote post successful');
    console.log('*********************');
  } //  End try
}) //  End router.post

//  New get to populate provider popup list (example:  {company_id: 1, name: 'aflac', and authorization_id: 4})
//  for new quote generator in broker view client tab
//  This get may eventually need to be based on the broker that's logged in if only certain brokers use certain providers
router.get('/providers', (req, res) => {
  console.log('router.get to populate provider choice popup menu in broker view,  File:  quotes.router, URL: /providers');
  const queryText = `SELECT * FROM "companies" 
  WHERE authorization_id=4;`;
  pool.query(queryText)
    .then((result) => {
      //  console.log("result.rows: ", result.rows);
      res.send(result.rows);

    })
    .catch((error) => {
      console.log('Error completing GET quotes query:', error);
      res.sendStatus(500);
    });
});

module.exports = router;