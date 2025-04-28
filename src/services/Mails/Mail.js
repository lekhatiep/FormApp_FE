import emailjs from "emailjs-com";

var EmailJSserviceID = "service_mq65bfi"; 

var EmailjsPublicKey = "F0AI_eAUzp1yw8-oi";
const EmailJSTemplateIDStudent = "template_1vua53x"; // TEMPLATE ID FOR STUDENT
export async function sendEmailtoStudents(mailParams) {
  try {
    const resp = await emailjs.send(
      EmailJSserviceID,
      EmailJSTemplateIDStudent,
      mailParams,
      EmailjsPublicKey
    );
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

var EmailJSTemplateID = "template_n4spuwg"; // TEMPLATE ID FOR EMPLOYEE
export async function sendEmailtoStaffs(mailParams) {
  console.log("SendMailSTAFF");
  //return true;
  try {
    const resp = await emailjs.send(
      EmailJSserviceID,
      EmailJSTemplateID,
      mailParams,
      EmailjsPublicKey
    );

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
