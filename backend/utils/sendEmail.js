// Temporary version without actual email sending
const sendEmailNotification = async (orderDetails, adminEmail) => {
  try {
    console.log('\n=== EMAIL NOTIFICATION (TEST MODE) ===');
    console.log('To:', adminEmail);
    console.log('Order Details:', JSON.stringify(orderDetails, null, 2));
    console.log('=== END EMAIL ===\n');
    
    return true; // Always return success in test mode
  } catch (error) {
    console.error('Error in email notification:', error);
    return false;
  }
};

module.exports = sendEmailNotification;