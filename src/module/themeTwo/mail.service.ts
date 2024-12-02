import { ValidationException } from "../../core/exception";
import { Request, Response } from "express";
import nodemailer from "nodemailer";
import { appSource } from "../../core/db";
import { formDetails } from "../formDetails/formDetails.model";

export const sendMail = async (req: Request, res: Response) => {
  try {
    const formDatas = req.body;
    console.log(formDatas, "email service called");
    const repo = appSource.getRepository(formDetails);
    await repo.save(formDatas);
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
      to: formDatas.to,
      subject: `New Inquiry from ${formDatas.customer_name}`,
      text:
        "Name: " +
        formDatas.customer_name +
        "\n" +
        "Mobile Number: " +
        formDatas.mobileNumber +
        "\n" +
        "Mail-ID: " +
        formDatas.e_mail +
        "\n" +
        "Message: " +
        formDatas.message,
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
