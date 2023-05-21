
const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5001;
//mdiileware

app.use(cors());
app.use(express.json());
// console.log(process.env.DB_USERS,process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USERS}:${process.env.DB_PASS}@cluster0.wlwsqet.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, { useUnifiedTopology: true }, { useNewUrlParser: true }, { connectTimeoutMS: 30000 }, { keepAlive: 1 });

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();


    const toyCollection = client.db('toyMarket').collection('datas');
    const alltoyCollection = client.db('toyMarket').collection('bookings');



    // const indexKeys = { name: 1 };
    // const indexOptions = { name: "name" };
    // const result = await alltoyCollection.createIndex(indexKeys, indexOptions)
    // app.get("/jobsearchBYName/:text", async (req, res) => {
    //   const search = req.params.text;
    //   const result = await alltoyCollection.find({
    //     $or: [

    //       { name: { $regex: search, $options: "i" } }
    //     ]

    //   }).toArray()
    //   res.send(result);
    // })


    //catagory data collect 
    app.get('/datas', async (req, res) => {
      const cursor = toyCollection.find();
      const result = await cursor.limit(20).toArray();
      res.send(result)
    })

    //all toy collect

    app.get('/alltoy', async (req, res) => {
      const cursor = alltoyCollection.find();
      const result = await cursor.limit(20).toArray();
      res.send(result);
    })
    app.get('/singleservices/:id', async (req, res) => {
      const result = await toyCollection.findOne({
        _id: new ObjectId(req.params.id)
      })

      res.send(result)
    })
    app.get('/singleuser/:id', async (req, res) => {
      const result = await alltoyCollection.findOne({
        _id: new ObjectId(req.params.id)
      })

      res.send(result)
    })
    app.get('/bookings', async (req, res) => {

      let query = {};
      if (req.query?.email) {
        query = { sellerEmail: req.query.email }
      }

      // console.log(req.query.value)
      let result = {};
      if (req.query.value == '1') {
        result = await alltoyCollection.find(query).sort({ price: 1 }).toArray();
      }
      else if (req.query.value == '2') {
        result = await alltoyCollection.find(query).sort({ price: -1 }).toArray();
      } else {
        result = await alltoyCollection.find(query).sort({  }).toArray();
      }

      res.send(result);
    })

    app.get('/search', async (req, res) => {

      let query = {};
      if (req.query?.name ){
        query = { name: req.query.name }
      }

      // console.log(r)
      let result = {};
    
  // console.log(req.query)
        result = await alltoyCollection.find(query).toArray();
     

      res.send(result);
    })

    app.get("/updated/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await alltoyCollection.findOne(query)
      res.send(result);

    })









    app.post('/bookings', async (req, res) => {
      const booking = req.body;
      // console.log(booking)
      const result = await alltoyCollection.insertOne(booking);
      res.send(result);
    })
    //update 
    app.put('/bookings/:id', async (req, res) => {
      const updatedBooking = req.body;
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }

      const updatedDoc = {
        $set: {
          price: updatedBooking.price,
          availableQuantity: updatedBooking.availableQuantity,
          description: updatedBooking.description
        }
      }
      const result = await alltoyCollection.updateOne(filter, updatedDoc, options)

      console.log(result)
      res.send(result)
    })

    app.delete('/bookings/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await alltoyCollection.deleteOne(query);
      res.send(result);
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
  res.send('toy server is runninggg !')
})

app.listen(port, () => {
  console.log(`toy server is  listening on port ${port}`)
})