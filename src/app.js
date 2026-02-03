const express = require('express');
const orderRoutes = require('./routes/orderRoutes');
const app = express();

app.use(express.json());

// Use the routes
app.use('/api', orderRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Phase 1 Trigger: POST http://localhost:${PORT}/api/webhook/payment-success`);
});