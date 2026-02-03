const { Resend } = require('resend');
const fs = require('fs');
const path = require('path');

// 1. Initialize dotenv at the very top of this file or in app.js
require('dotenv').config({ path: path.join(__dirname, '../../.env') }); 

// 2. Now initialize Resend using the variable
const resend = new Resend(process.env.RESEND_API_KEY);

const sendReceiptEmail = async (customerEmail, receiptId, filePath) => {
    try {
        // Double-check if file exists before trying to read it
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found at ${filePath}`);
        }

        const pdfBuffer = fs.readFileSync(filePath);

        await resend.emails.send({
            from: 'Receipts <onboarding@resend.dev>', 
            to: customerEmail, // MUST be your Resend login email for testing
            subject: `Your Receipt for Order ${receiptId}`,
            html: `
                <h1>Order Confirmed!</h1>
                <p>Hello,</p>
                <p>Thank you for your purchase. We have attached your receipt <b>${receiptId}</b> to this email for your records.</p>
                <br>
                <p>Best Regards,<br>E-Commerce Store Team</p>
            `,
            attachments: [
                {
                    filename: `Receipt_${receiptId}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                },
            ],
        });

        console.log(`[Phase 4] Email sent successfully to ${customerEmail}`);
    } catch (error) {
        // Non-functional Requirement: Failed emails must be logged
        console.error("[Phase 4] Email Service Error:", error.message);
    }
};

module.exports = { sendReceiptEmail };