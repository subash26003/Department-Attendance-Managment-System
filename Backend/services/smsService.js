import twilio from 'twilio'
import axios from 'axios';

const accountSid = process.env.TWILIO_SSIS;
const authToken = process.env.TWILIO_TOKEN;
const number = process.env.TWILIO_NUMBER;
const client = new twilio(accountSid, authToken);
console.log(process.env.FAST2SMS_API_KEY);


const sendMessageToParents = async (message, parentMobileNo) => {
    try {
        const response = await client.messages.create({
            body: message,
            from: `${number}`,
            to: parentMobileNo.startsWith('+') ? parentMobileNo : `+91${parentMobileNo}` 
        });
        console.log('Message sent with SID:', response.sid);
    } catch (error) {
        console.error('Error sending SMS:', error.message);
    }
}


export const sendSMStoParents = async (message, phoneNumber) => {
    try {
      const response = await axios.post(
        'https://www.fast2sms.com/dev/bulkV2',
        {
          route: 'v3',
          message,
          language: 'english',
          flash: 0,
          numbers: phoneNumber
        },
        {
          headers: {
            authorization: process.env.FAST2SMS_API_KEY,
            'Content-Type': 'application/json'
          }
        }
      );
  
      console.log('✅ SMS sent:', response.data);
    } catch (error) {
      console.error('❌ Failed to send SMS:', error.response?.data || error.message);
    }
  };

export default sendMessageToParents