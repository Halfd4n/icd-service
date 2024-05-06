"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 3000;
const TOKEN_ENDPOINT = 'https://icdaccessmanagement.who.int/connect/token';
const CLIENT_ID = 'c5f5f265-6db6-42a5-b187-59ccdfaa5d34_129d1b09-6328-404c-a924-766ed36ff602';
const CLIENT_SECRET = '0U8mk7LrgNwLEB7iEYo2jdhHG5h0mWqIG/bH46nKyMk=';
app.get('/', (req, res) => { });
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
