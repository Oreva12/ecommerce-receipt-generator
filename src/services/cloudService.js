const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloud = async (filePath, receiptId) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            public_id: receiptId,
            folder: 'receipts',
            resource_type: 'raw' // Important for PDF files
        });

        console.log(`[Phase 5] Cloud upload successful: ${result.secure_url}`);
        return result.secure_url; // This is the link we will save
    } catch (error) {
        console.error("[Phase 5] Cloudinary Upload Error:", error.message);
        throw error;
    }
};

module.exports = { uploadToCloud };