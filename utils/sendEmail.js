const SibApiV3Sdk =
require('sib-api-v3-sdk');

const client =
SibApiV3Sdk.ApiClient.instance;

client.authentications['api-key'].apiKey =
process.env.BREVO_API_KEY;

const apiInstance =
new SibApiV3Sdk.TransactionalEmailsApi();

const sendEmail = async (to, subject, text) => {

    console.log("TO:", to);

    try {
        await apiInstance.sendTransacEmail({
            sender: {
                email: process.env.SENDER_EMAIL,
                name: "YZ THRIFT"
            },
            to: [{ email: to }],
            subject,
            textContent: text
        });

        console.log("Email Sent");

    } catch(error) {
        console.log(error);
    }
};

module.exports =
sendEmail;