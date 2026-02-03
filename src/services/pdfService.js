const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateReceiptPDF = (receiptData) => {
  return new Promise((resolve, reject) => {

    if (!receiptData || !receiptData.receipt_id) {
      return reject(new Error('Invalid receipt data'));
    }

    const doc = new PDFDocument({ margin: 50 });

    const tempDir = path.join(__dirname, '../../temp');
    const fileName = `receipt_${receiptData.receipt_id}.pdf`;
    const filePath = path.join(tempDir, fileName);

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // ✅ Create stream FIRST
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    // ---- PDF CONTENT ----
    doc.fontSize(20).text('OREVA RETAIL RECEIPT', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12)
      .text(`Receipt ID: ${receiptData.receipt_id}`)
      .text(`Order ID: ${receiptData.order_id}`)
      .text(`Date: ${receiptData.order_date_display}`); // use display date

    doc.moveDown();

    doc.text(
      `Customer: ${receiptData.customer_name} (${receiptData.customer_email})`
    );

    doc.moveDown();
    doc.text('Items:', { underline: true });

    receiptData.items.forEach(item => {
      doc.text(`${item.name} - x${item.quantity} @ $${item.unit_price}`);
    });

    doc.moveDown();

    doc.font('Helvetica-Bold')
      .text(`Total Amount Paid: $${receiptData.financials.grand_total}`);

    doc.end();

    // ✅ Wait for file to finish writing
    stream.on('finish', () => {
      console.log(`[Phase 3] PDF generated: ${filePath}`);
      resolve(filePath);
    });

    stream.on('error', (err) => {
      console.error("PDF Stream Error:", err);
      reject(err);
    });

  });
};

module.exports = { generateReceiptPDF };