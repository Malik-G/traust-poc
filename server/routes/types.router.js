const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route for authorization types 
 */
router.get('/', (req, res) => {
    console.log('router.get to populate authorization popup menu in admin view,  File:  types.router, URL: /');
    let sqlText = `SELECT * FROM "authorizations"  WHERE authorization_id != 2 ORDER BY authorization_id;`;
    pool.query(sqlText)
        .then((result) => {
            res.send(result.rows);
            //  console.log(result.rows);
        })
        .catch((error) => {
            console.log('error', error);
            res.sendStatus(500);
        })
});

module.exports = router;