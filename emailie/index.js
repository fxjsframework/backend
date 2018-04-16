/**
 * Emailie:
 *  - email server
 */
const express = require('express')
const app     = express()
const body_parser = require('body-parser')
const nodemailer = require('nodemailer')
app.use(body_parser.json())
app.use(body_parser.urlencoded({
    extended: true
}))

app.get('*', function (req, res) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if(ip !== '::1' || ip !== 'localhost' || ip !== '127.0.0.1') {
        res.status(403).send('403 Forbidden')
        return;
    }
    var emails = JSON.parse(req.body.emails);
    var message = JSON.parse(req.body.message);
    var subject = req.body.subject;
    var template = req.body.template;
    const email_config = {
        email_address: process.env.EMAILIE_SENDER_EMAIL,
        password: process.env.EMAILIE_EMAIL_PASSWORD,
        service: process.env.EMAILIE_EMAIL_SERVICE
    }
    var transporter = nodemailer.createTransport({
        service: email_config.service,
        auth: {
            user: email_config.email_address,
            pass: email_config.password
        }
    })
    emails.forEach((email) => {
        var mail_address = email.to;
        var options = {
            from: email_config.email_address,
            to: mail_address,
            subject: subject,
            html: template
        }
        transporter.sendMail(options, function (err, info) {
            if(err)
            {
                require('../logger')(
                    'Emailie: Error sending email'
                )
                require('../logger')(err)
            }
            else {
                require('../logger')(
                    'Emailie: Sent email to ' + mail_address
                )
            }
        })
    })
})

app.listen(8433, () => {
    require('../logger')(
        'Emailie is online on port 8433, process id ' + process.pid
    )
})