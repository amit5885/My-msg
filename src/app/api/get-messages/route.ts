import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/dbconnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET() {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const dbUser = await UserModel.findOne({ email: session.user.email });
    if (!dbUser) {
      return NextResponse.json(
        { success: false, message: "User not found || get-messages_error" },
        { status: 404 }
      );
    }

    const userId = dbUser._id;

    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!user || user.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found || get-messages_error" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, messages: user[0].messages },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json(
        { success: false, message: "Failed to get messages: " + err.message },
        { status: 500 }
      );
    }
  }
}
