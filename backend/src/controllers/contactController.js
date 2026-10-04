const Contact = require("../models/Contact");

// Create contact
const createContact = async (req, res) => {
    try {
        const contact = await Contact.create({
            ...req.body,
            createdBy: req.user.id
        });

        res.status(201).json({
            message: "Contact created successfully",
            contact
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating contact",
            error: error.message
        });
    }
};

// Get all contacts
const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find()
            .populate("createdBy", "name email role");

        res.json({
            count: contacts.length,
            contacts
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching contacts",
            error: error.message
        });
    }
};

// Get single contact
const getContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id)
            .populate("createdBy", "name email role");

        if (!contact) {
            return res.status(404).json({
                message: "Contact not found"
            });
        }

        res.json(contact);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching contact",
            error: error.message
        });
    }
};

// Update contact
const updateContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!contact) {
            return res.status(404).json({
                message: "Contact not found"
            });
        }

        res.json({
            message: "Contact updated successfully",
            contact
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating contact",
            error: error.message
        });
    }
};

// Delete contact
const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);

        if (!contact) {
            return res.status(404).json({
                message: "Contact not found"
            });
        }

        res.json({
            message: "Contact deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting contact",
            error: error.message
        });
    }
};

module.exports = {
    createContact,
    getContacts,
    getContact,
    updateContact,
    deleteContact
};
