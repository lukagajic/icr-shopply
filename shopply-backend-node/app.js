const express = require('express');
const cors = require('cors');

const PORT = 5000;
const app = express();

app.use(cors());

const usersRouter = require('./routes/users');
const categoriesRouter = require('./routes/categories');
const authRouter = require('./routes/auth');
const cityRouter = require('./routes/cities');
const productsRouter = require('./routes/products');
const dialogflowRouter = require('./routes/dialogflow');
const reviewsRouter = require('./routes/reviews');
const ordersRouter = require('./routes/orders');

app.listen(PORT, () => {
    console.log('Server started on port: ' + PORT);
});

app.use(express.json());

app.use('/users', usersRouter);
app.use('/categories', categoriesRouter);
app.use('/auth', authRouter);
app.use('/cities', cityRouter);
app.use('/products', productsRouter);
app.use('/dialogflow', dialogflowRouter);
app.use('/reviews', reviewsRouter);
app.use('/orders', ordersRouter);

module.exports = app;
