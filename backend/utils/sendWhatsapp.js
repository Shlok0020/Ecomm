// Temporary version without actual WhatsApp sending
const sendWhatsAppNotification = async (orderDetails, adminPhone) => {
  try {
    console.log('\n=== WHATSAPP NOTIFICATION (TEST MODE) ===');
    console.log('To:', adminPhone);
    console.log('Order Details:', JSON.stringify(orderDetails, null, 2));
    console.log('=== END WHATSAPP ===\n');
    
    return true; // Always return success in test mode
  } catch (error) {
    console.error('Error in WhatsApp notification:', error);
    return false;
  }
};

module.exports = sendWhatsAppNotification;