const City = require('../models/City');

const controller = {};

controller.list = async (req, res) => {
    try {
        const cities = await City.findAll({
            order: [
                ['id', 'DESC'] 
            ]
        });
        res.status(200).json({ success: true, data: cities });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching cities", error: error.message });
    }
};

controller.get = async (req, res) => {
    try {
        const { id } = req.params;
        const city = await City.findOne({ where: { id } });

        if (!city) {
            return res.status(404).json({ success: false, message: "City not found" });
        }
        res.status(200).json({ success: true, data: city });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching city", error: error.message });
    }
};

controller.create = async (req, res) => {
    try {
        const { name } = req.body;
        const newCity = await City.create({ name });
        res.status(201).json({ success: true, message: "City created successfully", data: newCity });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating city", error: error.message });
    }
};

controller.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const city = await City.findByPk(id);

        if (!city) {
            return res.status(404).json({ success: false, message: "City not found" });
        }

        await city.update({ name });
        res.status(200).json({ success: true, message: "City updated successfully", data: city });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating city", error: error.message });
    }
};

controller.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const city = await City.findByPk(id);

        if (!city) {
            return res.status(404).json({ success: false, message: "City not found" });
        }

        await city.destroy();
        res.status(200).json({ success: true, message: "City deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting city", error: error.message });
    }
};

module.exports = controller;
