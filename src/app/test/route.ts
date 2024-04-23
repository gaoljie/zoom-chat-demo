import { getFromAIService } from "@/utils/aiServiceClient";
import { NextRequest } from "next/server";
import { userContext } from "@/utils/userContext";
import ky from "ky";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  let aiResponse = await getFromAIService("Quote of the day");
  console.log(`aiResponse = ${aiResponse}`);
  return Response.json(aiResponse);
}
