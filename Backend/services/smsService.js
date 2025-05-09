import twilio from 'twilio'
import axios from 'axios';

const accountSid = process.env.TWILIO_SSIS;
const authToken = process.env.TWILIO_TOKEN;
const number = process.env.TWILIO_NUMBER;
const client = new twilio(accountSid, authToken);

const sendMessageToParents = async (message, parentMobileNo) => {
    try {
      console.log(message );
      console.log(parentMobileNo);
      console.log(number);
      
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


export default sendMessageToParents