// file location: src/controllers/imageToText.ts

import { Request, Response } from "express";
import { createWorker } from "tesseract.js";

// Controller function for OCR
const imageToText = async (req: Request, res: Response): Promise<void> => {
    try {
        const filePath = req.file?.path;

        if (!filePath) {
            res.status(400).json({ error: "No file uploaded" });
            return;
        }

        // Initialize Tesseract worker
        const worker = await createWorker();

        await worker.load();
        await worker.reinitialize("eng");

        // Perform OCR on the uploaded image
        const { data: { text } } = await worker.recognize(filePath);

        await worker.terminate(); // Clean up worker

        res.status(200).json({
            success: true,
            text,
            originalFile: req.file?.originalname
        });
    } catch (error) {
        console.error("OCR error:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Failed to process image"
        });
    }
};

interface Base64Request extends Request {
    body: {
        base64Image: string;
    };
}

const base64ToText = async (req: Base64Request, res: Response): Promise<void> => {
    try {
        const { base64Image } = req.body;

        if (!base64Image) {
            res.status(400).json({ error: "No base64 image provided" });
            return;
        }

        // Remove data URI prefix if present (e.g., "data:image/jpeg;base64,")
        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

        // Initialize Tesseract worker
        const worker = await createWorker();

        await worker.load("eng");
        await worker.reinitialize("eng");

        // Perform OCR directly on the base64 image
        const { data: { text } } = await worker.recognize(Buffer.from(base64Data, 'base64'));

        await worker.terminate(); // Clean up worker

        res.status(200).json({
            success: true,
            text
        });
    } catch (error) {
        console.error("OCR error:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Failed to process base64 image"
        });
    }
};

export { imageToText, base64ToText };