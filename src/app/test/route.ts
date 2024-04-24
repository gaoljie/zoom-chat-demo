import { getFromAIService } from "@/utils/aiServiceClient";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  let aiRequest = `response Json example :{ "name": "Reminder for exercise", "startDate": ${new Date()} }.
                   If Month and year not specified in date, calculate dates after this start date :'2024-04-24 14:30:12'.
                   If the date is not available please use today date. 
                   If the month and year is not available in the date use today month and year. 
                   Based on the above instructions process below instructions.
                   'Create reminder for my exercise today at 5 PM EST' based on this sentence extract the name of the event. 
                   Response should be only event name,start date and end date  format  with 12 hour clock format (yyyy-MM-dd hh:mm:ss a) and timezone as IANA format. 
                   Populate the data in this json format {name: '', startDate: '', timeZone: ''} and return only the json.` ;

  let aiResponse = await getFromAIService(aiRequest);
  let aiRespObj = JSON.parse(aiResponse);
  //aiResponse = await getFromAIService("Quote of the day");
  console.log(`aiResponse = ${JSON.parse(aiResponse)}`);
  console.log(`aiResponse obj = ${aiResponse}`);
  console.log(`aiRespObj.name = ${aiRespObj['name']}`);
  console.log(`aiRespObj.startDate = ${aiRespObj['startDate']}`);
  console.log(`aiRespObj.timeZone = ${aiRespObj['timeZone']}`);
  return Response.json(aiResponse);
}
