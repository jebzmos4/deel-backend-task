const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model')
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

/**
 * @returns okay for health check
 */
app.get('/health' , async (req, res) =>{
    return res.status(200).json({message: "Service is Up"});
});

const adminRoutes = require( './routes/admin.routes');
const contractRoutes = require( './routes/contract.routes');
const jobRoutes = require( './routes/job.routes');
const transactionRoutes = require( './routes/transaction.routes');

app.use('/admin', adminRoutes);
app.use('/contracts', contractRoutes);
app.use('/balances', transactionRoutes);
app.use('/jobs', jobRoutes);

module.exports = app;
