const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },

    family: 4
});

const sendEmail = async (to, subject, text) => {
    try {
        console.log("Sending Email...");

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        });

        console.log("Email Sent:", info.messageId);

    } catch (error) {
        console.error("Email Error:", error);
    }
};

module.exports = sendEmail;