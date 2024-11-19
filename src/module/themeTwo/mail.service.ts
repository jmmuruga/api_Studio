import { ValidationException } from "../../core/exception";
import { Request, Response } from "express";
import nodemailer from "nodemailer";

export const sendMail = async (req: Request, res: Response) => {
  try {
    const formDetails = req.body;
    console.log(formDetails, "email service called");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: "savedatain@gmail.com",
        pass: "mqks tltb abyk jlyw",
      },
    });
    await transporter.sendMail({
      from: "savedatain@gmail.com",
      to: formDetails.to,
      subject: `New Inquiry from ${formDetails.fullName}`,
      text:
        "Name: " +
        formDetails.fullName +
        "\n" +
        "Mobile Number: " +
        formDetails.mobileNumber +
        "\n" +
        "Mail-ID: " +
        formDetails.emailId +
        "\n" +
        "Message: " +
        formDetails.message,
    });

    res.status(200).send({
      Result: "Mail sent successfully",
    });
  } catch (error) {
    console.log(error, "result");
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
};
