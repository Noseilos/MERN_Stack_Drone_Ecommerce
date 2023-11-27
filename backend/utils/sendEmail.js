import nodemailer from 'nodemailer'
import PDFDocument from 'pdfkit';

const sendEmail = async options => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    const message = {
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        html: `<p>${options.message}</p>`
    }

    await transporter.sendMail(message)
}

const sendEmailWithReceipt = async (options, order) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    // Create the PDF document
    let doc = new PDFDocument;

    doc.text('Order Receipt', 100, 100);
    doc.text(`Order ID: ${order._id}`, 100, 120);
    doc.text(`Order Status: ${order.isPaid ? 'Paid' : 'Not Paid'}`, 100, 140);
    doc.text(`Order Items: ${order.orderItems.map(item => `${item.name} (Qty: ${item.qty})`).join(', ')}`, 100, 160);
    doc.text(`Total Price: ${order.totalPrice}`, 100, 180);
    // Add more content to the PDF as needed

    // Collect the PDF data
    let chunks = [];
    let result;

    doc.on('data', chunk => {
        chunks.push(chunk);
    });

    doc.on('end', () => {
        result = Buffer.concat(chunks);
    });

    doc.end();

    // Wait for the PDF to be created
    await new Promise(resolve => doc.once('end', resolve));

    const message = {
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        html: `<p>${options.message}</p>`,
        attachments: [{
            filename: 'receipt.pdf',
            content: result
        }]
    }

    await transporter.sendMail(message)
}

export default sendEmailWithReceipt;

// export default sendEmail;