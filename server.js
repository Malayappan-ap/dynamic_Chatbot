const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// File storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/send-email', upload.single('file'), async (req, res) => {
  const { user_name, user_email, user_message, bot_type } = req.body;
  const file = req.file;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or another SMTP service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user_email,
 // or you can use user_email here
      subject: `ChatBot Submission - ${bot_type}`,
      text: `
Name: ${user_name}
Email: ${user_email}
Message: ${user_message}
Bot Type: ${bot_type}
      `,
      attachments: file
        ? [
            {
              filename: file.originalname,
              content: file.buffer,
            },
          ]
        : [],
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: 'Email sending failed.' });
  }
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
