const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

// GET route for this employer's deal_id
router.get('/deals/:company_id', (req, res) => {
   let company_id = req.params.company_id;
   console.log(company_id)
   const sqlText = `SELECT deals.deal_id
   FROM deals JOIN users ON deals.employer_id = users.company_id
   WHERE users.company_id=$1;`;
   pool.query(sqlText, [ company_id ])
       .then((result) => {
           console.log('The result: ', result.rows)
           res.send(result.rows)
       })
       .catch((error) => {
           console.log('The error: ', error)
       })
});

//GET route for this employer's quotes
router.get('/:company_id', (req, res) => {
    let company_id = req.params.company_id;
    const sqlText = `SELECT deals.deal_id FROM deals JOIN users
    ON users.company_id = deals.employer_id WHERE users.company_id = $1;
    ;`;
    pool.query(sqlText, [ company_id ])
        .then((result) => {
            console.log('result:', result)
            const deal_id = parseInt(result.rows[0].deal_id);
            const sqlText2 = `SELECT quotes.*, companies.name as provider
            FROM quotes JOIN companies ON quotes.provider_id=companies.company_id
            WHERE quotes.deal_id=$1;`;
            pool.query(sqlText2, [deal_id])
            .then((result)=> {
                 //console.log(result.rows)
                 res.send(result.rows)
            })
           
        })
        .catch((error) => {
            console.log('The error: ', error)
        })
});

module.exports = router;