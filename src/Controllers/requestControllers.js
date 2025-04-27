const City = require('../models/City');
const Project = require('../models/Project');
const Quote = require('../models/Quote');
const Request = require('../models/Request');
const RequestStatus = require('../models/RequestStatus');
const QuoteFlight  = require('../Models/QuoteFlight');
const QuoteHotel  = require('../Models/QuoteHotel');
const User = require('../models/User');
const { Op } = require("sequelize");

const controller = {};

controller.list = async (req, res) => {
    try {
        const requests = await Request.findAll({
            include: [
                User,
                Project,
                { model: City, as: 'OriginCity'},
                { model: City, as: 'DestinationCity'},
                RequestStatus,
                Quote
            ],
            order: [
                ['id', 'DESC'] 
            ]
        });
        res.status(200).json({ success: true, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching requests", error: error.message });
    }
};

controller.get = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await Request.findOne({
            where: { id },
            include: [
                User,
                Project,
                { model: City, as: 'OriginCity' },
                { model: City, as: 'DestinationCity' },
                RequestStatus,
                Quote
            ]
        });

        if (!request) {
            return res.status(204).json({ success: true, message: "Request not found" });
        }
        res.status(200).json({ success: true, data: request });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching request", error: error.message });
    }
};

controller.getbyUser = async (req, res) => {
    try {
        const { requestedBy } = req.params;
        const request = await Request.findAll({
            where: { requestedBy },
            include: [
                User,
                Project,
                { model: City, as: 'OriginCity' },
                { model: City, as: 'DestinationCity' },
                RequestStatus,
                Quote
            ]
        });

        if (!request) {
            return res.status(204).json({ success: true, message: "Request not found" });
        }
        res.status(200).json({ success: true, data: request });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching request", error: error.message });
    }
};

controller.getbyStatusId = async (req, res) => {
    try {
        const { requestStatusId } = req.params;
        const request = await Request.findAll({
            where: { requestStatusId },
            include: [
                User,
                Project,
                { model: City, as: 'OriginCity' },
                { model: City, as: 'DestinationCity' },
                RequestStatus,
                Quote
            ]
        });

        if (!request) {
            return res.status(204).json({ success: true, message: "Request not found" });
        }
        res.status(200).json({ success: true, data: request });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching request", error: error.message });
    }
};

controller.getbyStatusIdWithCost = async (req, res) => {
    try {
        const { requestStatusId } = req.params;

        // Fetch requests based on the status
        const requests = await Request.findAll({
            where: { requestStatusId,  },
            include: [
                User,
                Project,
                { model: City, as: 'OriginCity' },
                { model: City, as: 'DestinationCity' },
                RequestStatus,
                {
                    model: Quote,
                    where: { isSelected: true },
                    include: [
                        {
                            model: QuoteFlight,  
                            attributes: ['price'],
                            foreignKey: 'quoteId' 
                        },
                        {
                            model: QuoteHotel,  
                            attributes: ['pricePerNight'],
                            foreignKey: 'quoteId'  
                        }
                    ]
                }
            ]
        });

        if (requests.length === 0) {
            return res.status(200).json({ success: true, data: requests , message: "No requests found for the given status" });
        }

        //Process each request to calculate total costs
        const processedRequests = requests.map(request => {
            // Calculate the total cost for each quote
            const Cost = request.quotes.reduce((total, quote) => {
                // Calculate flight cost for the quote (sum all flight prices)
                const flightCost = quote.quoteflights.reduce((flightTotal, flight) => flightTotal + (flight.price || 0), 0);

                // Calculate hotel cost for the quote (sum all hotel prices)
                const hotelCost = quote.quotehotels.reduce((hotelTotal, hotel) => hotelTotal + (hotel.pricePerNight || 0), 0);

                // Add flight and hotel costs to get the total cost for this quote
                return total + flightCost + hotelCost;
            }, 0);

            return {
                ...request.dataValues,Cost
            };
        });
        res.status(200).json({ success: true, data: processedRequests });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error fetching request data", error: error.message });
    }
};




controller.getApprovedrequests = async (req, res) => {
    try {
        const currentDate = new Date(); // Get current date
        const { requestedBy } = req.params;

        const request = await Request.findAll({
            where: {
                requestStatusId: 5,
                requestedBy: requestedBy,
                travelDate: {
                    [Op.gt]: currentDate // Only fetch requests where travelDate > current date
                }
            },
            include: [
                User,
                Project,
                { model: City, as: "OriginCity" },
                { model: City, as: "DestinationCity" },
                RequestStatus,
                Quote
            ]
        });

        if (!request) {
            return res.status(204).json({ success: true, message: "No matching requests found" });
        }

        res.status(200).json({ success: true, data: request });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching requests", error: error.message });
    }
};

controller.getOpenrequests = async (req, res) => {
    try {
        const excludedStatusIds = [1, 5, 8];
        const { requestedBy } = req.params;

        const request = await Request.findAll({
            where: {
                requestStatusId: {
                    [Op.notIn]: excludedStatusIds
                },
                requestedBy: requestedBy
            },
            include: [
                User,
                Project,
                { model: City, as: "OriginCity" },
                { model: City, as: "DestinationCity" },
                RequestStatus,
                Quote
            ]
        });

        if (!request) {
            return res.status(204).json({ success: true, message: "No matching requests found" });
        }

        res.status(200).json({ success: true, data: request });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching requests", error: error.message });
    }
};


controller.create = async (req, res) => {
    try {
        const {
            requestedBy,
            requestStatusId,
            code,
            projectId,
            description,
            originCityId,
            destinationCityId,
            isRoundTrip,
            travelDate,
            returnDate,
            isHotelNeeded,
            checkInDate,
            checkOutDate,
        } = req.body;
        console.log("Request body received:", req.body);

        const newRequest = await Request.create({
            requestedBy,
            requestStatusId,
            code,
            projectId,
            description,
            originCityId,
            destinationCityId,
            isRoundTrip,
            travelDate,
            returnDate,
            isHotelNeeded,
            checkInDate,
            checkOutDate,
        });

        res.status(201).json({ success: true, message: "Request created successfully", data: newRequest });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating request", error: error.message });
    }
};

controller.update = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            requestStatusId,
            code,
            projectId,
            description,
            originCityId,
            destinationCityId,
            isRoundTrip,
            travelDate,
            returnDate,
            isHotelNeeded,
            checkInDate,
            checkOutDate,
            justification
        } = req.body;

        const request = await Request.findByPk(id);
        if (!request) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }

        await request.update({
            requestStatusId,
            code,
            projectId,
            description,
            originCityId,
            destinationCityId,
            isRoundTrip,
            travelDate,
            returnDate,
            isHotelNeeded,
            checkInDate,
            checkOutDate,
            justification
        });

        res.status(200).json({ success: true, message: "Request updated successfully", data: request });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating request", error: error.message });
    }
};

controller.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await Request.findByPk(id);
        if (!request) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }

        await request.destroy();
        res.status(200).json({ success: true, message: "Request deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting request", error: error.message });
    }
};

module.exports = controller;
