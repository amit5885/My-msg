import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/dbconnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User } from "next-auth";

export async function DELETE(
  request: Request,
  { params }: { params: { messageid: string } },
) {
  await dbConnect();
  const messageId = params.messageid;
  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session && !user) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 },
    );
  }

  try {
    const updateResult = await UserModel.updateOne(
      { _id: user?._id },
      { $pull: { messages: { _id: messageId } } },
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Message not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { success: true, message: "Message deleted successfully" },
      { status: 200 },
    );
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error deleting message:", err.message);
    }

    return NextResponse.json(
      { success: false, message: "Error deleting message" },
      { status: 500 },
    );
  }
}
