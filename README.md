# 🚀 Automated E-commerce Receipt Engine

A robust Node.js backend microservice designed to automate the post-purchase workflow. This system captures payment notifications, generates professional PDF receipts, stores them in the cloud, and delivers them via email—all while maintaining a high-performance, non-blocking user experience.


## 🌟 Key Features

* **Asynchronous Background Tasks:** Uses `async/await` patterns to respond to the client immediately (200 OK), moving heavy PDF and Email operations to the background.
* **Dynamic PDF Generation:** Leverages `PDFKit` to draw custom, itemized receipts including branding, unique IDs, and financial breakdowns.
* **Cloud Persistence:** Integrates with the **Cloudinary API** to host receipts permanently, providing a secure URL for every transaction.
* **Automated Email Delivery:** Uses the **Resend API** to deliver receipts as PDF attachments with personalized "Thank You" messages.
* **Localized Precision:** Specifically configured for the **Africa/Lagos** timezone with human-readable date formatting.
* **Self-Cleaning Storage:** Implements automatic local file cleanup (`fs.unlink`) after successful cloud upload to maintain server health.

## 🛠️ Tech Stack

* **Runtime:** Node.js (v22+)
* **Framework:** Express.js
* **PDF Engine:** PDFKit
* **Cloud Infrastructure:** Cloudinary
* **Email Protocol:** Resend
* **Security:** Dotenv (Environment Variable Encryption)

---

## 📂 Project Structure

```text
ecommerce-receipt-generator/
├── src/
│   ├── controllers/    # Request handling & process coordination
│   ├── services/       # PDF, Email, and Cloud logic modules
│   ├── utils/          # ID generators and date formatters
│   └── app.js          # Server entry point & middleware
├── temp/               # Temporary local folder for PDF generation
├── .env                # API Keys & Secrets (Not tracked by Git)
└── README.md           # Project documentation

```

---

## 🚀 Installation & Setup

### 1. Prerequisites

* Node.js installed on your machine.
* A [Resend](https://resend.com) account (for emails).
* A [Cloudinary](https://cloudinary.com) account (for storage).

### 2. Clone and Install

```bash
git clone [https://github.com/your-username/ecommerce-receipt-generator.git](https://github.com/your-username/ecommerce-receipt-generator.git)
cd ecommerce-receipt-generator
npm install

```

### 3. Environment Configuration

Create a `.env` file in the root directory and add your credentials:

```env
# Server Config
PORT=3000

# Email Service (Resend)
RESEND_API_KEY=re_your_api_key

# Cloud Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

```

### 4. Run the Application

```bash
# Start the server
node src/app.js

```

---

## 🧪 Testing the Workflow

Use **Thunder Client** or **Postman** to send a `POST` request to:
`http://localhost:3000/api/webhook/payment-success`

**Example Payload:**

```json
{
  "order_id": "ORD-998877",
  "customer": {
    "name": "John Doe",
    "email": "your-verified-email@example.com"
  },
  "items": [
    { "name": "Wireless Headphones", "quantity": 1, "price": 150 },
    { "name": "USB-C Cable", "quantity": 2, "price": 25 },
    { "name": "Laptop Charger", "quantity": 1, "price": 73.00 },
    { "name": "Laptop Wrapper", "quantity": 1, "price": 20.00 }
  ],
  "totals": {
    "grand_total": 200
  },
  "payment_details": {
    "method": "Credit Card"
  }
}

```

## 📈 System Flow

1. **Webhook Trigger:** Express captures the payment data.
2. **Immediate Response:** Client receives a `200 OK` and a `receipt_id`.
3. **PDF Generation:** `pdfService` creates a local file in `/temp`.
4. **Cloud Upload:** `cloudService` pushes the file to Cloudinary.
5. **Email Delivery:** `emailService` sends the attachment and the cloud link.
6. **Maintenance:** The local temp file is deleted to save disk space.
