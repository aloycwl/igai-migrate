"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const register_1 = __importDefault(require("./registration/register"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Endpoint to trigger the script N times
app.post('/run-register', async (req, res) => {
    console.log('POST /run-register hit');
    const count = Number(req.query.count) || 1;
    console.log(`Running register.ts ${count} times...`);
    for (let i = 0; i < count; i++) {
        try {
            console.log(`Starting run ${i + 1}`);
            await (0, register_1.default)();
            console.log(`Run ${i + 1} success`);
        }
        catch (err) {
            console.error(`Run ${i + 1} failed`, err);
        }
    }
    res.json({ status: 'ok', runs: count });
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
