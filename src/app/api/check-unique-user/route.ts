import dbConnect from "@/lib/dbconnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";
import { usernameValidation } from "@/schemas/signupSchema";

const UsernameQuerySchema = usernameValidation;
export async function GET(request: Request) {
  await dbConnect();
  if (request.method !== "GET") {
    return NextResponse.json(
      {
        success: false,
        message: "Method not allowed",
      },
      { status: 405 },
    );
  }
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get("username"),
    };

    const result = UsernameQuerySchema.safeParse(queryParams);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return NextResponse.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameters",
          error: "Invalid query parameters",
        },
        { status: 400 },
      );
    }

    const { username } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isverified: true,
    });
    if (existingVerifiedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Username already exists",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Username is available",
      },
      { status: 200 },
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err.message);
      return NextResponse.json(
        {
          success: false,
          message: "Error checking username",
        },
        { status: 500 },
      );
    }
  }
}
