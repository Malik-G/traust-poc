const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');
const axios = require('axios');
const csvConverter = require("csvtojson");

router.get('/extract/:company', function (req, res) { 
   let company_id = req.params.company;
   console.log(company_id)
   const sqlText = `SELECT deals.csv_url
   FROM deals JOIN users ON deals.employer_id = users.company_id
   WHERE users.company_id=$1;`;
   pool.query(sqlText, [company_id])
       .then((result) => {
           console.log('The deal csv.url result: ', result.rows[0].csv_url)
           axios({
            method:'GET',
            url: result.rows[0].csv_url
            })
            .then((result2) => {
               csvConverter({delimiter: "auto",}).fromString(result2.data)
               .then((jsonObj)=>{
                  console.log('What we expect to get: ', jsonObj);
                  let arrOfKeys = []
                  let arrOfEmployees = []
                  arrOfKeys.push(Object.keys(jsonObj[0]));
                  // loops through each json object within jsonObj and makes an array out of it's values
                  for (let obj of jsonObj) {
                     let arrOfValues = Object.values(obj)
                     arrOfEmployees.push(arrOfValues)
                  }
                  res.send([arrOfEmployees, arrOfKeys, result2.data])
               })
            })
            .catch((error) => {
               console.log('The axios error: ', error);
            })
       })
       .catch((error) => {
           console.log('Error for GET request for deal csv.url error: ', error)
       })
});

router.get('/fetch', (req, res) => {
   const sqlText = `SELECT * FROM employees WHERE company=${req.user.company_id} LIMIT(10);`;
   pool.query(sqlText)
       .then((result) => {
           res.send(result.rows)
       })
       .catch((error) => {
           console.log('The error: ', error)
       })
});

module.exports = router;