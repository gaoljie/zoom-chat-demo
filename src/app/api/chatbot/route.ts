import { getAccessToken } from "@/utils/getAccessToken";
import { getFromAIService } from "@/utils/aiServiceClient";
import { getReminderByUserId, saveReminder } from "../../db/databaseService";
import { ReminderType } from "../../../types/reminderType";
import { uuid } from "../../../utils/apiUtils";

const zoomApiHost = process.env.ZOOM_API_HOST;

// todo
function summarizeReminders(botRequest: any) {}
export async function POST(request: Request) {
  const botRequest = await request.json();
  const {
    event,
    payload: {
      robotJid,
      toJid,
      accountId,
      userJid,
      cmd,
      messageId,
      fieldEditItem,
      actionItem,
    },
  } = botRequest;

  console.log(JSON.stringify(botRequest));
  console.log(`cmd = ${cmd}`);

  if (event === "bot_notification") {
    const command = getCommand(cmd);
    if (command === "create") {
      await createReminderPendingConfirm(botRequest);
    } else if (command === "summary") {
      await summarizeReminders(botRequest);
    } else if (command === "list") {
      listReminders(botRequest);
    } else {
      defaultCommand(
        botRequest,
        "Command not found!",
        "Please try again",
        null,
      );
    }
    console.log(`successfully processed command = ${command}`);
  } else if (
    event.startsWith("interactive") ||
    event.startsWith("chat_message") ||
    event === "interactive_message_editable" ||
    event === "interactive_message_fields_editable" ||
    event === "interactive_message_actions"
  ) {
    console.log(`inside interactive messages, event = ${event}`);
    if (actionItem) {
      const actionText = botRequest.payload.original.head.text;
      console.log(`actionText = ${actionText}`);
      if (actionItem.action === "command" && actionItem.value === "cancel") {
        // ignore and delete the message.
        deleteChatBotImMsg(
          botRequest.payload.messageId,
          getContentStrForDeleteMsg(botRequest),
        );
      } else if (
        actionItem.action === "command" &&
        actionItem.value === "approve"
      ) {
        //save reminder to DB;
        await createReminderAfterConfirm(botRequest);
      }
    } else {
      await updateReminderFormFields(botRequest);
    }
  }

  return Response.json({}, { status: 200 });
}

function getCommand(cmd: string) {
  let regEx = /[\s,;:]+/;
  const command = cmd.split(regEx)[0];
  return command.toLowerCase();
}

async function sendChatBotMsg(botRequest: any, content: string) {
  //console.log(`sending chatBotMsg contentStr = ${content}`);
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

async function createReminderPendingConfirm(botRequest: any) {
  // parse cmd str and send notification.
  const {
    payload: { robotJid, toJid, accountId, userJid, cmd, userId },
  } = botRequest;
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

  const contentStr = getContentStrForCreateReminderConfirmation(
    botRequest,
    reminderObj,
  );
  //send notification.
  sendChatBotMsg(botRequest, contentStr);
}

async function listReminders(botRequest: any) {
  const {
    payload: { robotJid, toJid, accountId, userJid, cmd, userId },
  } = botRequest;
  //  console.log(`inside listReminders, botRequest = ${JSON.stringify(botRequest)}`);
  let result = await getReminderByUserId(userId);
  console.log(`list reminders result = ${result}`);

  const contentStr = JSON.stringify({
    robot_jid: robotJid,
    to_jid: toJid,
    account_id: accountId,
    user_jid: userJid,
    content: {
      settings: {
        default_sidebar_color: "#0E72ED",
        is_split_sidebar: true,
      },
      head: {
        text: "List of Reminders",
      },
      body: [
        {
          type: "section",
          sections: result.map((reminder: ReminderType) => {
            return {
              type: "message",
              text:
                reminder.title +
                " => " +
                new Date(Date.parse(reminder.dueDate)).toLocaleString(),
              style: {
                bold: false,
              },
            };
          }),
        },
      ],
    },
  });

  // parse cmd str and send notification.
  sendChatBotMsg(botRequest, contentStr);
}

await function summarizeReminders(botRequest: any) {
  const {
    payload: { robotJid, toJid, accountId, userJid, cmd, userId },
  } = botRequest;

  console.log(`inside summarizeReminders`);
  // parse cmd str and send notification.
};

function defaultCommand(
  botRequest: any,
  headText: string,
  subHeadText: string,
  content: any,
) {
  // parse cmd str and send notification.
  const {
    payload: { robotJid, toJid, accountId, userJid, cmd, userId },
  } = botRequest;
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
        text: headText,
        sub_head: {
          text: subHeadText,
        },
      },
      content: content,
    },
  });
  sendChatBotMsg(botRequest, contentStr);
}

async function createReminderAfterConfirm(botRequest: any) {
  const {
    event,
    payload: {
      robotJid,
      toJid,
      accountId,
      userId,
      messageId,
      fieldEditItem,
      actionItem,
    },
  } = botRequest;
  const botReqPayloadObj = botRequest.payload.original;
  const msgId = messageId;
  let reminderObj = getReminderObjFromContentJson(botReqPayloadObj);
  reminderObj.reminderId = uuid();
  reminderObj.userId = userId;

  console.log(`reminderObj is ${JSON.stringify(reminderObj)}`);

  let result = await saveReminder(reminderObj);
  if (result) {
    defaultCommand(
      botRequest,
      "Success",
      "Successfully created reminder",
      null,
    );
    //finally delete the message.
    deleteChatBotImMsg(msgId, getContentStrForDeleteMsg(botRequest));
  }
}

function getReminderObjFromContentJson(botReqPayloadObj: any): any {
  let reminderObj: Partial<ReminderType> = {};
  const sectionsArr = botReqPayloadObj.body.filter(
    (e: any) => e.type === "section",
  )[0].sections;
  // console.log(`sectionsArr = ${JSON.stringify(sectionsArr)}`);
  const fieldsArr = sectionsArr.filter((e: any) => e.type === "fields")[0]
    .items;
  const datePickObj = sectionsArr
    .filter((e: any) => e.type === "datepicker")
    .filter((e: any) => e.action_id === "datepicker123")[0];
  const timePickObj = sectionsArr
    .filter((e: any) => e.type === "timepicker")
    .filter((e: any) => e.action_id === "timepicker123")[0];
  // console.log(`fieldsArr = ${JSON.stringify(fieldsArr)}`);
  // console.log(`datePickObj = ${JSON.stringify(datePickObj)}`);
  // console.log(`timePickObj = ${JSON.stringify(timePickObj)}`);
  if (fieldsArr) {
    fieldsArr.forEach((fieldItem: any) => {
      if (fieldItem.key === "Reminder Name") {
        reminderObj.title = fieldItem.value;
      }
      if (fieldItem.key === "Reminder Description") {
        reminderObj.description = fieldItem.value;
      }
      if (fieldItem.key === "Reminder Date") {
        reminderObj.dueDate = fieldItem.value;
      }
      if (fieldItem.key === "recurring") {
        reminderObj.recurring = fieldItem.value;
      }
      if (fieldItem.key === "priority") {
        reminderObj.priority = fieldItem.value;
      }
      if (fieldItem.key === "tags") {
        reminderObj.tags = fieldItem.value;
      }
    });
  }
  if (datePickObj && timePickObj) {
    const dateStr = datePickObj.initial_date;
    const timeStr = timePickObj.initial_time;
    reminderObj.date = dateStr;
    reminderObj.time = timeStr;
    reminderObj.dueDate = dateStr
      .replaceAll("/", "-")
      .concat(" ")
      .concat(timeStr)
      .concat(":00");
  }
  return reminderObj;
}

async function updateReminderFormFields(botRequest: any) {
  console.log(`inside updateReminderFormFields`);
  const {
    event,
    payload: {
      robotJid,
      toJid,
      accountId,
      messageId,
      fieldEditItem,
      actionItem,
    },
  } = botRequest;
  const botReqPayloadObjObj = botRequest.payload.object;
  const datepicker_item = botReqPayloadObjObj
    ? botReqPayloadObjObj.datepicker_item
    : undefined;
  const timepicker_item = botReqPayloadObjObj
    ? botReqPayloadObjObj.timepicker_item
    : undefined;
  const bot_msg_id = botReqPayloadObjObj
    ? botReqPayloadObjObj.bot_msg_id
    : undefined;
  const msgId = messageId ? messageId : bot_msg_id;
  console.log(`msgId is ${msgId}`);
  // console.log(`eventName = ${event} , messageId = ${messageId}, actionItem = ${JSON.stringify(actionItem)}, fieldEditItem = ${JSON.stringify(fieldEditItem)} ,bot_msg_id = ${bot_msg_id} , datepicker_item = ${JSON.stringify(datepicker_item)}, timepicker_item = ${JSON.stringify(timepicker_item)} `);
  let reminderObj = getReminderObjFromContentJson(
    botReqPayloadObjObj
      ? botRequest.payload.object.original
      : botRequest.payload.original,
  );
  if (fieldEditItem) {
    console.log(`fieldEditItem = ${JSON.stringify(fieldEditItem)}`);
    if (fieldEditItem.key === "Reminder Name") {
      reminderObj.title = fieldEditItem.newValue;
    }
    if (fieldEditItem.key === "Reminder Description") {
      reminderObj.description = fieldEditItem.newValue;
    }
    if (fieldEditItem.key === "Reminder Date") {
      reminderObj.dueDate = fieldEditItem.newValue;
    }
    if (fieldEditItem.key === "recurring") {
      reminderObj.recurring = fieldEditItem.newValue;
    }
    if (fieldEditItem.key === "priority") {
      reminderObj.priority = fieldEditItem.newValue;
    }
    if (fieldEditItem.key === "tags") {
      reminderObj.tags = fieldEditItem.newValue;
    }
  }

  if (datepicker_item) {
    if (datepicker_item.action_id === "datepicker123") {
      reminderObj.date = datepicker_item.value;
      reminderObj.dueDate = reminderObj.date
        .replaceAll("/", "-")
        .concat(" ")
        .concat(reminderObj.time)
        .concat(":00");
    }
  }
  if (timepicker_item) {
    if (timepicker_item.action_id === "timepicker123") {
      reminderObj.time = timepicker_item.value;
      reminderObj.dueDate = reminderObj.date
        .replaceAll("/", "-")
        .concat(" ")
        .concat(reminderObj.time)
        .concat(":00");
    }
  }
  //  console.log(`reminderObj after updateFormFields = ${JSON.stringify(reminderObj)}`);
  let contentStrUpd = getContentStrForCreateReminderConfirmation(
    botRequest,
    reminderObj,
  );
  await updateChatBotImMsg(msgId, contentStrUpd);
}

async function updateChatBotImMsg(msgId: string, contentStr: string) {
  // console.log(`updating chatBotMsg contentStr = ${contentStr}`);
  if (!msgId) {
    console.log(`msgId is not found. skipping...`);
    return;
  }
  const data = await (
    await fetch(`${zoomApiHost}/v2/im/chat/messages/${msgId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAccessToken()}`,
      },
      body: contentStr,
    })
  ).json();
  console.log(data);
}

async function deleteChatBotImMsg(msgId: string, contentStr: string) {
  if (!msgId) {
    console.log(`msgId is not found. skipping...`);
    return;
  }
  console.log(`deleting chatBotMsg msgId = ${msgId}`);
  const data = await (
    await fetch(`${zoomApiHost}/v2/im/chat/messages/${msgId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAccessToken()}`,
      },
      body: contentStr,
    })
  ).json();
  console.log(data);
}

function getContentStrForCreateReminderConfirmation(
  botRequest: any,
  reminderObj: any,
): any {
  const {
    payload: { robotJid, toJid, accountId, userJid, account_id },
  } = botRequest;
  const { user_jid, robot_jid, to_jid } = (
    botRequest.payload.object ? botRequest.payload.object : {}
  ) as any;
  // console.log(`botRequest = ${ JSON.stringify(botRequest)}`);
  let jsonStr = JSON.stringify({
    robot_jid: robotJid ? robotJid : robot_jid,
    to_jid: toJid ? toJid : to_jid,
    account_id: accountId ? accountId : account_id,
    user_jid: userJid ? userJid : user_jid,
    content: {
      settings: {
        default_sidebar_color: "#0E72ED",
        is_split_sidebar: true,
      },
      head: {
        text: "Create Reminder",
      },
      body: [
        {
          type: "section",
          sections: [
            {
              type: "fields",
              items: [
                {
                  key: "Reminder Name",
                  value: reminderObj.title ? reminderObj.title : " ",
                  editable: true,
                  short: false,
                },
                {
                  key: "Reminder Description",
                  value: reminderObj.description
                    ? reminderObj.description
                    : " ",
                  editable: true,
                  short: false,
                },
                {
                  key: "Reminder Date",
                  value: reminderObj.dueDate ? reminderObj.dueDate : " ",
                  editable: false,
                  short: false,
                },
              ],
            },
            {
              type: "datepicker",
              initial_date: reminderObj.date,
              action_id: "datepicker123",
            },
            {
              type: "timepicker",
              initial_time: reminderObj.time,
              action_id: "timepicker123",
            },
          ],
        },
        {
          type: "actions",
          text: "Please select your action",
          items: [
            {
              text: "Approve",
              value: "approve",
              style: "Primary",
            },
            {
              text: "Discard",
              value: "cancel",
              style: "Danger",
            },
          ],
        },
      ],
    },
  });
  return jsonStr;
}

function getContentStrForDeleteMsg(botRequest: any): any {
  const {
    payload: { robotJid, toJid, accountId, userJid, account_id },
  } = botRequest;
  const { user_jid, robot_jid, to_jid } = (
    botRequest.payload.object ? botRequest.payload.object : {}
  ) as any;
  //  console.log(`botRequest = ${ JSON.stringify(botRequest)}`);
  let jsonStr = JSON.stringify({
    robot_jid: robotJid ? robotJid : robot_jid,
    to_jid: toJid ? toJid : to_jid,
    account_id: accountId ? accountId : account_id,
    user_jid: userJid ? userJid : user_jid,
  });
  return jsonStr;
}

function defaultCommand2(botRequest: any) {
  // parse cmd str and send notification.
  const {
    payload: { robotJid, toJid, accountId, userJid, cmd, userId },
  } = botRequest;
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
  });
  sendChatBotMsg(botRequest, contentStr);
}
