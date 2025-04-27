const Project = require('../models/Project');

const controller = {};

controller.list = async (req, res) => {
    try {
        const projects = await Project.findAll({
            order: [
                ['id', 'DESC'] 
            ]
        });
        res.status(200).json({ success: true, data: projects });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching projects", error: error.message });
    }
};

controller.get = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findOne({
            where: { id }
        });

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }
        res.status(200).json({ success: true, data: project });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching project", error: error.message });
    }
};

controller.create = async (req, res) => {
    try {
        const { code, name, budget, totalCost } = req.body;

        const newProject = await Project.create({
            code,
            name,
            budget,
            totalCost
        });

        res.status(201).json({ success: true, message: "Project created successfully", data: newProject });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating project", error: error.message });
    }
};

controller.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { code, name, budget, totalCost } = req.body;

        const project = await Project.findByPk(id);

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        await project.update({
            code,
            name,
            budget,
            totalCost
        });

        res.status(200).json({ success: true, message: "Project updated successfully", data: project });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating project", error: error.message });
    }
};

controller.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findByPk(id);

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        await project.destroy();
        res.status(200).json({ success: true, message: "Project deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting project", error: error.message });
    }
};

module.exports = controller;
