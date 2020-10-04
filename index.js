const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a6ded.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(bodyParser.json());
app.use(cors());


const port = 5000


const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
client.connect(err => {
    const organizationsCollection = client.db("volunteerNetwork").collection("organizations");
    const eventsCollection = client.db("volunteerNetwork").collection("events");

    app.post("/addOrganizations", (req, res) => {
        const organizations = req.body;
        organizationsCollection.insertMany(organizations)
        .then(result => {
            res.send(result.insertedCount)
        })
    })

    app.get('/organizations', (req, res) => {
        organizationsCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    app.get('/organizations/:id', (req, res) => {
        organizationsCollection.find({id: req.params.id})
        .toArray((err, documents) => {
            res.send(documents[0]);
        })
    })

    app.post("/addEvents", (req, res) => {
        const events = req.body;
        eventsCollection.insertOne(events)
        .then(result => {
            res.send(result.insertedCount)
        })
    })

    app.get('/events', (req, res) => {
        const queryEmail = req.query.email;
        eventsCollection.find({email: queryEmail})
            .toArray((err, documents) => {
                res.send(documents);
        })
    })

    app.delete('/eventDelete/:id', (req, res) => {
        eventsCollection.deleteOne({id: req.params.id})
            .then(result => {
                res.send(result.deletedCount > 0);
        })
    })

    app.get('/allEvents', (req, res) => {
        eventsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
        })
    })

    app.post("/createEvents", (req, res) => {
        const events = req.body;
        organizationsCollection.insertOne(events)
            .then(result => {
                res.send(result.insertedCount)
            })
    })

    app.delete('/deleteUserEvent/:id', (req, res) => {
        eventsCollection.deleteOne({id: req.params.id})
            .then(result => {
                res.send(result.deletedCount > 0);
            })
    })

    
});



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(process.env.PORT || port)



























// app.get('/products', (req, res) => {
//     productsCollection.find({})
//         .toArray((err, documents) => {
//             res.send(documents);
//         })
// })

// app.get('/product/:key', (req, res) => {
//     productsCollection.find({key: req.params.key})
//         .toArray((err, documents) => {
//             res.send(documents[0]);
//         })
// })

// app.post('/productByKeys', (req, res) => {
//     const productKeys = req.body;
//     productsCollection.find({key: {$in: productKeys}})
//         .toArray((err, documents) => {
//             res.send(documents);
//         })
// })

// app.post('/addOrder', (req, res) => {
//     const order = req.body;
//     orderCollection.insertOne(order)
//         .then(result => {
//             console.log(result.insertedCount);
//             res.send(result.insertedCount > 0);
//         }).catch(err => {
//             console.log(err);
//         })
// })