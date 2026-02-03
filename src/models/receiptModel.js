// src/models/receiptModel.js

const ReceiptSchema = {
    receipt_id: String, // Unique ID for this receipt
    order_id: String,   // Reference to the original order
    customer: {
        name: String,
        email: String
    },
    items: [
        {
            name: String,
            quantity: Number,
            unit_price: Number,
            total_price: Number
        }
    ],
    financials: {
        subtotal: Number,
        tax: Number,
        discount: Number,
        grand_total: Number
    },
    payment_method: String,
    created_at: Date
};

module.exports = ReceiptSchema;