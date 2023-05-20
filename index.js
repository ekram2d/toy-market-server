
const express = require('express')
const cors= require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000 ;
//mdiileware
app.use(cors());
app.use(express.json());
console.log(process.env.DB_USERS,process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USERS}:${process.env.DB_PASS}@cluster0.wlwsqet.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection

    const toyCollection = client.db('toyMarket').collection('datas');
    app.get('/datas',async(req,res)=>{
    const cursor= toyCollection.find();
    const result = await cursor.limit(20).toArray();
    res.send(result)
    })
       
    app.get('/singleservices/:id',async (req,res)=>{
      const result=await toyCollection.findOne({
        _id:new ObjectId(req.params.id)
      })
      console.log(result);
      res.send(result)
    })
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
      res.send('toy server is running !')
    })
    
    app.listen(port, () => {
      console.log(`toy server is  listening on port ${port}`)
    })