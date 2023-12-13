const ContractService = require('../services/contract.service');

const getContractById = async (req, res) => {
    try {
        const contract = await ContractService.getContractById(req);
        if (!contract) {
            res.sendStatus(404);
        } else {
            res.status(200).json(contract);
        }
    } catch (error) {
        res.status(500).json({ error });
    }
};

const getUnTerminatedUserContracts = async (req, res) => {
    try {
        const contracts = await ContractService.getUnTerminatedUserContracts(req);
        if (!contracts) {
            res.sendStatus(404);
        } else {
            res.status(200).json(contracts);
        }
    } catch (error) {
        res.status(500).json({ error });
    }
};

module.exports = {
    getContractById,
    getUnTerminatedUserContracts,
};
