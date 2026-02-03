const { generateReceiptId } = require('../utils/idGenerator');
const { generateReceiptPDF } = require('../services/pdfService');
const { sendReceiptEmail } = require('../services/emailService');
const { uploadToCloud } = require('../services/cloudService');
const fs = require('fs');

const handlePaymentSuccess = async (req, res) => {
    const rawOrder = req.body;

    if (!rawOrder.order_id || !rawOrder.customer?.email) {
        return res.status(400).json({ message: "Invalid order data" });
    }

    const now = new Date();

    const receiptData = {
        receipt_id: generateReceiptId(),
        order_id: rawOrder.order_id,
        customer_name: rawOrder.customer.name,
        customer_email: rawOrder.customer.email,
        items: rawOrder.items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            unit_price: item.price
        })),
        financials: {
            grand_total: rawOrder.totals.grand_total
        },
        order_date_iso: now.toISOString(),
        order_date_display: now.toLocaleString('en-GB', {
            timeZone: 'Africa/Lagos',
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        })
    };

    res.status(200).json({
        message: "Payment successful. Your receipt is being processed.",
        receipt_id: receiptData.receipt_id
    });

    // 4. Background Processing (Reliability)
    try {
        // Step A: Generate PDF
        const filePath = await generateReceiptPDF(receiptData);
        
        // Step B: Upload to Cloudinary
        const cloudUrl = await uploadToCloud(filePath, receiptData.receipt_id);

        // Step C: Send Email with Attachment and Link
        await sendReceiptEmail(receiptData.customer_email, receiptData.receipt_id, filePath, cloudUrl);
        
        // Step D: Cleanup (Delete local file)
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`[System] Local file cleaned up: ${receiptData.receipt_id}.pdf`);
        }
        
        console.log(`[System] Finished! View at: ${cloudUrl}`);
    } catch (error) {
        console.error("[System] Background Error:", error.message);
    }
};

module.exports = { handlePaymentSuccess };