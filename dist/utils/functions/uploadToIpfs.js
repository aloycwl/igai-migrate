"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadJSONToIPFS = uploadJSONToIPFS;
exports.uploadTextToIPFS = uploadTextToIPFS;
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
async function uploadJSONToIPFS(jsonMetadata) {
    const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
    const options = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.PINATA_JWT}`,
            'Content-Type': 'application/json',
        },
        data: {
            pinataOptions: { cidVersion: 0 },
            pinataMetadata: { name: 'ip-metadata.json' },
            pinataContent: jsonMetadata,
        },
    };
    try {
        const response = await (0, axios_1.default)(url, options);
        return response.data.IpfsHash;
    }
    catch (error) {
        console.error('Error uploading JSON to IPFS:', error);
        throw error;
    }
}
async function uploadTextToIPFS(text) {
    const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
    const data = new form_data_1.default();
    const buffer = Buffer.from(text, 'utf-8');
    data.append('file', buffer, { filename: 'dispute-evidence.txt', contentType: 'text/plain' });
    const options = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.PINATA_JWT}`,
            ...data.getHeaders(),
        },
        data: data,
    };
    try {
        const response = await (0, axios_1.default)(url, options);
        return response.data.IpfsHash;
    }
    catch (error) {
        console.error('Error uploading text to IPFS:', error);
        throw error;
    }
}
