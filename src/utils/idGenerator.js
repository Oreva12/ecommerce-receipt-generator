// A simple helper to create a unique receipt number
const generateReceiptId = () => {
    return `RCPT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

module.exports = { generateReceiptId };