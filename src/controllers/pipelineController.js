const Deal = require("../models/Deal");

// Get pipeline grouped by deal stage
const getPipeline = async (req, res) => {
    try {
        const deals = await Deal.find()
            .populate("lead", "name email company")
            .populate("assignedTo", "name email role")
            .sort({ createdAt: -1 });

        const pipeline = {};

        deals.forEach((deal) => {
            if (!pipeline[deal.stage]) {
                pipeline[deal.stage] = [];
            }

            pipeline[deal.stage].push(deal);
        });

        res.json({
            pipeline
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching pipeline",
            error: error.message
        });
    }
};

module.exports = {
    getPipeline
};