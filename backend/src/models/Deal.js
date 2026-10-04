const mongoose = require("mongoose");

const dealSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        value: {
            type: Number,
            required: true,
            min: 0
        },

        stage: {
            type: String,
            enum: [
                "Prospecting",
                "Qualified",
                "Proposal",
                "Negotiation",
                "Won",
                "Lost"
            ],
            default: "Prospecting"
        },

        lead: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lead",
            required: true
        },

        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        expectedCloseDate: {
            type: Date
        },

        notes: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Deal", dealSchema);
