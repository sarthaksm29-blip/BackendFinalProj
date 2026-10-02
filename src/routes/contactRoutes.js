const express = require("express");

const {
    createContact,
    getContacts,
    getContact,
    updateContact,
    deleteContact
} = require("../controllers/contactController");

const { protect } = require("../middleware/authMiddleware");

const { validateRequired } = require("../middleware/validationMiddleware");

const router = express.Router();

// Create contact
router.post(
    "/",
    protect,
    validateRequired(["name", "email", "phone", "company"]),
    createContact
);

// Get all contacts
router.get("/", protect, getContacts);

// Get single contact
router.get("/:id", protect, getContact);

// Update contact
router.put("/:id", protect, updateContact);

// Delete contact
router.delete("/:id", protect, deleteContact);

module.exports = router;