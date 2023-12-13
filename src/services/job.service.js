const { Op } = require('sequelize');

const getUnpaidJobs = async (req) => {
    const { Job, Contract } = req.app.get('models');
    const profileId = req.profile.id;

    return await Job.findAll({
        include: [
            {
                model: Contract,
                required: true,
                where: {
                    [Op.or]: [
                        { ContractorId: profileId },
                        { ClientId: profileId },
                    ],
                    status: 'in_progress',
                },
            },
        ],
        where: {
            [Op.or]: [
                { paid: { [Op.eq]: false } },
                { paid: null },
            ],
        },
    });
};

const payJob = async (req) => {
    const { Contract, Job, Profile } = req.app.get('models');
    const { id: clientId, balance, type } = req.profile;
    const jobId = req.params.id;
    const sequelize = req.app.get('sequelize');

    try {
        const job = await Job.findOne({
            where: { id: jobId, paid: null },
            include: [
                {
                    model: Contract,
                    where: { status: 'in_progress', ClientId: clientId },
                },
            ],
        });

        if (!job) {
            throw new Error(`No unpaid job found with ID ${jobId}`);
        }

        if (type === 'client') {
            const amountToBePaid = job.price;
            const contractorId = job.Contract.ContractorId;

            if (balance >= amountToBePaid) {
                const paymentTransaction = await sequelize.transaction();

                try {
                    await Profile.update(
                        { balance: sequelize.literal(`balance - ${amountToBePaid}`) },
                        { where: { id: clientId }, transaction: paymentTransaction }
                    );

                    await Profile.update(
                        { balance: sequelize.literal(`balance + ${amountToBePaid}`) },
                        { where: { id: contractorId }, transaction: paymentTransaction }
                    );

                    await Job.update(
                        { paid: true, paymentDate: new Date() },
                        { where: { id: jobId }, transaction: paymentTransaction }
                    );

                    await paymentTransaction.commit();

                    return `Payment of ${amountToBePaid} for ${job.description} has been made successfully.`;
                } catch (error) {
                    await paymentTransaction.rollback();
                    throw new Error(`Payment failed. Please try again.`);
                }
            } else {
                throw new Error(`Insufficient balance to make the payment.`);
            }
        } else {
            throw new Error(`Invalid user type for making a payment.`);
        }
    } catch (error) {
        return error.message;
    }
};

module.exports = {
    getUnpaidJobs,
    payJob,
};
