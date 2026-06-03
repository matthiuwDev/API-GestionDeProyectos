import nodemailer from 'nodemailer';
import config from '../config/config.js';
import path from 'path';
import { fileURLToPath } from 'url';
import ejs from 'ejs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function sendEmail({ to, subject, template, data, from = config.emailFrom.address }) {
  const file = path.join(__dirname, `../templates/${template}.html`);
  
  const html = await ejs.renderFile(file, data);
  const transporter = nodemailer.createTransport(config.smtpOptions);

  await transporter.sendMail({
    from,
    to,
    subject: `${config.prefixSubject}${subject}`,
    html,
  });
}

export default sendEmail;