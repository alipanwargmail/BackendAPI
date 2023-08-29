const nodemailer = require("nodemailer");

exports.handler = async function (event, context, callback) {
  // Parse the JSON text received.
  const body = JSON.parse(event.body);

  // Build an HTML string to represent the body of the email to be sent.
  const html = `<div style="margin: 20px auto;">test kirim email dr netlify function</div>`;

  // Generate test SMTP service account from ethereal.email. Only needed if you
  // don't have a real mail account for testing

  // create reusable transporter object using the default SMTP transport
  var transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: 'ikeltiga@gmail.com',
      //pass: 'Isupportkelompok32'
      pass: 'ewxsofcnulplgjhn'
    }
  });

  try {
    // send mail with defined transport object
    var info = await transporter.sendMail({
      from: '"☁️ The Cloud ☁️" <thecloud@example.com>',
      to: "alipanwar@gmail.com",
      subject: "New Form Submission",
      text: "test kirim email dr netlify function",
      html: html,
    });
    // Log the result
    console.log(info);
    callback(null, { statusCode: 200, body: JSON.stringify(info) });
  } catch (error) {
    // Catch and log error.
    callback(error);
  }
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, Origin",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE,OPTIONS",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(info),
  };
};