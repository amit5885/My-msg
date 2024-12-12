import dbConnect from "@/lib/dbconnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, verifyCode } = await request.json();

    const decodedUsername = decodeURIComponent(username);
    const decodedVerifyCode = decodeURIComponent(verifyCode);

    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { success: false, message: "User already verified" },
        { status: 400 },
      );
    }

    // from database to check the code is valid or not
    const isValidCode = user.verifyCode === decodedVerifyCode;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isValidCode && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return NextResponse.json(
        { success: true, message: "User verified successfully" },
        { status: 200 },
      );
    } else if (!isCodeNotExpired) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Verification code has expired, please signup again to get a new code",
        },
        { status: 400 },
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid verification code" },
        { status: 400 },
      );
    }
  } catch (err) {
    if (err instanceof Error) {
      console.log("Error verifying user", err.message);
    }
    return NextResponse.json(
      { success: false, message: "Error verifying user" },
      { status: 500 },
    );
  }
}
