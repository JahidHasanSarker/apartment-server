const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
// const ObjectId = require('mongodb').ObjectId;



const app = express()
const port = 5000;


//middleware

app.use(cors());
app.use(express.json());

// MongoDb 


const uri = "mongodb+srv://<username>:<password>@cluster0.gfhug.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{
        await client.connect();
        const database = client.db('practise');
        const usersCollection = database.collection('users');
		
		
		// There will be All API 
		
		
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