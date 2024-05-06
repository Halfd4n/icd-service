"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEntityByDiagnosis = exports.getEnrichedIcdData = exports.getIcdBySearchText = exports.getIcdFoundationInfo = void 0;
const icdService_1 = require("../services/icdService");
const getIcdFoundationInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const authToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    try {
        const data = yield (0, icdService_1.fetchIcdFoundationData)(id, authToken);
        res.status(200).send(data);
    }
    catch (err) {
        console.error('Error fetching ICD data: ', err);
        res.status(500).send(`Server error: ${err}`);
    }
});
exports.getIcdFoundationInfo = getIcdFoundationInfo;
const getIcdBySearchText = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { searchQuery } = req.params;
    const authToken = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1];
    try {
        const data = yield (0, icdService_1.fetchIcdMMSDataBySearchText)(searchQuery, authToken);
        res.status(200).send(data);
    }
    catch (err) {
        console.error('Error fetching ICD data: ', err);
        res.status(500).send(`Server error: ${err}`);
    }
});
exports.getIcdBySearchText = getIcdBySearchText;
const getEnrichedIcdData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const { icdCodes } = req.params;
    const authToken = (_c = req.headers.authorization) === null || _c === void 0 ? void 0 : _c.split(' ')[1];
    try {
        const data = yield (0, icdService_1.fetchEnrichedIcdData)(icdCodes, authToken);
        res.status(200).send(data);
    }
    catch (err) {
        console.error('Error fetching ICD data: ', err);
        res.status(500).send(`Server error: ${err}`);
    }
});
exports.getEnrichedIcdData = getEnrichedIcdData;
const getEntityByDiagnosis = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const { searchText } = req.query;
    const authToken = (_d = req.headers.authorization) === null || _d === void 0 ? void 0 : _d.split(' ')[1];
    if (searchText)
        try {
            const data = yield (0, icdService_1.fetchEntityByDiagnosis)(searchText.toString(), authToken);
            res.status(200).send(data);
        }
        catch (err) {
            console.error('Error fetching ICD data: ', err);
            res.status(500).send(`Server error: ${err}`);
        }
});
exports.getEntityByDiagnosis = getEntityByDiagnosis;
