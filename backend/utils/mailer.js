const nodemailer = require('nodemailer');

const isGmail = (process.env.EMAIL_USER || '').toLowerCase().endsWith('@gmail.com');

const transporter = nodemailer.createTransport(
  isGmail
    ? {
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      }
    : {
        host: process.env.EMAIL_HOST || 'smtp.hostinger.com',
        port: parseInt(process.env.EMAIL_PORT || '465', 10),
        secure: true,
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      }
);

const FROM = `"Nihara D'Aura" <${process.env.EMAIL_USER || 'noreply@niharadaura.com'}>`;
const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL || process.env.EMAIL_USER || process.env.SALON_EMAIL || '';

async function sendMail({ to, subject, html, text }) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !to) return false;
  try {
    await transporter.sendMail({ from: FROM, to, subject, html, text });
    return true;
  } catch (error) {
    console.error('[Mailer] Failed to send email:', error.message);
    return false;
  }
}

// Fire-and-forget helpers — never block the request
const notifyNewOrder = (order, orderDisplayId) => {
  const itemsList = (order.items || [])
    .map((i) => `${i.quantity || i.qty || 1}x ${i.name} — ₹${i.subtotal || i.price || 0}`)
    .join('<br/>');
  const rows = `
    <p><strong>Order ID:</strong> ${orderDisplayId}</p>
    <p><strong>Customer:</strong> ${order.customerName} (${order.customerEmail})<br/>${order.customerPhone || ''}</p>
    <p><strong>Items:</strong><br/>${itemsList}</p>
    <p><strong>Total:</strong> ₹${order.totalAmount}</p>
    <p><strong>Payment:</strong> ${order.paymentMethod} (${order.paymentStatus})</p>
  `;

  if (ADMIN_EMAIL) {
    sendMail({
      to: ADMIN_EMAIL,
      subject: `New order ${orderDisplayId} — ₹${order.totalAmount}`,
      html: `<h2>New order received</h2>${rows}`,
      text: `New order ${orderDisplayId}: ${order.customerName}, ₹${order.totalAmount}`,
    });
  }
  if (order.customerEmail) {
    sendMail({
      to: order.customerEmail,
      subject: `Order confirmed — ${orderDisplayId} | Nihara D'Aura`,
      html: `<h2>Thank you, ${order.customerName || 'Valued Customer'}!</h2><p>Your order <strong>${orderDisplayId}</strong> has been received.</p>${rows}<p>We will notify you once your order is shipped.</p>`,
      text: `Order ${orderDisplayId} confirmed. Total ₹${order.totalAmount}.`,
    });
  }
};

const notifyNewBooking = (booking, bookingDisplayId) => {
  const rows = `
    <p><strong>Booking ID:</strong> ${bookingDisplayId}</p>
    <p><strong>Customer:</strong> ${booking.customerName} (${booking.customerEmail})<br/>${booking.customerPhone || ''}</p>
    <p><strong>Service:</strong> ${booking.serviceType}</p>
    <p><strong>Artist:</strong> ${booking.artist} • <strong>Venue:</strong> ${booking.venue}</p>
    <p><strong>Date/Time:</strong> ${booking.date} at ${booking.time}</p>
    <p><strong>Amount:</strong> ₹${booking.totalAmount}</p>
  `;

  if (ADMIN_EMAIL) {
    sendMail({
      to: ADMIN_EMAIL,
      subject: `New appointment ${bookingDisplayId} — ${booking.date} ${booking.time}`,
      html: `<h2>New appointment booked</h2>${rows}`,
      text: `New booking ${bookingDisplayId}: ${booking.customerName}, ${booking.date} ${booking.time}`,
    });
  }
  if (booking.customerEmail) {
    sendMail({
      to: booking.customerEmail,
      subject: `Appointment confirmed — ${bookingDisplayId} | Nihara D'Aura`,
      html: `<h2>Namaste, ${booking.customerName || 'Valued Guest'}!</h2><p>Your appointment <strong>${bookingDisplayId}</strong> is confirmed.</p>${rows}`,
      text: `Appointment ${bookingDisplayId} confirmed for ${booking.date} at ${booking.time}.`,
    });
  }
};

module.exports = { sendMail, notifyNewOrder, notifyNewBooking, ADMIN_EMAIL };
