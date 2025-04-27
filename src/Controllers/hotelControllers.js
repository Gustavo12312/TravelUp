const Hotel = require('../models/Hotel');
const City = require('../models/City');

const controller = {};

controller.list = async (req, res) => {
    try {
        const hotels = await Hotel.findAll({
            include: [City],
            order: [
                ['id', 'DESC'] 
            ]
        });
        res.status(200).json({ success: true, data: hotels });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching hotels", error: error.message });
    }
};

controller.get = async (req, res) => {
    try {
        const { id } = req.params;
        const hotel = await Hotel.findOne({
            where: { id },
            include: [City]
        });

        if (!hotel) {
            return res.status(404).json({ success: false, message: "Hotel not found" });
        }
        res.status(200).json({ success: true, data: hotel });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching hotel", error: error.message });
    }
};

controller.getCity = async (req, res) => {
    try {
        const { cityId } = req.params;
        const hotel = await Hotel.findAll({
            where: { cityId },
            include: [City]
        });

        if (!hotel) {
            return res.status(200).json({ success: true, message: "Hotel not found" });
        }
        res.status(200).json({ success: true, data: hotel });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching hotel", error: error.message });
    }
};

controller.create = async (req, res) => {
    try {
        const { name, cityId } = req.body;
        const newHotel = await Hotel.create({ name, cityId });
        res.status(201).json({ success: true, message: "Hotel created successfully", data: newHotel });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating hotel", error: error.message });
    }
};

controller.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, cityId } = req.body;
        const hotel = await Hotel.findByPk(id);

        if (!hotel) {
            return res.status(404).json({ success: false, message: "Hotel not found" });
        }

        await hotel.update({ name, cityId });
        res.status(200).json({ success: true, message: "Hotel updated successfully", data: hotel });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating hotel", error: error.message });
    }
};

controller.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const hotel = await Hotel.findByPk(id);

        if (!hotel) {
            return res.status(404).json({ success: false, message: "Hotel not found" });
        }

        await hotel.destroy();
        res.status(200).json({ success: true, message: "Hotel deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting hotel", error: error.message });
    }
};

module.exports = controller;
