const Lead = require("../models/Lead");
const Deal = require("../models/Deal");
const User = require("../models/User");

const getReports = async (req, res) => {
    try {
        const totalLeads = await Lead.countDocuments();

        const totalDeals = await Deal.countDocuments();

        const totalUsers = await User.countDocuments();

        const dealValue = await Deal.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$value" }
                }
            }
        ]);

        const dealsByStage = await Deal.aggregate([
            {
                $group: {
                    _id: "$stage",
                    count: { $sum: 1 },
                    value: { $sum: "$value" }
                }
            }
        ]);

        res.json({
            totalLeads,
            totalDeals,
            totalUsers,
            totalDealValue: dealValue[0]?.total || 0,
            dealsByStage
        });

    } catch (error) {
        res.status(500).json({
            message: "Error generating reports",
            error: error.message
        });
    }
};

module.exports = {
    getReports
};