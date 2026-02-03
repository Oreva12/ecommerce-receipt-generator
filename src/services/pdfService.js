const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateReceiptPDF = (receiptData) => {
  return new Promise((resolve, reject) => {
    if (!receiptData || !receiptData.receipt_id) {
      return reject(new Error('Invalid receipt data'));
    }

    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const tempDir = path.join(__dirname, '../../temp');
    const fileName = `receipt_${receiptData.receipt_id}.pdf`;
    const filePath = path.join(tempDir, fileName);

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // ---- DESIGN COLORS ----
    const primaryColor = '#2c3e50';
    const accentColor = '#3498db';
    const lightGray = '#f2f2f2';

    // ---- HEADER SECTION ----
    doc.rect(0, 0, 612, 100).fill(primaryColor); 
    
    doc.fillColor('#ffffff')
       .fontSize(24)
       .font('Helvetica-Bold')
       .text('OREVA ENTERPRISES', 50, 40);

    doc.fontSize(10)
       .font('Helvetica')
       .text('Official Transaction Receipt', 50, 70);

    doc.fontSize(9)
   .text(`Receipt ID:`, 350, 40, { width: 200, align: 'right' })
   .font('Helvetica-Bold').text(receiptData.receipt_id, 350, 52, { width: 200, align: 'right' })
   
   .moveDown(0.5)
   
   .font('Helvetica').text(`Date:`, 350, 70, { width: 200, align: 'right' })
   .font('Helvetica-Bold').text(receiptData.order_date_display, 350, 82, { width: 200, align: 'right' });

    doc.moveDown(4);
    doc.fillColor('#333333');

    // ---- CUSTOMER & ORDER INFO ----
    doc.fontSize(12).font('Helvetica-Bold').text('BILL TO:', 50, 130);
    doc.font('Helvetica').fontSize(11)
       .text(receiptData.customer_name, 50, 145)
       .text(receiptData.customer_email, 50, 160);

    doc.font('Helvetica-Bold').text('ORDER INFO:', 350, 130);
    doc.font('Helvetica')
       .text(`Order ID: #${receiptData.order_id}`, 350, 145)
       .text(`Status: Paid / Completed`, 350, 160);

    // ---- ITEM TABLE HEADER ----
    const tableTop = 210;
    doc.rect(50, tableTop, 500, 20).fill(accentColor);
    
    doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(10);
    doc.text('ITEM DESCRIPTION', 60, tableTop + 5);
    doc.text('QTY', 300, tableTop + 5);
    doc.text('UNIT PRICE', 380, tableTop + 5);
    doc.text('TOTAL', 480, tableTop + 5);

    // ---- ITEM TABLE ROWS ----
    let currentY = tableTop + 25;
    doc.fillColor('#333333').font('Helvetica');

    receiptData.items.forEach((item, index) => {
      // Alternating row background
      if (index % 2 === 0) {
        doc.rect(50, currentY - 5, 500, 20).fill(lightGray).stroke();
      }

      const total = (item.quantity * item.unit_price).toFixed(2);
      
      doc.fillColor('#333333')
         .text(item.name, 60, currentY)
         .text(item.quantity.toString(), 300, currentY)
         .text(`$${item.unit_price.toFixed(2)}`, 380, currentY)
         .text(`$${total}`, 480, currentY);

      currentY += 20;
    });

    // ---- SUMMARY SECTION ----
    doc.moveTo(330, currentY + 10).lineTo(550, currentY + 10).stroke();
    currentY += 25;

    doc.fontSize(10).font('Helvetica');
    
    doc.text('Subtotal:', 330, currentY);
    doc.text(`$${receiptData.financials.subtotal.toFixed(2)}`, 480, currentY);
    
    currentY += 15;
    doc.text('Tax (VAT):', 330, currentY);
    doc.text(`$${receiptData.financials.tax.toFixed(2)}`, 480, currentY);

    currentY += 25;
    doc.fontSize(14).font('Helvetica-Bold');
    doc.text('GRAND TOTAL:', 330, currentY);
    doc.fillColor(accentColor).text(`$${receiptData.financials.grand_total.toFixed(2)}`, 480, currentY);

    // ---- FOOTER ----
    const footerTop = 750;
    doc.fontSize(10).fillColor('#999999').font('Helvetica');
    doc.text('Thank you for shopping with Oreva Retail!', 0, footerTop, { align: 'center' });
    doc.text('This is a computer-generated receipt. No signature required.', 0, footerTop + 15, { align: 'center' });

    doc.end();

    stream.on('finish', () => {
      console.log(`[Phase 3] Stylish PDF generated: ${filePath}`);
      resolve(filePath);
    });

    stream.on('error', (err) => {
      console.error("PDF Stream Error:", err);
      reject(err);
    });
  });
};

module.exports = { generateReceiptPDF };