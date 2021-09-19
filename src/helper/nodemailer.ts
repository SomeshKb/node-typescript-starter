
import * as Nodemailer from "Nodemailer";

 export async function sendMessage(reciverEmail: string) {
    try {

        const transporter = Nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "email", // generated ethereal user
                pass: "password", // generated ethereal password
            },
        });

        const info = await transporter.sendMail({
            from: "\"Fred Foo 👻\" <foo@example.com>", // sender address
            to: reciverEmail, // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: "<b>Hello world?</b>", // html body
        });

        console.log("Message sent: %s", info.messageId);

        console.log("Preview URL: %s", Nodemailer.getTestMessageUrl(info));
    } catch (err) {
        return err;
    }
}

