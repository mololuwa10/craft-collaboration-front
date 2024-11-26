"use client";

import { useLogin } from "@/lib/auth";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormattedMessage } from "react-intl";
import { LanguageProvider } from "../LanguageContext";

export default function SignIn() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [passwordShown, setPasswordShown] = useState(false);
	const togglePasswordVisibility = () => setPasswordShown(!passwordShown);
	const { login, error } = useLogin();

	const handleLoginWithGoogle = () => {
		window.location.href = "http://localhost:8080/oauth2/authorization/google";
	};

	const handleSubmit = async (event: { preventDefault: () => void }) => {
		event.preventDefault();
		if (!username || !password) {
			// Show error message if username or password is empty
			toast.error("Please enter both username and password.");
		} else {
			try {
				await login(username, password);
				toast.success("Login successful!");
			} catch (error) {
				toast.error("An error occurred during login.");
				console.error("Failed to log in:", error);
			}
		}
	};

	return (
		<>
			<LanguageProvider>
				<ToastContainer
					position="top-right"
					autoClose={2000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
				/>
				<div className="flex items-center min-h-screen bg-white dark:bg-gray-900">
					<div className="container mx-auto">
						<div className="max-w-md mx-auto my-10">
							<div className="text-center">
								<h1 className="my-6 text-4xl font-bold text-gray-700 dark:text-gray-200">
									<FormattedMessage
										id="companyName"
										defaultMessage="Craft Collaborations"
									/>
								</h1>
								<h1 className="my-3 text-3xl font-semibold text-gray-700 dark:text-gray-200">
									<FormattedMessage
										id="signInHeading"
										defaultMessage="Sign in"
									/>
								</h1>
								<p className="text-gray-500 dark:text-gray-400">
									<FormattedMessage
										id="signInSubheading"
										defaultMessage="Sign in to access your account"
									/>
								</p>
							</div>
							<div className="m-7">
								<form onSubmit={handleSubmit}>
									<div className="mb-6">
										<label
											htmlFor="username"
											className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
										>
											<FormattedMessage
												id="usernameLabel"
												defaultMessage="Username"
											/>
										</label>
										<input
											type="text"
											name="username"
											id="username"
											placeholder="Username"
											value={username}
											onChange={(e) => setUsername(e.target.value)}
											className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
										/>
									</div>
									<div className="mb-6 relative">
										<div className="flex justify-between mb-2">
											<label
												htmlFor="password"
												className="text-sm text-gray-600 dark:text-gray-400"
											>
												<FormattedMessage
													id="passwordLabel"
													defaultMessage="Password"
												/>
											</label>
											<a
												href="#!"
												className="text-sm text-gray-400 focus:outline-none focus:text-indigo-500 hover:text-indigo-500 dark:hover:text-indigo-300"
											>
												<FormattedMessage
													id="forgotPassword"
													defaultMessage="Forgot password?"
												/>
											</a>
										</div>
										<div className="flex items-center border border-gray-300 rounded-md shadow-sm">
											<input
												type={passwordShown ? "text" : "password"}
												name="password"
												id="password"
												placeholder="Your Password"
												value={password}
												onChange={(e) => setPassword(e.target.value)}
												className="w-full px-3 py-2 placeholder-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
											/>
											<button
												type="button"
												onClick={togglePasswordVisibility}
												className="pr-3 text-gray-600 hover:text-indigo-500"
											>
												{passwordShown ? (
													<EyeOffIcon className="h-5 w-5 text-gray-700" />
												) : (
													<EyeIcon className="h-5 w-5 text-gray-700" />
												)}
											</button>
										</div>
									</div>

									{error && <p className="text-red-500">{error}</p>}
									<div className="mb-6">
										<button
											type="submit"
											className="w-full px-3 py-4 text-white bg-gray-700 rounded-md focus:bg-gray-900 focus:outline-none"
										>
											<FormattedMessage
												id="signInButton"
												defaultMessage="Sign in"
											/>
										</button>
									</div>
									<p className="text-lg font-medium text-center text-gray-400">
										<FormattedMessage
											id="noAccountPrompt"
											defaultMessage="Don&#x27;t have an account yet? Sign up."
										/>
										<a
											href="/Register"
											className="text-indigo-400 focus:outline-none focus:underline focus:text-indigo-500 dark:focus:border-indigo-800 hover:underline"
										>
											<FormattedMessage
												id="signUpLink"
												defaultMessage="Sign up"
											/>
										</a>
									</p>
								</form>
								<div className="relative my-4">
									<div className="absolute inset-0 flex items-center">
										<div className="w-full border-t border-gray-300"></div>
									</div>
									<div className="relative flex justify-center text-sm">
										<span className="px-2 text-neutral-600 bg-white">
											<FormattedMessage
												id="continueWith"
												defaultMessage="Or continue with"
											/>
										</span>
									</div>
								</div>
								<div>
									<button
										type="submit"
										onClick={handleLoginWithGoogle}
										className="w-full items-center block px-10 py-3.5 text-base font-medium text-center text-blue-600 transition duration-500 ease-in-out transform border-2 border-white shadow-md rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
										data-fdprocessedid="eburrg"
									>
										<div className="flex items-center justify-center">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												xmlnsXlink="http://www.w3.org/1999/xlink"
												className="w-6 h-6"
												viewBox="0 0 48 48"
											>
												<defs>
													<path
														id="a"
														d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
													></path>
												</defs>
												<clipPath id="b">
													<use xlinkHref="#a" overflow="visible"></use>
												</clipPath>
												<path
													clipPath="url(#b)"
													fill="#FBBC05"
													d="M0 37V11l17 13z"
												></path>
												<path
													clipPath="url(#b)"
													fill="#EA4335"
													d="M0 11l17 13 7-6.1L48 14V0H0z"
												></path>
												<path
													clipPath="url(#b)"
													fill="#34A853"
													d="M0 37l30-23 7.9 1L48 0v48H0z"
												></path>
												<path
													clipPath="url(#b)"
													fill="#4285F4"
													d="M48 48L17 24l-4-3 35-10z"
												></path>
											</svg>
											<span className="ml-4">
												{" "}
												<FormattedMessage
													id="logInWithGoogle"
													defaultMessage="Log in with Google"
												></FormattedMessage>
											</span>
										</div>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</LanguageProvider>
		</>
	);
}
