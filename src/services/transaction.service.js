const deposit = async (req) => {
    const clientId = req.params.userId;
    const depositAmount = req.body.amount;
    const { Job, Contract, Profile } = req.app.get('models');
    const sequelize = req.app.get('sequelize');
    const depositTransaction = await sequelize.transaction();

    try {
        const client = await Profile.findByPk(clientId, { transaction: depositTransaction });

        const totalJobsToPay = await Job.findAll({
            attributes: [
                [sequelize.fn('SUM', sequelize.col('price')), 'totalPrice']
            ],
            include: [
                {
                    model: Contract,
                    attributes: [],
                    required: true,
                    where: {
                        ClientId: clientId,
                        status: 'in_progress',
                    },
                },
            ],
            where: {
                paid: null,
            },
            transaction: depositTransaction,
        });

        const { totalPrice } = totalJobsToPay[0].dataValues;

        if (totalPrice === null) {
            throw new Error(`There are no unpaid jobs for client ${clientId}.`);
        }

        const depositThreshold = totalPrice * 0.25;

        if (depositAmount > depositThreshold) {
            throw new Error(`Maximum deposit amount reached. Deposit ${depositAmount} is more than 25% of client ${clientId}'s total of jobs to pay.`);
        }

        await client.increment({ balance: depositAmount }, { transaction: depositTransaction });

        await depositTransaction.commit();

        return client;
    } catch (error) {
        console.log(error);
        await depositTransaction.rollback();
        throw error; // Re-throw the error to propagate it up the call stack.
    }
};

module.exports = {
    deposit,
};
