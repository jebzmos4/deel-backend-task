const express = require('express');

const { getContractById, getUnTerminatedUserContracts } = require('../controller/contract.controller');
const { getProfile } = require('../middleware/getProfile');

const contractRouter = express.Router();

contractRouter.get('/',getProfile, getUnTerminatedUserContracts);
contractRouter.get('/:id', getProfile, getContractById);

module.exports = contractRouter;
