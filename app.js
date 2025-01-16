const express = require('express');
const nodemailer = require('nodemailer');
const PORT = 3000;
const app = express();
app.use(express.static(__dirname + '/client'));
app.use(express.json());


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
});

app.post('/', async (req, res) => {


    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: req.body.email,
            to: process.env.EMAIL_USER,
            subject: `Mensaje de ${req.body.name}, ${req.body.email} desde RG Traslados`,
            text: req.body.message,
            html: `
            <h1> Mensaje de ${req.body.name} desde RG Translados</h1>
            <p> Email: ${req.body.email} </p>
            <p> ${req.body.message} </p>
            `
        };

        await transporter.sendMail(mailOptions);
        res.status(200).send('success'); // Ensure this matches the frontend's check
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al enviar el mensaje');
    }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})