const RequestComment = require('../models/RequestComment');
const Request = require('../models/Request');
const User = require('../models/User');

const controller = {};

controller.list = async (req, res) => {
    try {
        const { requestId } = req.params;
        const requestComments = await RequestComment.findAll({
            where: { requestId },
            include: [
                { model: Request },
                { model: User }
            ]
        });
        res.status(200).json({ success: true, data: requestComments });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching comments", error: error.message });
    }
};

controller.get = async (req, res) => {
    try {
        const { requestId } = req.params;
        const requestComment = await RequestComment.findAll({
            where: { requestId },
            include: [
                { model: Request },
                { model: User }
            ]
        });

        if (!requestComment) {
            return res.status(200).json({ success: true, message: "Comment not found" });
        }

        res.status(200).json({ success: true, data: requestComment });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching comment", error: error.message });
    }
};

controller.create = async (req, res) => {
    try {
        const { requestId, commentBy, message } = req.body;

        const newRequestComment = await RequestComment.create({
            requestId,
            commentBy,
            message
        });

        res.status(201).json({ success: true, message: "Comment created successfully", data: newRequestComment });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating comment", error: error.message });
    }
};

controller.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { message } = req.body;

        const requestComment = await RequestComment.findByPk(id);

        if (!requestComment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        await requestComment.update({ message });

        res.status(200).json({ success: true, message: "Comment updated successfully", data: requestComment });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating comment", error: error.message });
    }
};

controller.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const requestComment = await RequestComment.findByPk(id);

        if (!requestComment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        await requestComment.destroy();

        res.status(200).json({ success: true, message: "Comment deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting comment", error: error.message });
    }
};

module.exports = controller;
