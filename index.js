const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vec96.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {

    app.get('/products', async (req, res) => {
      await client.connect();
      const productCollection = client.db("Ema_John").collection("products");
      const query = {};
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
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