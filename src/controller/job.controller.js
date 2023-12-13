const JobService = require('../services/job.service');

const getUnpaidJobs = async (req, res) => {
    try {
        const unpaidJobs = await JobService.getUnpaidJobs(req);
        if (!unpaidJobs) {
            res.sendStatus(404);
        } else {
            res.status(200).json(unpaidJobs);
        }
    } catch (error) {
        res.status(500).json({ error });
    }
};

const payJob = async (req, res) => {
    try {
        const response = await JobService.payJob(req);
        if (response === '') {
            res.status(404).json({ message: `Job not found` });
        } else if (typeof response === 'string' && response.includes('No paid found for this job')) {
            res.status(409).json({ message: `No paid found for this job` });
        } else {
            res.status(200).json({ message: response });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while paying for a job', error });
    }
};

module.exports = {
    getUnpaidJobs,
    payJob,
};
