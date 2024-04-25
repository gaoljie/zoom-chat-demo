import { getFromAIService } from "@/utils/aiServiceClient";

export async function generateReminderFromAI(cmd: string) {
  // parse cmd str and send notification.

  let aiRequest = `response Json example :{ "name": "Reminder for exercise", "startDate": ${new Date().toLocaleString()} }.
                   If Month and year not specified in date, calculate dates after this start date :'2024-04-24 14:30:12'.
                   If the date is not available please use today date. 
                   If the month and year is not available in the date use today month and year. 
                   Based on the above instructions process below instructions.
                   '${cmd}' based on this sentence extract the name of the event. 
                   Response should be only event name,start date format  with 24 hour clock format (yyyy-MM-dd hh:mm:ss) and timezone as IANA format. 
                   Populate the data in this json format {name: '', startDate: '', timeZone: ''} and return only the json.`;
  // console.log(`aiRequest = ${aiRequest}`);
  let aiResponse = await getFromAIService(aiRequest);
  let aiRespObj = JSON.parse(aiResponse);
  // console.log(`aiResponse = ${aiResponse}`);
  console.log(`aiRespObj = ${aiRespObj}`);
  console.log(`aiRespObj.name = ${aiRespObj["name"]}`);
  console.log(`aiRespObj.startDate = ${aiRespObj["startDate"]}`);
  console.log(`aiRespObj.timeZone = ${aiRespObj["timeZone"]}`);

  let aiRespStartDate = new Date(aiRespObj["startDate"]);
  const initialDate =
    aiRespStartDate.getFullYear().toString().padStart(4, "0") +
    "/" +
    (aiRespStartDate.getMonth() + 1).toString().padStart(2, "0") +
    "/" +
    aiRespStartDate.getDate().toString().padStart(2, "0");
  const initialTime =
    aiRespStartDate.getHours().toString().padStart(2, "0") +
    ":" +
    aiRespStartDate.getMinutes().toString().padStart(2, "0");

  let reminderObj = {
    title: aiRespObj.name,
    dueDate: aiRespObj.startDate,
    date: initialDate,
    time: initialTime,
  };

  return reminderObj;
}
