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
        model: "gpt-3.5-turbo",
        task_id: "ze_team_remi_hackathon_2024_text_generation",
        user_name: "test",
        choices: 1,
      }),
    })
  ).json();

  return aiResponse.result;
}
