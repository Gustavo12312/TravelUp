const QuoteFlight = require('../models/QuoteFlight');
const Quote = require('../models/Quote');
const Airport = require('../models/Airport');

const controller = {};

controller.list = async (req, res) => {
    try {
        const quoteFlights = await QuoteFlight.findAll({
            include: [
                { model: Quote },
                { model: Airport, as: 'DepartureAirport' },
                { model: Airport, as: 'ArrivalAirport' }
            ],
            order: [
                ['id', 'DESC'] 
            ]
        });
        res.status(200).json({ success: true, data: quoteFlights });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching flights", error: error.message });
    }
};

controller.get = async (req, res) => {
    try {
        const { id } = req.params;
        const quoteFlight = await QuoteFlight.findOne({
            where: { id },
            include: [
                { model: Quote },
                { model: Airport, as: 'DepartureAirport' },
                { model: Airport, as: 'ArrivalAirport' }
            ]
        });

        if (!quoteFlight) {
            return res.status(404).json({ success: false, message: "Flight not found" });
        }
        res.status(200).json({ success: true, data: quoteFlight });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching Flight", error: error.message });
    }
};

controller.getFlight = async (req, res) => {
    try {
        const { quoteId } = req.params;
        const quoteFlight = await QuoteFlight.findAll({
            where: { quoteId },
            include: [
                { model: Quote },
                { model: Airport, as: 'DepartureAirport' },
                { model: Airport, as: 'ArrivalAirport' }
            ]
        });

        if (!quoteFlight) {
            return res.status(404).json({ success: false, message: "Flight not found" });
        }
        res.status(200).json({ success: true, data: quoteFlight });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching Flight", error: error.message });
    }
};

controller.create = async (req, res) => {
    try {
        const {
            quoteId,
            flightNumber,
            departureAirportId,
            arrivalAirportId,
            departureDateTime,
            arrivalDateTime,
            price,
            isReturnTrip,
            hasStops
        } = req.body;

        const newQuoteFlight = await QuoteFlight.create({
            quoteId,
            flightNumber,
            departureAirportId,
            arrivalAirportId,
            departureDateTime,
            arrivalDateTime,
            price,
            isReturnTrip,
            hasStops
        });

        res.status(201).json({ success: true, message: "Flight created successfully", data: newQuoteFlight });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating Flight", error: error.message });
    }
};

controller.update = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            quoteId,
            flightNumber,
            departureAirportId,
            arrivalAirportId,
            departureDateTime,
            arrivalDateTime,
            price,
            isReturnTrip,
            hasStops
        } = req.body;

        const quoteFlight = await QuoteFlight.findByPk(id);

        if (!quoteFlight) {
            return res.status(404).json({ success: false, message: "Flight not found" });
        }

        await quoteFlight.update({
            quoteId,
            flightNumber,
            departureAirportId,
            arrivalAirportId,
            departureDateTime,
            arrivalDateTime,
            price,
            isReturnTrip,
            hasStops
        });

        res.status(200).json({ success: true, message: "Flight updated successfully", data: quoteFlight });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating flight", error: error.message });
    }
};

controller.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const quoteFlight = await QuoteFlight.findByPk(id);

        if (!quoteFlight) {
            return res.status(404).json({ success: false, message: "Flight not found" });
        }

        await quoteFlight.destroy();
        res.status(200).json({ success: true, message: "Flight deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting flight", error: error.message });
    }
};

module.exports = controller;
