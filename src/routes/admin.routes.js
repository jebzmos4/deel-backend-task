const express = require('express');
const { getBestProfession, getTopPayingClient } = require('../controller/admin.controller');

const adminRouter = express.Router();

adminRouter.get('/best-profession', getBestProfession);
adminRouter.get('/best-clients', getTopPayingClient);

module.exports = adminRouter;
