import { ValidationException } from "../../core/exception";
import { Request, Response } from "express";
import nodemailer from 'nodemailer';

export const sendMail = async (req: Request, res: Response) => {
  try {
    const data = req.body;
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
      to: "savedataarunprasanthm@gmail.com",
      subject: `Password Recovery Assistance`,
      text: 'Hello',
    });
  } catch (error) {
    console.log(error,'result')
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
};
