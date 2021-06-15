const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const md5 = require('md5');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
  res.send('Bienvenido a backend');
});

app.get('/register', (req, res) => {
  // src/views/register.html
  let file = path.resolve('src', 'views', 'register.html');
  console.log(file);
  // DEVOLVER UN FORMULARIO HTML
  res.sendFile(file);
});

app.get('/confirm', (req, res) => {
  res.send('Confirmado!');
});

app.post('/register', async (req, res) => {
  // http://localhost:4000/confirm?token=
  let token = md5(req.body.email + Date.now());

  console.log(token);

  let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });

  let info = await transporter.sendMail({
    from: "Backend <no-reply@example.com>",
    to: "bar@example.com, baz@example.com",
    subject: "Has completado exitosamente!",
    text: "Bienvenido a nuestro sistema",
    html: 
    `
      <a href="http:localhost:4000/confirm?token=${token}">
        Confirmar cuenta
      </a>
      <b>Bienvenido a nuestro sistema :)</b>
    `
  });

  console.log(testAccount);
  console.log("Message sent: %s", info.messageId);
  console.log("Preview url: %s", nodemailer.getTestMessageUrl(info));
  res.send(req.body);
});

// http://localhost:4000
app.listen(4000);

// GET http:localhost:3000/register
// POST http:localhost:3000/register
