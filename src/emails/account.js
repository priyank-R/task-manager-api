const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)//taskmanageapi-new

const sendWelcomeMail = (email,name)=>{
    sgMail.send({
        to:email,
        from: 'contact@rightangleoverseas.com',
        subject:`Hey ${name}, Welcome to the new app`,
        text: 'Hah gotchya'
    })
}

const sendCancelEmail = (email,name)=>{
    sgMail.send({
        to:email,
        from:'contact@rightangleoverseas.com',
        subject:`Hey ${name}, We're sad that you're leaving !`,
        text: 'Is there anything we can do to make you stay ?'
    })
}


module.exports = {
    sendWelcomeMail,
    sendCancelEmail
}