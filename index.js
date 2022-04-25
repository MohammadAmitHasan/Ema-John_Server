const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vec96.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    const productCollection = client.db("Ema_John").collection("products");

    app.get('/products', async (req, res) => {
      // Get the query data
      const activePage = parseInt(req.query.activePage) || 0;
      const size = parseInt(req.query.size) || 10;
      const query = {};
      const cursor = productCollection.find(query);
      // Load specific page data
      const products = await cursor.skip(activePage * size).limit(size).toArray();
      res.send(products);
    })

    app.get('/totalProducts', async (req, res) => {
      const totalProducts = await productCollection.estimatedDocumentCount();
      res.send({ totalProducts });
    })

    app.post('/productKeys', async (req, res) => {
      const keys = req.body;
      const ids = keys.map(key => ObjectId(key));
      const query = { _id: { $in: ids } }
      const cursor = productCollection.find(query)
      const result = await cursor.toArray();
      res.send(result);
    })

  }
  finally { }
}
run().catch(console.dir)






app.get('/', (req, res) => {
  res.send('Welcome to Ema John Server');
})

app.listen(port, () => {
  console.log(`Ema John Server is up and running on port ${port}`)
})