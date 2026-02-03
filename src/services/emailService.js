const { Resend } = require('resend');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../../.env') }); 

const resend = new Resend(process.env.RESEND_API_KEY);

const sendReceiptEmail = async (customerEmail, receiptId, filePath) => {
    try {
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found at ${filePath}`);
        }

        const pdfBuffer = fs.readFileSync(filePath);

        await resend.emails.send({
            from: 'Receipts <onboarding@resend.dev>', 
            to: customerEmail,
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
        console.error("[Phase 4] Email Service Error:", error.message);
    }
};

module.exports = { sendReceiptEmail };