import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/dbconnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 },
      );
    }

    const dbUser = await UserModel.findOne({ email: session.user.email });
    if (!dbUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    const { acceptMessages } = await request.json();

    const updatedUser = await UserModel.findByIdAndUpdate(
      dbUser._id,
      {
        isAcceptingMessages: acceptMessages,
      },
      { new: true },
    );
    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "Falied to update user to accept messages" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User Message acceptance status updated successfully",
      },
      { status: 200 },
    );
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          message:
            "failed to update user status to accept messages " + err.message,
        },
        { status: 500 },
      );
    }
  }
}

export async function GET(request: Request) {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 },
      );
    }

    const dbUser = await UserModel.findOne({ email: session.user.email });
    if (!dbUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        isAcceptingMessages: dbUser.isAcceptingMessages,
      },
      { status: 200 },
    );
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          message:
            "failed to get user status to accept messages " + err.message,
        },
        { status: 500 },
      );
    }
  }
}
