const Agency = require('../models/Agency');

const controller = {};

controller.list = async (req, res) => {
    try {
        const agencies = await Agency.findAll({
            order: [
                ['id', 'DESC'] 
            ]
        });
        res.status(200).json({ success: true, data: agencies });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching agencies", error: error.message });
    }
};

controller.get = async (req, res) => {
    try {
        const { id } = req.params;
        const agency = await Agency.findOne({
            where: { id }
        });

        if (!agency) {
            return res.status(404).json({ success: false, message: "Agency not found" });
        }

        res.status(200).json({ success: true, data: agency });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching agency", error: error.message });
    }
};

controller.create = async (req, res) => {
    try {
        const { name, email, isActive } = req.body;

        const newAgency = await Agency.create({
            name,
            email,
            isActive
        });

        res.status(201).json({ success: true, message: "Agency created successfully", data: newAgency });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating agency", error: error.message });
    }
};

controller.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, isActive } = req.body;

        const agency = await Agency.findByPk(id);
        if (!agency) {
            return res.status(404).json({ success: false, message: "Agency not found" });
        }

        await agency.update({
            name,
            email,
            isActive
        });

        res.status(200).json({ success: true, message: "Agency updated successfully", data: agency });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating agency", error: error.message });
    }
};

controller.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const agency = await Agency.findByPk(id);
        if (!agency) {
            return res.status(404).json({ success: false, message: "Agency not found" });
        }

        await agency.destroy();
        res.status(200).json({ success: true, message: "Agency deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting agency", error: error.message });
    }
};

module.exports = controller;
