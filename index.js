const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;



const app = express()
const port = 5000;


//middleware

app.use(cors());
app.use(express.json());

// MongoDb 


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gfhug.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{
        await client.connect();
        const database = client.db('apartment_apartio');
        const productCollection = database.collection('product');
        const orderCollection = database.collection('order');
		
		// There will be All API 

		// POST/CREATE API Product
    app.post('/products', async(req, res) => {
      const product =  req.body;
      console.log('hit the product', product);
      const result = await productCollection.insertOne(product);
      console.log(result);
      res.json(result)
    });

    // POST/CREATE API Order

    app.post('/orders', async(req, res) => {
      const order =  req.body;
      console.log('hit the order', order);
      const result = await orderCollection.insertOne(order);
      console.log(result);
      res.json(result)
    });


    // GET/READ API Product
      
    app.get('/products', async(req, res) => {
      const cursor = productCollection.find({});
      const product = await cursor.toArray();
      res.send(product); 
    });

    // GET/READ API Order
      
    app.get('/orders', async(req, res) => {
      const cursor = orderCollection.find({});
      const order = await cursor.toArray();
      res.send(order); 
    });

    // PUT/UPDATE API 
    
    app.put('/orderUpdate/:id', async(req, res) => {
      const filter = { _id: ObjectId(req.params.id) };
    console.log(req.params.id);
    
    const result = await orderCollection.updateOne(filter, {
      $set: {
        status: req.body.status,
      },
    });
    res.send(result);
    console.log(result);
 
    });

    // DELETE/REMOVE API Product
    
    app.delete('/products/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await productCollection.deleteOne(query);
      console.log('deleted product id', result);
      res.json(result);
    });

    // DELETE/REMOVE API Order
    
    app.delete('/orders/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await orderCollection.deleteOne(query);
      console.log('deleted product id', result);
      res.json(result);
    });
		
	}
    finally{
      //await client.close();
    }
}
run().catch(console.dir)



app.get('/', (req, res) => {
  res.send('Running My CRUD Server')
})

app.listen(port, () => {
  console.log(`Running Server at http://localhost:${port}`)
})