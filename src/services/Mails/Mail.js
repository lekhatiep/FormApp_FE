import emailjs from "emailjs-com";
export async function sendEmailtoStudents(mailParams) {
  try {
    const resp = await emailjs.send(
      "service_lkssckr",
      "template_zrurawn",
      mailParams,
      "bkhRwgX4pogIC92vo"
    );
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

var EmailJSserviceID = "service_mq65bfi"; 
var EmailJSTemplateID = "template_n4spuwg"; 
var EmailjsPublicKey = "F0AI_eAUzp1yw8-oi";


export async function sendEmailtoStaffs(mailParams) {
  console.log("SendMailSTAFF");
  return true;
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
