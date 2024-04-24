import { NextRequest, NextResponse } from "next/server";
type Params = {
  id: string;
};
export async function GET(request: NextRequest, context: { params: Params }) {
  const reminderId = context.params.id;
  // call service method to get reminder and return.
  console.log(`reminder id , inside get = ${reminderId}`);

  return NextResponse.json({ reminderId });
}

export async function DELETE(
  request: NextRequest,
  context: { params: Params },
) {
  const reminderId = context.params.id;
  // call service method to delete reminder and return.
  console.log(`reminder id , inside delete = ${reminderId}`);

  return NextResponse.json({ reminderId });
}

export async function PATCH(request: NextRequest, context: { params: Params }) {
  const reminderId = context.params.id;
  // call service method to update reminder and return.
  console.log(`reminder id, inside patch = ${reminderId}`);
  const req = await request.json();

  console.log(`input data = ${JSON.stringify(req)}`);

  return NextResponse.json(req);
}
