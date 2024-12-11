"use client";
import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";

function SigninPage() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session.user?.email}
        <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <div>
      Not signed in <br />
      <button
        className="rounded bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4"
        onClick={() => signIn()}
      >
        Sign in
      </button>
    </div>
  );
}

export default SigninPage;
