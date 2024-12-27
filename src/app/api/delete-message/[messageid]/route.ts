import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/dbconnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(
  request: Request,
  context: { params: { messageid: string } },
) {
  await dbConnect();
  const { messageid } = context.params;
  const session = await getServerSession(authOptions);

  if (!session || !session?.user?.email) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 },
    );
  }

  try {
    const dbUser = await UserModel.findOne({ email: session.user.email });
    if (!dbUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    const updateResult = await UserModel.updateOne(
      { _id: dbUser._id },
      { $pull: { messages: { _id: messageid } } },
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
