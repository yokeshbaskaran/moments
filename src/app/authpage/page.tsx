"use client";

import Image from "next/image";
import React, { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { loginAccount, registerAccount } from "../actions/auth";
import { useRouter } from "next/navigation";
import { Login, Register } from "../../helpers/types";
import { useMutation } from "@tanstack/react-query";
import { useAppContext } from "@/context/AppContext";

const Authpage = () => {
  const [auth, setauth] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });

  const [isPending, startTransition] = useTransition();

  //navigate
  const router = useRouter();
  const { dataChanged, setDataChanged } = useAppContext();

  // Register mutation
  const { mutate: registerMutate } = useMutation({
    mutationFn: registerAccount,
    onSuccess: (registerData) => {
      // console.log("registerData", registerDa/ta);
      if (registerData.errorMessage) {
        toast.error(registerData.errorMessage);
      } else {
        router.push("/");
        toast.success("Verification link has been sent to your email");
      }
    },
    onError: () => {
      toast.error("Error creating new user");
    },
  });

  // Login mutation
  const { mutate: loginMutate } = useMutation({
    mutationFn: loginAccount,
    onSuccess: (loginData) => {
      if (loginData.errorMessage) {
        toast.error(loginData.errorMessage);
      } else {
        router.push("/");
        toast.success("User logged in");
      }
    },
    onError: () => {
      toast.error("Error in user login");
    },
  });

  const handleRegister = (data: Register) => {
    if (!formData.username || !formData.email || !formData.password) {
      toast.error(`Enter details to ${auth ? "Register" : "login"}`);
      return;
    }

    startTransition(() => {
      registerMutate(data);
    });
  };

  const handleLogin = (data: Login) => {
    if (!formData.email || !formData.password) {
      toast.error(`Enter details to ${auth ? "Register" : "login"}`);
      return;
    }

    startTransition(() => {
      loginMutate(data);
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (auth) {
      handleRegister(formData);
    } else {
      handleLogin(formData);
    }

    setDataChanged(!dataChanged);
  };

  return (
    <section className="px-3 flex max-md:pt-10">
      {/* left section */}
      <div className="hidden w-1/2 lg:flex">
        {/* heart wallpaper when desktop*/}
        <Image
          width={350}
          height={350}
          src="/heart.png"
          alt="auth-logo"
          className="w-full max-w-[650px] mx-auto p-20"
        />

        {/* <div
          className="w-full mt-5 mb-3 lg:my-8 self-center bg-contain bg-no-repeat bg-center"
          style={{
            width: "340px",
            height: "340px",
            backgroundImage: "url('/heart.png')",
          }}
        ></div> */}
      </div>

      {/* right section */}
      <div className="w-full lg:w-1/2 my-3 py-5 lg:p-5">
        <div className="mx-auto max-w-md flex flex-col justify-center space-y-2">
          <div className="flex flex-col items-center lg:items-center justify-center">
            <div className="mt-5 mb-3 lg:mt-8 lg:mb-5 self-center">
              {/* Camera logo  */}
              <Image
                src="/logo.png"
                alt="logo"
                width={40}
                height={40}
                className="hidden md:flex"
              />
            </div>

            <h2 className="mb-2 font-semibold text-3xl">
              {auth ? "Create an account" : "Login to your account"}
            </h2>
            <p className="text-gray-500 text-lg">
              Enter your details to
              {auth ? " create account" : " login"}
            </p>
          </div>

          <form className="lg:px-3">
            {/* username only on Register  */}
            {auth && (
              <>
                <div className="mt-5 flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-appColor">
                  <input
                    name="username"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="block min-w-0 grow py-2 pr-3 pl-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                  />
                </div>
              </>
            )}

            <div className="mt-5 flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-appColor">
              <input
                name="email"
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleInputChange}
                className="block min-w-0 grow py-2 pr-3 pl-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
              />
            </div>

            <div className="mt-5 flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-appColor">
              <input
                name="password"
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleInputChange}
                className="block min-w-0 grow py-2 pr-3 pl-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
              />
            </div>

            <button
              onClick={handleSubmit}
              className={`w-full mt-5 my-2 p-2 text-white bg-appColor rounded capitalize cursor-pointer ${
                isPending && "opacity-70"
              }`}
              disabled={isPending}
            >
              {isPending ? "Loading..." : auth ? "register" : "login"}
            </button>
          </form>

          {/* <div>
            {isError && error && (
              <p className="text-red-500 text-center">{error.message}</p>
            )}
          </div> */}

          {/* divider  */}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-400"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or</span>
            </div>
          </div>

          {/* Login/Signup button  */}
          <button
            className="text-center hover:underline hover:text-appColor cursor-pointer"
            onClick={() => setauth(!auth)}
          >
            {auth
              ? "Already having a account? Login here"
              : "Don't have an account? Sign up"}
          </button>

          <div className="my-2 text-center text-gray-500 text-sm">
            By continuing, you agree to our
            <span className="hover:text-appColor underline cursor-pointer">
              Terms of Service
            </span>
            <span className="px-1">and</span>
            <span className="hover:text-appColor underline cursor-pointer">
              Privacy Policy.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Authpage;
