const { Op } = require('sequelize');

const getBestProfession = async (req) => {
    const { Job, Contract, Profile } = req.app.get('models');
    const { start, end } = req.query;

    try {
        return await Profile.findOne({
            attributes: [
                'profession',
                [
                    req.app.get('sequelize').fn('SUM', req.app.get('sequelize').col('Contractor.Jobs.price')),
                    'earned',
                ],
            ],
            include: [
                {
                    model: Contract,
                    as: 'Contractor',
                    attributes: [],
                    required: true,
                    include: [
                        {
                            model: Job,
                            required: true,
                            attributes: [],
                            where: {
                                paid: true,
                                paymentDate: {
                                    [Op.gte]: start,
                                    [Op.lte]: end,
                                },
                            },
                        },
                    ],
                },
            ],
            where: {
                type: 'contractor',
            },
            group: ['profession'],
            order: [['earned', 'DESC']],
            limit: 1,
            subQuery: false,
        });

    } catch (error) {
        // Handle errors here
        console.error('Error in getBestProfession:', error);
        throw error;
    }
};

const getTopPayingClient = async (req) => {
    const { Job, Contract, Profile } = req.app.get('models');
    const { start, end, limit } = req.query;

    try {
        const paidJobsForPeriod = await Job.findAll({
            attributes: [[req.app.get('sequelize').fn('sum', req.app.get('sequelize').col('price')), 'totalPaid'],],
            order: [[req.app.get('sequelize').fn('sum', req.app.get('sequelize').col('price')), 'DESC']],
            where: {
                paid: true,
                paymentDate: {
                    [Op.between]: [start, end]
                }
            },
            include: [
                {
                    model: Contract,
                    include: [
                        {
                            model: Profile,
                            as: 'Client',
                            where: { type: 'client' },
                            attributes: ['firstName', 'lastName']
                        }
                    ],
                    attributes: ['ClientId']
                }
            ],
            group: 'Contract.ClientId',
            limit
        });
        return paidJobsForPeriod.map(function (x) {
            return {
                id: x.Contract.ClientId,
                fullName: x.Contract.Client.firstName + ' ' + x.Contract.Client.lastName,
                paid: x.dataValues.totalPaid
            };
        });
    } catch (error) {
        // Handle errors here
        console.error('Error in getTopPayingClient:', error);
        throw error;
    }
};


module.exports = {
    getBestProfession,
    getTopPayingClient
};
