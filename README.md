## Install

```bash
npm install
```

## Run locally

```bash
npm run dev
```

## Generate Access Token

src/utils/getAccessToken.ts

## Slash Command

url: /api/chatbot

## OAuth redirect

url: /auth

call https://zoom.us/oauth/token -> store user accessToken and refreshToken(currently stored in memory)

## Open App Shortcut

### from message context

call `https://api.zoom.us/v2/chat/users/me/messages/${requestHeaders.get("message_id")}` to get message content -> redirect to /list page with message as query param

### from App page

redirect to /list page directly
