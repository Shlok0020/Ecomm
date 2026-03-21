// backend/utils/notificationService.js
const nodemailer = require('nodemailer');

// Only try to load twilio if credentials are provided
let twilio = null;
try {
  // Only require twilio if credentials exist and are valid
  if (process.env.TWILIO_ACCOUNT_SID && 
      process.env.TWILIO_AUTH_TOKEN && 
      process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
    twilio = require('twilio');
    console.log('✅ Twilio module loaded');
  } else {
    console.log('⚠️ Twilio credentials not valid, WhatsApp disabled');
  }
} catch (error) {
  console.log('⚠️ Twilio module not available, WhatsApp disabled');
}

// Email configuration
const createTransporter = () => {
  // Log the email user being used
  console.log('📧 Configuring email with user:', process.env.EMAIL_USER);
  
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // This MUST be your Gmail address
      pass: process.env.EMAIL_PASS   // This MUST be your Gmail App Password
    },
    // Add this to help with Gmail
    tls: {
      rejectUnauthorized: false
    }
  });
};

// WhatsApp configuration (using Twilio) - only if twilio is available
let twilioClient = null;
if (twilio && process.env.TWILIO_ACCOUNT_SID && 
    process.env.TWILIO_AUTH_TOKEN && 
    process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
  try {
    twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    console.log('✅ Twilio client initialized successfully');
  } catch (error) {
    console.error('❌ Twilio initialization failed:', error.message);
    twilioClient = null;
  }
} else {
  console.log('📱 WhatsApp notifications are disabled (Twilio not configured)');
}

// Admin contact details
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'newpremglasshouse75@gmail.com';
const ADMIN_WHATSAPP = process.env.ADMIN_WHATSAPP_NUMBER || 'whatsapp:+917328019093';

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(amount || 0);
};

// Format date
const formatDate = (date) => {
  return new Date(date).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'short'
  });
};

/**
 * Send Email Notification
 */
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createTransporter();
    
    // IMPORTANT: The from field MUST use the same email as auth.user
    const mailOptions = {
      from: `"New Prem Glass House" <${process.env.EMAIL_USER}>`, // This should be your Gmail
      to,
      subject,
      html,
      text
    };

    console.log(`📧 Sending email from: ${mailOptions.from} to: ${to}`);
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${to}:`, info.messageId);
    console.log(`📨 Email sent from: ${info.envelope.from}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send WhatsApp Notification via Twilio
 */
const sendWhatsApp = async ({ to, body }) => {
  // Skip if Twilio is not configured
  if (!twilioClient) {
    console.log('📱 WhatsApp notification skipped - Twilio not configured');
    return { success: false, skipped: true, message: 'Twilio not configured' };
  }

  try {
    // Ensure phone number is in correct format
    let formattedNumber = to;
    if (!formattedNumber.includes('whatsapp:')) {
      // Remove any non-digit characters except +
      const digits = formattedNumber.replace(/[^\d+]/g, '');
      formattedNumber = `whatsapp:${digits}`;
    }

    const message = await twilioClient.messages.create({
      body: body,
      from: process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886',
      to: formattedNumber
    });

    console.log(`✅ WhatsApp sent to ${to}:`, message.sid);
    return { success: true, messageId: message.sid };
  } catch (error) {
    console.error('❌ WhatsApp sending failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send New Registration Notification to Admin
 */
const sendNewRegistrationNotification = async (userData) => {
  const { name, email, phone, role, createdAt } = userData;
  
  // Email HTML template
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #c9a96e, #a07840); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
        .detail-label { font-weight: bold; width: 120px; color: #c9a96e; }
        .badge { background: ${role === 'admin' ? '#ef4444' : '#10b981'}; color: white; padding: 3px 10px; border-radius: 20px; font-size: 12px; display: inline-block; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        .button { background: #c9a96e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🆕 New User Registration</h1>
        </div>
        <div class="content">
          <p>A new user has registered on <strong>New Prem Glass House</strong>.</p>
          
          <div class="details">
            <h3>User Details:</h3>
            <div class="detail-row">
              <span class="detail-label">Name:</span>
              <span>${name}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Email:</span>
              <span>${email}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Phone:</span>
              <span>${phone}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Role:</span>
              <span><span class="badge">${role}</span></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Registered:</span>
              <span>${formatDate(createdAt)}</span>
            </div>
          </div>
          
          <div style="text-align: center;">
            <a href="${process.env.CLIENT_URL || 'https://newpremglasshouse.in'}/admin/users" class="button">
              View in Admin Panel
            </a>
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} New Prem Glass House. All rights reserved.</p>
          <p>Bombay Chowk, Jharsuguda | +91 7328019093</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // WhatsApp message template
  const whatsappBody = `
🆕 *New User Registration - New Prem Glass House*

📋 *User Details:*
• Name: ${name}
• Email: ${email}
• Phone: ${phone}
• Role: ${role}
• Registered: ${formatDate(createdAt)}

View in Admin Panel: ${process.env.CLIENT_URL || 'https://newpremglasshouse.in'}/admin/users
  `.trim();

  // Send to admin
  const emailResult = await sendEmail({
    to: ADMIN_EMAIL,
    subject: '🆕 New User Registration - New Prem Glass House',
    html: emailHtml,
    text: whatsappBody.replace(/\*/g, '')
  });

  // Only send WhatsApp if it's configured
  let whatsappResult = { success: false, skipped: true };
  if (twilioClient) {
    whatsappResult = await sendWhatsApp({
      to: ADMIN_WHATSAPP,
      body: whatsappBody
    });
  } else {
    console.log('📱 WhatsApp notification skipped for new registration');
  }

  return { email: emailResult, whatsapp: whatsappResult };
};

/**
 * Send New Order Notification to Admin
 */
const sendNewOrderNotification = async (orderData) => {
  const { orderId, customerName, customerEmail, customerPhone, items, totalAmount, date, status } = orderData;

  // Generate items list for email
  const itemsList = items.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.price)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.price * item.quantity)}</td>
    </tr>
  `).join('');

  // Email HTML template
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #c9a96e, #a07840); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
        .detail-label { font-weight: bold; width: 120px; color: #c9a96e; }
        .status-badge { background: #f59e0b; color: white; padding: 3px 10px; border-radius: 20px; font-size: 12px; display: inline-block; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background: #c9a96e; color: white; padding: 10px; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #ddd; }
        .total-row { font-weight: bold; background: #f0f0f0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        .button { background: #c9a96e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🛒 New Order Received</h1>
          <p style="font-size: 18px;">Order #${orderId}</p>
        </div>
        <div class="content">
          <p>A new order has been placed on <strong>New Prem Glass House</strong>.</p>
          
          <div class="order-details">
            <h3>Customer Information:</h3>
            <div class="detail-row">
              <span class="detail-label">Name:</span>
              <span>${customerName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Email:</span>
              <span>${customerEmail}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Phone:</span>
              <span>${customerPhone}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Order Date:</span>
              <span>${date}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Status:</span>
              <span><span class="status-badge">${status}</span></span>
            </div>
          </div>

          <h3>Order Items:</h3>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
            <tfoot>
              <tr class="total-row">
                <td colspan="3" style="text-align: right; padding: 10px;"><strong>Total Amount:</strong></td>
                <td style="text-align: right; padding: 10px;"><strong>${formatCurrency(totalAmount)}</strong></td>
              </tr>
            </tfoot>
          </table>

          <div style="text-align: center;">
            <a href="${process.env.ADMIN_URL || 'https://admin.newpremglasshouse.in'}/orders/${orderId}" class="button">
              View Order Details
            </a>
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} New Prem Glass House. All rights reserved.</p>
          <p>Bombay Chowk, Jharsuguda | +91 7328019093</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // WhatsApp message template
  const itemsSummary = items.map(item => 
    `  • ${item.name} x${item.quantity} - ${formatCurrency(item.price * item.quantity)}`
  ).join('\n');

  const whatsappBody = `
🛒 *NEW ORDER RECEIVED - New Prem Glass House*
━━━━━━━━━━━━━━━━━━━━━

📋 *Order #${orderId}*

👤 *Customer Details:*
• Name: ${customerName}
• Email: ${customerEmail}
• Phone: ${customerPhone}
• Date: ${date}

📦 *Order Items:*
${itemsSummary}

💰 *Total Amount: ${formatCurrency(totalAmount)}*
📊 *Status: ${status}*

━━━━━━━━━━━━━━━━━━━━━
View in Admin Panel: ${process.env.ADMIN_URL || 'https://newpremglasshouse.in'}/orders/${orderId}
  `.trim();

  // Send to admin
  const emailResult = await sendEmail({
    to: ADMIN_EMAIL,
    subject: `🛒 New Order #${orderId} - New Prem Glass House`,
    html: emailHtml,
    text: whatsappBody.replace(/\*/g, '')
  });

  // Only send WhatsApp if it's configured
  let whatsappResult = { success: false, skipped: true };
  if (twilioClient) {
    whatsappResult = await sendWhatsApp({
      to: ADMIN_WHATSAPP,
      body: whatsappBody
    });
  } else {
    console.log('📱 WhatsApp notification skipped for new order');
  }

  return { email: emailResult, whatsapp: whatsappResult };
};

/**
 * Send Order Status Update Notification to Customer
 */
const sendOrderStatusNotification = async (orderData) => {
  const { orderId, customerName, customerEmail, customerPhone, status, items, totalAmount } = orderData;

  const statusColors = {
    pending: '#f59e0b',
    processing: '#3b82f6',
    shipped: '#8b5cf6',
    delivered: '#10b981',
    cancelled: '#ef4444'
  };

  const statusEmojis = {
    pending: '⏳',
    processing: '🔄',
    shipped: '🚚',
    delivered: '✅',
    cancelled: '❌'
  };

  // Email HTML template for customer
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #c9a96e, #a07840); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .status-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
        .status-badge { background: ${statusColors[status] || '#6b7280'}; color: white; padding: 8px 20px; border-radius: 30px; font-size: 18px; display: inline-block; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        .button { background: #c9a96e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${statusEmojis[status]} Order Status Update</h1>
        </div>
        <div class="content">
          <p>Dear <strong>${customerName}</strong>,</p>
          <p>Your order status has been updated.</p>
          
          <div class="status-box">
            <h3>Order #${orderId}</h3>
            <div class="status-badge">${status.toUpperCase()}</div>
            <p style="margin-top: 20px;">Total Amount: <strong>${formatCurrency(totalAmount)}</strong></p>
          </div>

          <div style="text-align: center;">
            <p>Track your order status in real-time:</p>
            <a href="${process.env.CLIENT_URL || 'https://newpremglasshouse.in'}/my-orders/${orderId}" class="button">
              Track Order
            </a>
          </div>

          <p style="margin-top: 30px;">Thank you for shopping with New Prem Glass House!</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} New Prem Glass House. All rights reserved.</p>
          <p>Bombay Chowk, Jharsuguda | +91 7328019093</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // WhatsApp message template for customer
  const whatsappBody = `
${statusEmojis[status]} *ORDER STATUS UPDATE - New Prem Glass House*

Dear *${customerName}*,

Your order *#${orderId}* status has been updated to:

*${status.toUpperCase()}*

💰 *Total Amount:* ${formatCurrency(totalAmount)}
📅 *Update Time:* ${formatDate(new Date())}

Track your order: ${process.env.CLIENT_URL || 'https://newpremglasshouse.in'}/my-orders/${orderId}

Thank you for choosing New Prem Glass House!
  `.trim();

  const results = [];

  // Send to customer if email exists
  if (customerEmail && customerEmail !== 'guest@example.com') {
    const emailResult = await sendEmail({
      to: customerEmail,
      subject: `${statusEmojis[status]} Order #${orderId} Status: ${status}`,
      html: emailHtml,
      text: whatsappBody.replace(/\*/g, '')
    });
    results.push({ type: 'email', result: emailResult });
  }

  // Send to customer if phone exists and Twilio is configured
  if (customerPhone && customerPhone !== 'N/A' && twilioClient) {
    const whatsappResult = await sendWhatsApp({
      to: customerPhone,
      body: whatsappBody
    });
    results.push({ type: 'whatsapp', result: whatsappResult });
  } else if (customerPhone && customerPhone !== 'N/A') {
    console.log('📱 WhatsApp notification skipped for customer - Twilio not configured');
  }

  return results;
};

/**
 * Send Welcome Email to New User
 */
const sendWelcomeEmail = async (userData) => {
  const { name, email, role } = userData;

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #c9a96e, #a07840); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        .button { background: #c9a96e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to New Prem Glass House!</h1>
        </div>
        <div class="content">
          <p>Dear <strong>${name}</strong>,</p>
          <p>Thank you for registering with New Prem Glass House!</p>
          <p>Your account has been successfully created. You can now:</p>
          <ul>
            <li>Browse our premium glass products</li>
            <li>Track your orders in real-time</li>
            <li>Save your favorite items</li>
            <li>Get exclusive offers and updates</li>
          </ul>
          <div style="text-align: center;">
            <a href="${process.env.CLIENT_URL || 'https://newpremglasshouse.in'}/shop" class="button">
              Start Shopping
            </a>
          </div>
          <p style="margin-top: 30px;">If you have any questions, feel free to contact us.</p>
          <p>Best regards,<br>Team New Prem Glass House</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} New Prem Glass House. All rights reserved.</p>
          <p>Bombay Chowk, Jharsuguda | +91 7328019093</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    subject: '🎉 Welcome to New Prem Glass House!',
    html: emailHtml
  });
};

module.exports = {
  sendEmail,
  sendWhatsApp,
  sendNewRegistrationNotification,
  sendNewOrderNotification,
  sendOrderStatusNotification,
  sendWelcomeEmail
};