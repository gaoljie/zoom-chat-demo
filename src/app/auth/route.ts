import { NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { userContext } from "@/utils/userContext";
import ky from "ky";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code") as string;

  const tokenParams = new URLSearchParams();
  tokenParams.set("grant_type", "authorization_code");
  tokenParams.set("code", code);
  tokenParams.set("redirect_uri", process.env.ZOOM_REDIRECT_URI as string);

  const zoomApiHost = process.env.ZOOM_API_HOST;

  const { access_token, refresh_token } = await ky
    .post(`${zoomApiHost}/oauth/token`, {
      body: tokenParams,
      headers: {
        Authorization: `Basic ${btoa(`${process.env.ZOOM_CLIENT_ID as string}:${process.env.ZOOM_CLIENT_SECRET as string}`)}`,
      },
    })
    .json<{
      access_token: string;
      refresh_token: string;
    }>();

  console.log(`access token after successful OAuth = ${access_token}`);
  const { id } = await ky
    .get(`${zoomApiHost}/v2/users/me`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
    .json<{ id: string }>();

  userContext[id] = {
    at: access_token,
    rt: refresh_token,
  };
  console.log(`userinfo ID after deriving OAuth token = ${id}`);

  redirect(`${zoomApiHost}/launch/chat?jid=robot_${process.env.ZOOM_BOT_JID}`);
}
