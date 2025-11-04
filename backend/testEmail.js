import dotenv from "dotenv";
dotenv.config();
import { sendEmail } from "./utils/sendEmail.js";

sendEmail("arsalankhan1102004@gmail.com", "Test Email", "<p>Hello</p>")
  .then(() => console.log("Email sent!"))
  .catch(err => console.error("Error sending email:", err));
