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
        const usersCollection = database.collection('users');
        const feedbackCollection = database.collection('feedback');
		
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

    // POST/CREATE API Add User

    app.post('/users', async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await usersCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });

    // POST/CREATE API User Feedback

    app.post('/reviews', async (req, res) => {
      const feedback = req.body;
      console.log(feedback);
      const result = await feedbackCollection.insertOne(feedback);
      console.log(result);
      res.json(result);
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

    // GET/READ API My Order

    app.get("/myOrders/:email", async (req, res) => {
      console.log(req.params.email);
      const result = await orderCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });

    // GET/READ API Check admin or not

    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === 'admin') {
          isAdmin = true;
      }
      res.json({ admin: isAdmin });
  })

  // GET/READ API Feedback 
      
  app.get('/reviews', async(req, res) => {
    const cursor = feedbackCollection.find({});
    const users = await cursor.toArray();
    res.send(users); 
  });

    // PUT/UPDATE API Status Update

    app.put("/updateStatus/:id", (req, res) => {
      const id = req.params.id;
      const updatedStatus = req.body.status;
      const filter = { _id: ObjectId(id) };
      console.log(updatedStatus);
      orderCollection
        .updateOne(filter, {
          $set: { status: updatedStatus },
        })
        .then((result) => {
          res.send(result);
        });
    });
    
    
    // PUT/UPDATE API Make Admin

    app.put("/makeAdmin", async (req, res) => {
      const filter = { email: req.body.email };
      const result = await usersCollection.find(filter).toArray();
      if (result) {
        const documents = await usersCollection.updateOne(filter, {
          $set: { role: "admin" },
        });
        console.log(documents);
      }
      
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

    // DELETE/REMOVE API My Order
    
    app.delete('/myOrders/:id', async(req, res) => {
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