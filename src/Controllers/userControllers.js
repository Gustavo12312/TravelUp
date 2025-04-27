const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const sequelize = require('../models/db'); 
const config = require('../config');
const Role= require('../models/Role')

const controllers = {}
sequelize.sync()

controllers.list = async (req, res) => {
    const data = await User.findAll({
        include: [
            Role
        ]
    })
    .then (function(data) {
        return data;
    })
    .catch (error => {
        return error;
    });
    res.json({success: true, data: data});
}

controllers.get = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({
            where: { id }
        });

        if (!user) {
            return res.status(204).json({ success: true, message: "User not found" });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching user", error: error.message });
    }
};

controllers.register = async (req, res) => { 
    const { name, email, password, roleId } = req.body;
    
    if (!roleId) {
        return res.status(400).json({ success: false, message: "Role ID is required" });
    }

    const data = await User.create({
        name: name,
        email: email,
        password: password,
        roleId: roleId
    })
    .then(function (data) {
        return data;
    })
    .catch (error =>{
        console.log("Erro: "+error);
        return error;
    })
    let token = jwt.sign ({email: data.email}, config.jwtSecret, {expiresIn: '1h'});
    res.status (200).json({
        success: true,
        message: "Registed",
        token: token,
        data: data
    });
}

controllers.login = async (req, res) => {
    if (req.body. email && req.body.password) {
        var email = req.body.email;
        var password= req.body.password;
    }
    var user = await User.findOne({where: { email: email}})
    .then(function (data) {
        return data;
    })
    .catch (error =>{
        console.log("Erro: "+error);
        return error;
    })
    if (password === null || typeof password === "undefined") {
        res.status (403).json({
            success: false,
            message: 'Whitespaces'
    });
    } else {
        if (req.body.email && req.body.password && user) {
            const isMatch = bcrypt.compareSync (password, user.password); 
            if (req.body.email === user.email && isMatch) {
                let token = jwt.sign ({email: req.body.email}, config.jwtSecret, {expiresIn: '1h'});
                res.status (200).json({
                    success: true,
                    message: 'Autentication done with success!',
                    token: token,
                    data: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        roleId: user.roleId,
                    }
                });
            }else {
                res.status (403).json({success: false, message: 'Autenticantion data invalid.'});
            }
        } else {
            res.status (400).json({success: false, message: 'Error in autentication procedure. Try again later.'});
        }
    }
} 


module.exports = controllers;