const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// connection setup with database with secure password on environment variable
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s0zuqgx.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Create dynamic data and send to the database
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        client.connect();
        const productCollection = client.db('orderListTable').collection('product');
        const orderCollection = client.db('orderListTable').collection('order');
        // console.log("orderListTableServer successfully connected to MongoDB!");

        /* for productCollection */

        // 01. get all products data
        app.get('/product', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

        /* for orderCollection */

        // 01. get all orders data
        app.get('/order', async (req, res) => {
            const { order_status, product_name } = req.query;
            // console.log(order_status, product_name);
            const query = {};
            if (order_status) query.order_status = order_status;
            // if (product_name) query.product.product_name = product_name;
            const cursor = orderCollection.find(query);
            let orders = await cursor.toArray();
            // res.send(orders);
            res.send(orders);
        });

        /* 
        // 01. get all orders data
        app.get('/order', async (req, res) => {
            const { search } = req.query;

            // Define an empty query object to be used for filtering
            const query = {};

            // Create a cursor to fetch data from the collection
            const cursor = orderCollection.find(query);

            try {
                // Convert the cursor to an array of orders
                const orders = await cursor.toArray();

                // Check if the 'orders' array has data
                if (!orders || orders.length === 0) {
                    return res.status(404).json({ error: 'No orders found.' });
                }

                // Extract the 'orders' array from the first document
                const orderData = orders[0].orders;

                // Check if a search query is provided
                if (search) {
                    // Filter the orders based on the 'customer_name' attribute
                    let results = orderData.filter(item => item?.customer_name?.includes(search));

                    // Send the filtered results as the response
                    res.json(results);
                } else {
                    // If no search query is provided, return all orders
                    res.json(orderData);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
                res.status(500).json({ error: 'Internal server error.' });
            }
        }); 
        */

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Order-List-Table Server');
});

app.listen(port, () => {
    console.log('Listening to port', port);
});