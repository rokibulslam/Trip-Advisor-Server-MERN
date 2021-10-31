const express = require('express')
const app = express();
const cors = require('cors')
require('dotenv').config();
const port = process.env.PORT || 5000;
const {
    MongoClient
} = require('mongodb');
const ObjectId = require('mongodb').ObjectId

// middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2efaz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri)
async function run() {
    
    try {
        await client.connect()
        console.log('connected to database')
        const database = client.db("touristAdvisor")
        const hotelsCollection = database.collection("hotels")
        const orderCollection = database.collection("orders")
        app.get('/hotels', async (req, res) => {
            const cursor = hotelsCollection.find({})
            const hotels = await cursor.toArray();
            res.send(hotels)
        })
        app.get('/hotels/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: ObjectId(id)
            };
            const user = await hotelsCollection.findOne(query)
            console.log('load user with id:', id)
            res.json(user)
        })
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({})
            const orders = await cursor.toArray();
            res.send(orders)
        })
        app.get('/orders/:email', async (req, res) => {
            const query = {
                email: req.params.email
            }
            const result = await orderCollection.find(query).toArray();
            console.log(result)
            res.json(result)
        })

        // POST API / add a Hotels
        app.post('/hotels', async (req, res) => {
            const hotel = req.body;
            console.log('hit the post api', hotel)

            const result = await hotelsCollection.insertOne(hotel)
            console.log(result)
            res.json(result);
        })
        app.post('/orders', async (req, res) => {
            const order = req.body;
            console.log('hit the orders')
            const result = await orderCollection.insertOne(order)
            console.log(result)
            res.json(result)
        })
        // Update 
        app.put('/updateStatus/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const updateInfo = req.body
            console.log(updateInfo)
            const result = await orderCollection.updateOne({ _id: ObjectId(id) }, { $set: { status: updateInfo.status } })
            res.send(result)
        })
        app.put('/updateService/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const updateInfo = req.body
            console.log(updateInfo)
            const result = await hotelsCollection.updateOne({ _id: ObjectId(id) },
                {
                    $set: {
                        name: updateInfo.name,
                        price: updateInfo.price,
                        Description: updateInfo.Description,
                        img: updateInfo.img
                    }
                })
            res.send(result)
        })
        // Delete 
        app.delete('/deleteService/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await hotelsCollection.deleteOne(query)
            console.log(result)
            console.log(id)
            res.json(result)
            
        })
        // Delete Api 
        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(query)
            console.log(result)
            console.log(id)
            res.json(result)
            
        })
        

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('running my Tourist Server')

})

app.listen(port, () => {
    console.log('Running Server on port', port)
})