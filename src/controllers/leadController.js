const Lead = require("../models/Lead");

// ==================== CREATE LEAD ====================
const createLead = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            company,
            source,
            status,
            notes
        } = req.body;

        if (!name || !email || !phone) {
            return res.status(400).json({
                message: "Name, email and phone are required"
            });
        }

        const lead = await Lead.create({
            name,
            email,
            phone,
            company,
            source,
            status,
            notes,
            assignedTo: req.user.id
        });

        res.status(201).json({
            message: "Lead created successfully",
            lead
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create lead",
            error: error.message
        });
    }
};


// ==================== GET ALL LEADS ====================
const getLeads = async (req, res) => {
    try {
        const leads = await Lead.find()
            .populate("assignedTo", "name email role")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: leads.length,
            leads
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch leads",
            error: error.message
        });
    }
};


// ==================== GET SINGLE LEAD ====================
const getLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id)
            .populate("assignedTo", "name email role");

        if (!lead) {
            return res.status(404).json({
                message: "Lead not found"
            });
        }

        res.status(200).json(lead);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch lead",
            error: error.message
        });
    }
};


// ==================== UPDATE LEAD ====================
const updateLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);

        if (!lead) {
            return res.status(404).json({
                message: "Lead not found"
            });
        }

        lead.name = req.body.name ?? lead.name;
        lead.email = req.body.email ?? lead.email;
        lead.phone = req.body.phone ?? lead.phone;
        lead.company = req.body.company ?? lead.company;
        lead.source = req.body.source ?? lead.source;
        lead.status = req.body.status ?? lead.status;
        lead.notes = req.body.notes ?? lead.notes;

        const updatedLead = await lead.save();

        res.status(200).json({
            message: "Lead updated successfully",
            lead: updatedLead
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update lead",
            error: error.message
        });
    }
};


// ==================== DELETE LEAD ====================
const deleteLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);

        if (!lead) {
            return res.status(404).json({
                message: "Lead not found"
            });
        }

        await lead.deleteOne();

        res.status(200).json({
            message: "Lead deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete lead",
            error: error.message
        });
    }
};


module.exports = {
    createLead,
    getLeads,
    getLead,
    updateLead,
    deleteLead
};
