import dotenv from 'dotenv';
dotenv.config();

const config = {
    URL_WEB: process.env.URL_WEB,

    prefixSubject: '[IMPORTANTE]: ',
    emailFrom: {
        name: process.env.SMTP_EMAIL_NAME,
        address: process.env.SMTP_EMAILFROM
    }, 
    smtpOptions: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
   }
}

export default config;