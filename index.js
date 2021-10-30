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

        // POST API or add a service
        app.post('/hotels', async (req, res) => {
            const hotel = req.body;
            console.log('hit the post api', hotel)

            const result = await hotelsCollection.insertOne(hotel)
            console.log(result)
            res.json(result);
        })



    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('running my curd')

})

app.listen(port, () => {
    console.log('Running Server on port', port)
})