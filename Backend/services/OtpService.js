import nodemailer from "nodemailer"
const fromMail = process.env.GMAIL
const password = process.env.APP_PASSWORD

const sendOTPToStudent = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: fromMail,
                pass: password
            }
        })


        const mailOptions = {
            from: fromMail,
            to: email.trim(),
            subject: 'Your OTP for Login',
            html: `
                    <div style="font-family: sans-serif; padding: 20px;">
                    <h2 style="color: #333;">Your One-Time Password</h2>
                    <p>Use the following OTP to verify your identity:</p>
                    <div style="font-size: 24px; font-weight: bold; color: #2c3e50; margin: 15px 0;">
                        ${otp}
                    </div>
                    <p>This OTP will expire in 5 minutes.</p>
                    <p>Do not share this code with anyone.</p>
                    </div>
                `
        }
        await transporter.sendMail(mailOptions)

    } catch (error) {
        console.log(error);

    }
}

const sendOtpToFaculty = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: fromMail,
                pass: password
            }
        })

        const mailOptions = {
            from: fromMail,
            to: email.trim(),
            subject: 'Your OTP for Login',
            html: `
                    <div style="font-family: sans-serif; padding: 20px;">
                    <h2 style="color: #333;">Your One-Time Password</h2>
                    <p>Use the following OTP to verify your identity:</p>
                    <div style="font-size: 24px; font-weight: bold; color: #2c3e50; margin: 15px 0;">
                        ${otp}
                    </div>
                    <p>This OTP will expire in 5 minutes.</p>
                    <p>Do not share this code with anyone.</p>
                    </div>
                `
        }

        await transporter.sendMail(mailOptions)
        console.log("Otp sent to faculty");
        
    } catch (error) {
        console.log(error);
    }
}
export { sendOTPToStudent , sendOtpToFaculty}