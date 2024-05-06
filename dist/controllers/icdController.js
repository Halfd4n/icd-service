"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEntityByDiagnosis = exports.getEnrichedIcdData = exports.getIcdBySearchText = exports.getIcdFoundationInfo = void 0;
const icdService_1 = require("../services/icdService");
const getIcdFoundationInfo = async (req, res) => {
    const { id } = req.params;
    try {
        const data = await (0, icdService_1.fetchIcdFoundationData)(id);
        res.status(200).send(data);
    }
    catch (err) {
        console.error('Error fetching ICD data: ', err);
        res.status(500).send(`Server error: ${err}`);
    }
};
exports.getIcdFoundationInfo = getIcdFoundationInfo;
const getIcdBySearchText = async (req, res) => {
    const { searchQuery } = req.params;
    try {
        const data = await (0, icdService_1.fetchIcdMMSDataBySearchText)(searchQuery);
        res.status(200).send(data);
    }
    catch (err) {
        console.error('Error fetching ICD data: ', err);
        res.status(500).send(`Server error: ${err}`);
    }
};
exports.getIcdBySearchText = getIcdBySearchText;
const getEnrichedIcdData = async (req, res) => {
    const { icdCodes } = req.params;
    try {
        const data = await (0, icdService_1.fetchEnrichedIcdData)(icdCodes);
        res.status(200).send(data);
    }
    catch (err) {
        console.error('Error fetching ICD data: ', err);
        res.status(500).send(`Server error: ${err}`);
    }
};
exports.getEnrichedIcdData = getEnrichedIcdData;
const getEntityByDiagnosis = async (req, res) => {
    const { searchText } = req.query;
    if (searchText)
        try {
            const data = await (0, icdService_1.fetchEntityByDiagnosis)(searchText.toString());
            res.status(200).send(data);
        }
        catch (err) {
            console.error('Error fetching ICD data: ', err);
            res.status(500).send(`Server error: ${err}`);
        }
};
exports.getEntityByDiagnosis = getEntityByDiagnosis;
