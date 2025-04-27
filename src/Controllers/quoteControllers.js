const Quote = require('../models/Quote');
const Request = require('../models/Request');
const Agency = require('../models/Agency');

const controller = {};

controller.list = async (req, res) => {
    try {
        const quotes = await Quote.findAll({
            include: [
                Request,
                Agency
            ],
            order: [
                ['id', 'DESC'] 
            ]
        });
        res.status(200).json({ success: true, data: quotes });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching quotes", error: error.message });
    }
};

controller.getByRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const quote = await Quote.findAll({
            where: { requestId },
            include: [
                Request,
                Agency
            ]
        });

        if (!quote) {
            return res.status(404).json({ success: false, message: "Quote not found" });
        }
        res.status(200).json({ success: true, data: quote });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching quote", error: error.message });
    }
};

controller.getSelected = async (req, res) => {
    try {
        const { requestId } = req.params;
        const quote = await Quote.findOne({
            where: { 
                requestId, 
                isSelected:true 
            },
            include: [
                Request,
                Agency
            ]
        });

        if (!quote) {
            return res.status(200).json({ success: true, message: "Quote not found" });
        }
        res.status(200).json({ success: true, data: quote });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching quote", error: error.message });
    }
};

controller.create = async (req, res) => {
    try {
        const { requestId, agencyId } = req.body;

        const newQuote = await Quote.create({
            requestId,
            agencyId
        });

        res.status(201).json({ success: true, message: "Quote created successfully", data: newQuote });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating quote", error: error.message });
    }
};

controller.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { requestId, agencyId, isSelected } = req.body;

        const quote = await Quote.findByPk(id);

        if (!quote) {
            return res.status(404).json({ success: false, message: "Quote not found" });
        }

        await quote.update({
            requestId,
            agencyId,
            isSelected
        });

        res.status(200).json({ success: true, message: "Quote updated successfully", data: quote });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating quote", error: error.message });
    }
};

controller.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const quote = await Quote.findByPk(id);

        if (!quote) {
            return res.status(404).json({ success: false, message: "Quote not found" });
        }

        await quote.destroy();
        res.status(200).json({ success: true, message: "Quote deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting quote", error: error.message });
    }
};

module.exports = controller;
