const transactionService = require('../services/transaction.service');

const deposit = async (req, res) => {
    try {
        const response = await transactionService.deposit(req);

        if (typeof response === 'string') {
            if (response.includes('Maximum deposit amount reached')) {
                res.status(409).json({ message: response });
            } else if (response.includes("There are no unpaid jobs for client")) {
                res.status(404).json({ message: response });
            } else {
                res.status(200).json({ message: response });
            }
        } else {
            res.status(200).json(response);
        }

    } catch (error) {
        console.trace(error);
        res.status(500).json({ message: 'Error occurred while depositing money' });
    }
};

module.exports = {
    deposit,
};
