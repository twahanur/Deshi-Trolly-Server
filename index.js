const express = require('express')
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
require('dotenv').config();

// Define Port Number
const port = process.env.PORT || 8080;

// Use Cors and bodyParser
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World')
});

// MongoDB Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.566ly.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log(`${!!err ? 'Database Connection Failed' : 'Database Connection Successful'}`);
  const productsCollection = client.db("Deshi-Trolly").collection("Products");
  const ordersCollection = client.db("Deshi-Trolly").collection("orders");


    // Get Products from database
    app.get('/products', (req, res) => {
        productsCollection.find()
        .toArray((err, items) => {
            res.send(items);
        })
    });

    // Save Product on database
    app.post('/addProduct', (req, res) => {
        const newProduct = req.body;
        console.log('adding new event: ', newProduct)
        productsCollection.insertOne(newProduct)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });

    // Find Product using id and Delete Product from Database
    app.delete('/deleteProduct/:id', (req, res) => {
        const id = ObjectID(req.params.id);
        productsCollection.deleteOne({_id: id})
        .then(result => {
            res.send(result.deletedCount > 0)
        })
    });

    // Get Product from Database using ID
    app.get('/products/:id', (req, res) => {
        const id = ObjectID(req.params.id);
        productsCollection.find({_id: id})
        .toArray((err, product) => {
            res.send(product);
        })
    });

     // Confirm Order and Save Order Details To Database
     app.post('/confirmOrder', (req, res) => {
        const newOrder = req.body;
        ordersCollection.insertOne(newOrder)
          .then(result => {
            res.send(result.insertedCount > 0);
          })
      });

      // Load Products Base On User Email Address
      app.get('/orders', (req, res) => {
          console.log(req.query.useremail)
        const queryEmail = req.query.useremail;
        ordersCollection.find({ useremail: queryEmail })
              .toArray((err, product) => {
                res.send(product);
              })
      })

});





app.listen(port, () => {
    console.log(`App Listening at http://localhost:${port}`)
})