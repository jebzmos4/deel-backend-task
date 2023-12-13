const AdminService = require('../services/admin.service');

const getBestProfession = async (req, res) => {
    try {
        const bestProfession = await AdminService.getBestProfession(req);
        if (!bestProfession) {
            res.status(404).json({ message: 'best profession not found' });
        } else {
            res.status(200).json(bestProfession);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while fetching best profession', error });
    }
};

const getTopPayingClient = async (req, res) => {
    try {
        const topClient = await AdminService.getTopPayingClient(req);
        if (!topClient) {
            res.status(404).json({ message: 'highest Paying Client not found' });
        } else {
            res.status(200).json(topClient);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while fetching highest paying client', error });
    }
};

module.exports = {
    getBestProfession,
    getTopPayingClient
};
