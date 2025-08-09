
import express from 'express';
import multer from 'multer';
import crypto from 'crypto';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { create } from 'ipfs-http-client';
const ipfs = create({ url: 'http://127.0.0.1:5001' });

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (_, __, cb) => cb(null, uploadDir),
    filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

app.post('/upload-certificate', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const filePath = req.file.path;
        const fileBuffer = fs.readFileSync(filePath);
        const { cid } = await ipfs.add(fileBuffer);
        const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

        res.json({
            fileUrl: `http://localhost:${PORT}/certificates/${req.file.filename}`,
            fileHash,
            ipfsHash: cid.toString()
        });

    } catch (error) {
        res.status(500).json({ error: error.message || 'Failed to upload file' });
    }
});

app.use('/certificates', express.static(uploadDir));

app.listen(PORT, () => {
    console.log(` Certificate backend running at http://localhost:${PORT}`);
});
