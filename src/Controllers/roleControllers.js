const Role= require('../Models/Role')

const controllers = {}

controllers.list = async (req, res) => {
    const data = await Role.findAll()
    .then (function(data) {
        return data;
    })
    .catch (error => {
        return error;
    });
    res.json({success: true, data: data});
}

module.exports = controllers;