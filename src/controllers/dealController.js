
const Deal = require("../models/Deal");
const Lead = require("../models/Lead");
const { getIO } = require("../socket/socket");

// ==================== CREATE DEAL ====================
const createDeal = async (req, res) => {
    try {
        const {
            title,
            value,
            stage,
            lead,
            expectedCloseDate,
            notes
        } = req.body;

        if (!title || value === undefined || !lead) {
            return res.status(400).json({
                message: "Title, value and lead are required"
            });
        }

        const existingLead = await Lead.findById(lead);

        if (!existingLead) {
            return res.status(404).json({
                message: "Lead not found"
            });
        }

        const deal = await Deal.create({
            title,
            value,
            stage: stage || "Prospecting",
            lead,
            assignedTo: req.user.id,
            expectedCloseDate,
            notes
        });

        const populatedDeal = await Deal.findById(deal._id)
            .populate("lead", "name email company")
            .populate("assignedTo", "name email role");

        // Real-time pipeline update
        getIO().emit("pipelineUpdated", populatedDeal);

        res.status(201).json({
            message: "Deal created successfully",
            deal: populatedDeal
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create deal",
            error: error.message
        });
    }
};


// ==================== GET ALL DEALS ====================
const getDeals = async (req, res) => {
    try {
        const deals = await Deal.find()
            .populate("lead", "name email company")
            .populate("assignedTo", "name email role")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: deals.length,
            deals
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch deals",
            error: error.message
        });
    }
};


// ==================== GET SINGLE DEAL ====================
const getDeal = async (req, res) => {
    try {
        const deal = await Deal.findById(req.params.id)
            .populate("lead", "name email company")
            .populate("assignedTo", "name email role");

        if (!deal) {
            return res.status(404).json({
                message: "Deal not found"
            });
        }

        res.status(200).json(deal);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch deal",
            error: error.message
        });
    }
};


// ==================== UPDATE DEAL ====================
const updateDeal = async (req, res) => {
    try {
        const deal = await Deal.findById(req.params.id);

        if (!deal) {
            return res.status(404).json({
                message: "Deal not found"
            });
        }

        const oldStage = deal.stage;

        deal.title = req.body.title ?? deal.title;
        deal.value = req.body.value ?? deal.value;
        deal.stage = req.body.stage ?? deal.stage;
        deal.expectedCloseDate =
            req.body.expectedCloseDate ?? deal.expectedCloseDate;
        deal.notes = req.body.notes ?? deal.notes;

        const updatedDeal = await deal.save();

        const populatedDeal = await Deal.findById(updatedDeal._id)
            .populate("lead", "name email company")
            .populate("assignedTo", "name email role");

        // Emit real-time event when pipeline changes
        if (oldStage !== populatedDeal.stage) {
            getIO().emit("pipelineUpdated", populatedDeal);
        }

        res.status(200).json({
            message: "Deal updated successfully",
            deal: populatedDeal
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update deal",
            error: error.message
        });
    }
};


// ==================== DELETE DEAL ====================
const deleteDeal = async (req, res) => {
    try {
        const deal = await Deal.findById(req.params.id);

        if (!deal) {
            return res.status(404).json({
                message: "Deal not found"
            });
        }

        await deal.deleteOne();

        getIO().emit("pipelineUpdated", {
            deletedDealId: req.params.id
        });

        res.status(200).json({
            message: "Deal deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete deal",
            error: error.message
        });
    }
};


module.exports = {
    createDeal,
    getDeals,
    getDeal,
    updateDeal,
    deleteDeal
};
