import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { apiResponse } from "@/types/apiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string,
): Promise<apiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <noreply@amitrana.dev>",
      to: email,
      subject: "Message | Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return {
      success: true,
      message: "Verification email sent successfully",
    };
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error sending verification email:", err.message);
    }
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
