export async function getFromAIService(aiRequest: string) {
  const aiResponse = await (
    await fetch(`${process.env.ZOOM_AI_SERVICE}/v1/chat-bot/invoke`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ZOOM_AI_SERVICE_TOKEN}`,
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            message: `${aiRequest}`,
          },
        ],
        model: "claude-instant-v1",
        task_id: "1",
        user_name: "test",
      }),
    })
  ).json();

  return aiResponse.result;
}
