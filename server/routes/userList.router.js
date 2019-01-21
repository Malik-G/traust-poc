const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route for users list for admin view  
 */
router.get('/', (req, res) => {
    console.log('router.get to populate list of users on admin page,  File:  userList.router, URL: /');
    let sqlText = `SELECT users.username, companies.name as company_name  
FROM  "companies" 
JOIN "users" on companies.company_id = users.company_id;`;
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