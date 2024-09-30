const twilio = require('twilio');

// Twilio Credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
const authToken = process.env.TWILIO_AUTH_TOKEN; // Your Auth Token from www.twilio.com/console
const twilioNumber = process.env.TWILIO_PHONE_NUMBER; // Your Twilio phone number

// Check if Twilio credentials are loaded
if (!accountSid || !authToken || !twilioNumber) {
  throw new Error('Twilio credentials are not set in environment variables.');
}

// Initialize Twilio client
const client = twilio(accountSid, authToken);

// Function to send SMS
const sendSMS = async (to, message) => {
  try {
    // Ensure the number is in E.164 format (e.g., +91 for India if no country code is provided)
    if (!to.startsWith('+')) {
      to = `+91${to}`;
    }

    // Create the message
    const response = await client.messages.create({
      body: message,
      to, // Ensure this number is in E.164 format
      from: twilioNumber // From a valid Twilio number
    });
    
    console.log('Message sent:', response.sid);
    return response; // Optionally return the response for further processing
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error; // Propagate the error for further handling
  }
};

module.exports = {
  sendSMS
};
