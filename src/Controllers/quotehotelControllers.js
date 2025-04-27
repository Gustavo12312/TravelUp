const QuoteHotel = require('../models/QuoteHotel');
const Quote = require('../models/Quote');
const Hotel = require('../models/Hotel');

const controller = {};

controller.list = async (req, res) => {
    try {
        const quoteHotels = await QuoteHotel.findAll({
            include: [
                { model: Quote },
                { model: Hotel }
            ],
            order: [
                ['id', 'DESC'] 
            ]
        });
        res.status(200).json({ success: true, data: quoteHotels });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching hotels", error: error.message });
    }
};

controller.get = async (req, res) => {
    try {
        const { id } = req.params;
        const quoteHotel = await QuoteHotel.findOne({
            where: { id },
            include: [
                { model: Quote },
                { model: Hotel }
            ]
        });

        if (!quoteHotel) {
            return res.status(404).json({ success: false, message: "Hotel not found" });
        }
        res.status(200).json({ success: true, data: quoteHotel });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching hotel", error: error.message });
    }
};

controller.getByHotel = async (req, res) => {
    try {
        const { quoteId } = req.params;
        const quoteFlight = await QuoteHotel.findAll({
            where: { quoteId },
            include: [
                { model: Quote },
                { model: Hotel }
            ]
        });

        if (!quoteFlight) {
            return res.status(404).json({ success: false, message: "Hotel not found" });
        }
        res.status(200).json({ success: true, data: quoteFlight });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching Hotel", error: error.message });
    }
};

controller.create = async (req, res) => {
    try {
        const {
            quoteId,
            hotelId,
            checkInDate,
            checkOutDate,
            pricePerNight
        } = req.body;

        const newQuoteHotel = await QuoteHotel.create({
            quoteId,
            hotelId,
            checkInDate,
            checkOutDate,
            pricePerNight
        });

        res.status(201).json({ success: true, message: "Hotel created successfully", data: newQuoteHotel });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating hotel", error: error.message });
    }
};

controller.update = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            hotelId,
            checkInDate,
            checkOutDate,
            pricePerNight
        } = req.body;

        const quoteHotel = await QuoteHotel.findByPk(id);

        if (!quoteHotel) {
            return res.status(404).json({ success: false, message: "Hotel not found" });
        }

        await quoteHotel.update({
            hotelId,
            checkInDate,
            checkOutDate,
            pricePerNight
        });

        res.status(200).json({ success: true, message: "Hotel updated successfully", data: quoteHotel });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating hotel", error: error.message });
    }
};

controller.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const quoteHotel = await QuoteHotel.findByPk(id);

        if (!quoteHotel) {
            return res.status(404).json({ success: false, message: "Hotel not found" });
        }

        await quoteHotel.destroy();
        res.status(200).json({ success: true, message: "Hotel deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting hotel", error: error.message });
    }
};

module.exports = controller;
