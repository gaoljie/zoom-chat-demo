import {getAccessToken} from "@/utils/getAccessToken";
import {getFromAIService} from "@/utils/aiServiceClient";
import {getReminderByUserId} from "../../db/databaseService";
import {ReminderType} from "../../../types/reminderType";

const zoomApiHost = process.env.ZOOM_API_HOST;

export async function POST(request: Request) {
    const botRequest = await request.json();
    const {
        event,
        payload: {robotJid, toJid, accountId, userJid, cmd},
    } = botRequest;


    console.log(JSON.stringify(botRequest));
    console.log(`cmd = ${cmd}`);

    if (event === "bot_notification") {
        const command = getCommand(cmd);
        if (command === "create") {
            await createReminder(botRequest);
        } else if (command === "summary") {
            await summarizeReminders(botRequest);
        } else if (command === "list") {
            listReminders(botRequest);
        } else {
            defaultCommand(botRequest);
        }
        sendChatBotMsg(botRequest, "test");
        console.log(`successfully processed command = ${command}`);
    }

    return Response.json({},{ status: 200 });
}

function getCommand(cmd: string) {
    const command = cmd.split(" ")[0];
    return command;
}

async function sendChatBotMsg(botRequest, content: string) {
    const data = await (
        await fetch(`${zoomApiHost}/v2/im/chat/messages`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${await getAccessToken()}`,
            },
            body: content,
        })
    ).json();
    console.log(data);
}

async function createReminder(botRequest: any) {
    // parse cmd str and send notification.
    const {payload: {robotJid, toJid, accountId, userJid, cmd, userId}} = botRequest;
    let aiRequest = `response Json example :{ "name": "Reminder for exercise", "startDate": ${new Date()} }.
                   If Month and year not specified in date, calculate dates after this start date :'2024-04-24 14:30:12'.
                   If the date is not available please use today date. 
                   If the month and year is not available in the date use today month and year. 
                   Based on the above instructions process below instructions.
                   'Create reminder for my exercise today at 5 PM EST' based on this sentence extract the name of the event. 
                   Response should be only event name,start date and end date  format  with 12 hour clock format (yyyy-MM-dd hh:mm:ss a) and timezone as IANA format. 
                   Populate the data in this json format {name: '', startDate: '', timeZone: ''} and return only the json.`;

    let aiResponse = await getFromAIService(aiRequest);
    let aiRespObj = JSON.parse(aiResponse);
    console.log(`aiResponse = ${aiResponse}`);
    console.log(`aiRespObj = ${aiRespObj}`);
    console.log(`aiRespObj.name = ${aiRespObj['name']}`);
    console.log(`aiRespObj.startDate = ${aiRespObj['startDate']}`);
    console.log(`aiRespObj.timeZone = ${aiRespObj['timeZone']}`);
    //saveReminder
}

async function listReminders(botRequest: any) {
    const {payload: {robotJid, toJid, accountId, userJid, cmd, userId}} = botRequest;
    console.log(`inside listReminders, botRequest = ${JSON.stringify(botRequest)}`);
    let result = await getReminderByUserId(userId);
    console.log(`list reminders result = ${result}`)


    const contentStr = JSON.stringify({
        robot_jid: robotJid,
        to_jid: toJid,
        account_id: accountId,
        user_jid: userJid,
        content: {
            settings: {
                default_sidebar_color: "#0E72ED",
                is_split_sidebar: false,
            },
            head: {
                text: "List of Reminders",
                sub_head: {
                    text: "I am a sub head text",
                },
            },
            body: [
                {
                    type: "section",
                    sections: result.map((reminder: ReminderType) => {
                        return {
                            type: "message",
                            text: reminder.title,
                            style: {
                                bold: false,
                            }
                        };
                    })
                }]
        },
    });

    // parse cmd str and send notification.
    sendChatBotMsg(botRequest, contentStr);
}

await function summarizeReminders(botRequest: any) {
    const {payload: {robotJid, toJid, accountId, userJid, cmd, userId}} = botRequest;

    console.log(`inside summarizeReminders`);
    // parse cmd str and send notification.
}

function defaultCommand(botRequest: any) {
    // parse cmd str and send notification.
    const {payload: {robotJid, toJid, accountId, userJid, cmd, userId}} = botRequest;
    const contentStr = JSON.stringify({
        robot_jid: robotJid,
        to_jid: toJid,
        account_id: accountId,
        user_jid: userJid,
        content: {
            settings: {
                default_sidebar_color: "#0E72ED",
                is_split_sidebar: false,
            },
            head: {
                text: "I am a head text",
                sub_head: {
                    text: "I am a sub head text",
                },
            },
            body: [
                {
                    type: "section",
                    sections: [
                        {
                            type: "message",
                            text: cmd,
                            style: {
                                bold: true,
                            },
                        },
                        {
                            type: "fields",
                            items: [
                                {
                                    key: "Field item label",
                                    value: "Field item value",
                                    short: false,
                                },
                            ],
                        },
                    ],
                },
                {
                    type: "message",
                    text: "I am a message text",
                },
                {
                    type: "fields",
                    items: [
                        {
                            key: "Field item label 1",
                            value: "value 1",
                            short: false,
                        },
                        {
                            key: "Field item label 2",
                            value: "value 2",
                            short: false,
                        },
                    ],
                },
                {
                    type: "actions",
                    items: [
                        {
                            text: "Add",
                            value: "add",
                            style: "Primary",
                        },
                        {
                            text: "Update",
                            value: "update",
                            style: "Default",
                        },
                    ],
                },
                {
                    type: "select",
                    text: "Select label",
                    selected_item: {
                        text: "Item 1",
                        value: "value1",
                    },
                    select_items: [
                        {
                            text: "Item 1",
                            value: "value1",
                        },
                        {
                            text: "Item 2",
                            value: "value2",
                        },
                        {
                            text: "Item 3",
                            value: "value3",
                        },
                    ],
                },
                {
                    type: "select",
                    text: "Your Members",
                    static_source: "members",
                },
                {
                    type: "timepicker",
                    initial_time: "12:00",
                    action_id: "timepicker123",
                },
                {
                    type: "datepicker",
                    initial_date: "2010/10/10",
                    action_id: "datepicker123",
                },
                {
                    type: "radio_buttons",
                    initial_option: {
                        value: "A1",
                        text: "Radio1",
                    },
                    options: [
                        {
                            value: "A1",
                            text: "Radio1",
                        },
                        {
                            value: "A2",
                            text: "Radio2",
                        },
                    ],
                    action_id: "radio_buttons123",
                },
                {
                    type: "checkboxes",
                    options: [
                        {
                            text: "Blue",
                            value: "blue",
                            initial_selected: true,
                        },
                        {
                            text: "Green",
                            value: "green",
                        },
                    ],
                    action_id: "checkboxes123",
                },
                {
                    type: "file",
                    icon_url:
                        "https://d24cgw3uvb9a9h.cloudfront.net/static/93516/image/new/ZoomLogo.png",
                    title: {
                        text: "I am a file card title",
                        file_url: "https://zoom.us",
                    },
                    description: {
                        text: "I am a file card description",
                    },
                },
            ],
        },
    })
    sendChatBotMsg(botRequest, contentStr);
}
