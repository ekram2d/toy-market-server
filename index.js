
const express = require('express')
const cors= require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000 ;
//mdiileware
app.use(cors());
app.use(express.json());



app.get('/', (req, res) => {
      res.send('toy server is running !')
    })
    
    app.listen(port, () => {
      console.log(`toy server is  listening on port ${port}`)
    })