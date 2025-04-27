const Protocol = require('../models/Protocol');
const Hotel = require('../models/Hotel');

const controller = {};

controller.list = async (req, res) => {
    try {
        const protocols = await Protocol.findAll({
            include: Hotel
        });
        res.status(200).json({ success: true, data: protocols });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching protocols", error: error.message });
    }
};

controller.get = async (req, res) => {
    try {
        const { hotelId } = req.params;
        const protocol = await Protocol.findOne({
            where: { hotelId },
            include: Hotel
        });

        if (!protocol) {
            return res.status(200).json({ success: true, message: "Protocol not found" });
        }
        res.status(200).json({ success: true, data: protocol });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching protocol", error: error.message });
    }
};

controller.create = async (req, res) => {
    try {
        const { hotelId, discountRate, procedure } = req.body;

        const newProtocol = await Protocol.create({
            hotelId,
            discountRate,
            procedure
        });

        res.status(201).json({ success: true, message: "Protocol created successfully", data: newProtocol });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating protocol", error: error.message });
    }
};

controller.update = async (req, res) => {
    try {
        const { hotelId } = req.params;
        const { discountRate, procedure } = req.body;

        const protocol = await Protocol.findOne({
            where: {hotelId}
        });

        if (!protocol) {
            return res.status(404).json({ success: false, message: "Protocol not found" });
        }

        await protocol.update({
            discountRate,
            procedure
        });

        res.status(200).json({ success: true, message: "Protocol updated successfully", data: protocol });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating protocol", error: error.message });
    }
};

controller.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const protocol = await Protocol.findByPk(id);

        if (!protocol) {
            return res.status(404).json({ success: false, message: "Protocol not found" });
        }

        await protocol.destroy();
        res.status(200).json({ success: true, message: "Protocol deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting protocol", error: error.message });
    }
};

module.exports = controller;
