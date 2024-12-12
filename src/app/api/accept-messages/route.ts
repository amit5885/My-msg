import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/dbconnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    const user: User = session?.user;

    if (!session && !user) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 },
      );
    }

    const userId = user?._id;
    const { acceptMessages } = await request.json();
    console.log("----acceptMessages---------:", acceptMessages);

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
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
    const user: User = session?.user;

    if (!session && !user) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 },
      );
    }

    const userId = user?._id;
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessages,
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
