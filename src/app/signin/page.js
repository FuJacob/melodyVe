"use client";
import { signIn } from "next-auth/react";

const SignInPage = () => {
  return (
    <section
      className="min-h-screen flex flex-col gap-12 justify-center items-center"
      style={{
        backgroundImage: "url('../../bg1.svg')",
        backgroundSize: "cover",
      }}
    >
      <img src="../../../melodyve.svg" className="w-96" />
      <div className="flex flex-col items-center p-12 rounded-3xl gap-6 shadow-2xl border-2 bg-white">
        <h1 className="text-2xl w-3/4 text-center">
          Click the button below and you will be redirected shortly to login
          with your <strong>Spotify account</strong>.
        </h1>
        <button
          onClick={() => signIn("spotify")}
          className="btn btn-lg btn-secondary text-2xl font-semibold text-white shadow-2xl rounded-3xl"
        >
          Sign in
        </button>
      </div>
    </section>
  );
};

export default SignInPage;
