const Airport = require('../models/Airport');
const City = require('../models/City');

const controller = {};

controller.list = async (req, res) => {
    try {
        const airports = await Airport.findAll({
            include: [City],
            order: [
                ['id', 'DESC'] 
            ]
        });
        res.status(200).json({ success: true, data: airports });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching airports", error: error.message });
    }
};

controller.get = async (req, res) => {
    try {
        const { id } = req.params;
        const airport = await Airport.findOne({
            where: { id },
            include: [City]
        });

        if (!airport) {
            return res.status(404).json({ success: false, message: "Airport not found" });
        }
        res.status(200).json({ success: true, data: airport });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching airport", error: error.message });
    }
};

controller.getCity = async (req, res) => {
    try {
        const { cityId } = req.params;
        const airport = await Airport.findAll({
            where: { cityId },
            include: [City]
        });

        if (!airport) {
            return res.status(200).json({ success: true, message: "Airport not found" });
        }
        res.status(200).json({ success: true, data: airport });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching airport", error: error.message });
    }
};

controller.create = async (req, res) => {
    try {
        const { name, cityId } = req.body;

        const newAirport = await Airport.create({ 
            name, 
            cityId 
        });

        res.status(201).json({ success: true, message: "Airport created successfully", data: newAirport });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating airport", error: error.message });
    }
};

controller.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, cityId } = req.body;

        const airport = await Airport.findByPk(id);
        if (!airport) {
            return res.status(404).json({ success: false, message: "Airport not found" });
        }

        await airport.update({ name, cityId });

        res.status(200).json({ success: true, message: "Airport updated successfully", data: airport });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating airport", error: error.message });
    }
};

controller.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const airport = await Airport.findByPk(id);
        if (!airport) {
            return res.status(404).json({ success: false, message: "Airport not found" });
        }

        await airport.destroy();
        res.status(200).json({ success: true, message: "Airport deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting airport", error: error.message });
    }
};

module.exports = controller;
