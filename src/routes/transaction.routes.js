const express = require('express');

const { deposit } = require('../controller/transaction.controller');

const transactionRoutes = express.Router();

transactionRoutes.post('/deposit/:userId', deposit);

module.exports = transactionRoutes;
