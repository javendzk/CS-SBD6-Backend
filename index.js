const express = require('express');
const cors = require('cors');
const corsConfig = require('./src/configs/cors.config.js');
const dbConfig = require('./src/configs/db.config.js');

const storeRoute = require('./src/routes/store.route.js');
const userRoute = require('./src/routes/user.route.js');
const itemRoute = require('./src/routes/item.route.js');
const transactionRoute = require('./src/routes/transaction.route.js');

dbConfig.connect();
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(cors(corsConfig));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.get('/', (req, res) => {
    try {
        res.status(200).send("Javen's backend welcomes you");
    } catch (err) {
        res.status(503).send('[!] Server tidak tersedia');
    }
});

app.use('/store', storeRoute);
app.use('/user', userRoute);
app.use('/item', itemRoute);
app.use('/transaction', transactionRoute);

app.listen(PORT, () => {
    console.log(`[v] Server running di port ${PORT}!`);
});