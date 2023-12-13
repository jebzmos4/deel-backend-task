const { Op } = require('sequelize');

const getContractById = async (req) => {
    const { Contract } = req.app.get('models');
    const profileId = req.profile.id;
    return await Contract.findOne({
        where: {
            id: req.params.id,
            [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
        },
    });
};

const getUnTerminatedUserContracts = async (req) => {
    const { Contract } = req.app.get('models');
    const profileId = req.profile.id;

    return await Contract.findAll({
        where: {
            [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
            status: {
                [Op.ne]: 'terminated',
            },
        },
    });
};


module.exports = { getContractById, getUnTerminatedUserContracts };
