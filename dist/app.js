"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const icdRoutes_1 = __importDefault(require("./routes/icdRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const allowedOrigins = (_a = process.env.ALLOWED_ORIGINS) === null || _a === void 0 ? void 0 : _a.split(',');
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || (allowedOrigins === null || allowedOrigins === void 0 ? void 0 : allowedOrigins.includes(origin))) {
            callback(null, true);
        }
        else {
            callback(new Error('CORS: Non-allowed origin'));
        }
    },
    credentials: true,
}));
app.use(express_1.default.json());
app.use('api/icd', (req, res, next) => {
    var _a;
    const authToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!authToken) {
        return res.status(401).json({ error: 'Authentication required ' });
    }
    next();
});
app.use('/api/icd', icdRoutes_1.default);
exports.default = app;
