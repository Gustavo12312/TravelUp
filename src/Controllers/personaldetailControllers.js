const PersonalDetail = require('../models/PersonalDetail');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

const controller = {};

controller.list = async (req, res) => {
    try {
        const personalDetails = await PersonalDetail.findAll({
            include: [User]
        });
        res.status(200).json({ success: true, data: personalDetails });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching personal details", error: error.message });
    }
};

controller.get = async (req, res) => {
    try {
        const { userId } = req.params;
        const personalDetail = await PersonalDetail.findOne({
            where: { userId },
            include: [User]
        });

        if (!personalDetail) {
            return res.status(404).json({ success: false, message: "Personal detail not found" });
        }
        res.status(200).json({ success: true, data: personalDetail });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching personal detail", error: error.message });
    }
};

controller.create = async (req, res) => {
    try {
        const {
            userId,
            fullname,
            birthdate,
            passportnumber,
            emergencycontact,
            milescard
        } = req.body;
        const photo = req.file ? '/uploads/'+req.file.filename : null; 

        const newPersonalDetail = await PersonalDetail.create({
            userId,
            fullname,
            birthdate,
            passportnumber,
            emergencycontact,
            photo,
            milescard
        });

        res.status(201).json({ success: true, message: "Personal detail created successfully", data: newPersonalDetail });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating personal detail", error: error.message });
    }
};

controller.update = async (req, res) => {
    try {
        const { id } = req.params;
        let {
            fullname,
            birthdate,
            phone,
            passportnumber,
            emergencycontact,
            milescard
        } = req.body;

        console.log(req.body);
        
        
        // Sanitize the input to make sure 'null' string is converted to actual null
        const convertnull = (value) => {
            return value === 'null' || value === '' ? null : value;
        };

        // Apply sanitization to each field
        fullname = convertnull(fullname);
        birthdate = convertnull(birthdate);
        phone = convertnull(phone);
        passportnumber = convertnull(passportnumber);
        emergencycontact = convertnull(emergencycontact);
        milescard = convertnull(milescard);        

        const personalDetail = await PersonalDetail.findOne({where: {userId: id}});
       
        if (!personalDetail) {
            return res.status(404).json({ success: false, message: "Personal detail not found" });
        }

        let updatedPhoto = personalDetail.photo;
        // If a new file is uploaded, update the photo and delete the old one
        if (req.file) {
            if (personalDetail.photo) {
                const oldPhotoPath = path.join(__dirname, "..", personalDetail.photo);
                if (fs.existsSync(oldPhotoPath)) {
                    fs.unlinkSync(oldPhotoPath);
                }
            }
            updatedPhoto = "/uploads/" + req.file.filename;
        }     
        
        await personalDetail.update({
            fullname,
            birthdate,
            phone,
            passportnumber,
            emergencycontact,
            photo: updatedPhoto,
            milescard
        });

        res.status(200).json({ success: true, message: "Personal detail updated successfully", data: personalDetail });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating personal detail", error: error.message });
    }
};

controller.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const personalDetail = await PersonalDetail.findByPk(id);

        if (!personalDetail) {
            return res.status(404).json({ success: false, message: "Personal detail not found" });
        }

        await personalDetail.destroy();
        res.status(200).json({ success: true, message: "Personal detail deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting personal detail", error: error.message });
    }
};

module.exports = controller;
