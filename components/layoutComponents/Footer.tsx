// The footer component is gotten from HyperUi
// https://www.hyperui.dev/components/marketing/footers
"use client";

import { Instagram, Twitter } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";

export default function Footer() {
	const intl = useIntl();
	return (
		<>
			<hr className=" mx-20 border-t-2 border-gray-600" />

			<footer className="bg-white">
				<div className="mx-auto max-w-screen-xl px-4 pb-6 sm:px-6 lg:px-8 lg:pt-12">
					<div className="grid grid-cols-1 gap-8 lg:grid-cols-3 footer-links">
						<div>
							<h3 className="text-2xl font-bold tracking-wider text-gray-900 uppercase">
								<FormattedMessage
									id="companyName"
									defaultMessage="CRAFTS COLLABORATION"
								/>
							</h3>
							<p className="mt-6 max-w-md text-center leading-relaxed text-gray-500 sm:max-w-xs sm:text-left">
								Lorem ipsum dolor, sit amet consectetur adipisicing elit.
								Incidunt consequuntur amet culpa cum itaque neque.
							</p>

							<ul className="mt-8 flex justify-center gap-6 sm:justify-start md:gap-8">
								<li>
									<a
										href="/"
										rel="noreferrer"
										target="_blank"
										className="text-teal-700 transition hover:text-teal-700/75">
										<span className="sr-only">Facebook</span>
										<svg
											className="h-6 w-6"
											fill="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true">
											<path
												fillRule="evenodd"
												d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
												clipRule="evenodd"
											/>
										</svg>
									</a>
								</li>

								<li>
									<a
										href="/"
										rel="noreferrer"
										target="_blank"
										className="text-teal-700 transition hover:text-teal-700/75">
										<span className="sr-only">Instagram</span>
										<Instagram />
									</a>
								</li>

								<li>
									<a
										href="/"
										rel="noreferrer"
										target="_blank"
										className="text-teal-700 transition hover:text-teal-700/75">
										<span className="sr-only">Twitter</span>
										<Twitter />
									</a>
								</li>
							</ul>
						</div>

						<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2">
							<div className="text-center sm:text-left">
								<p className="text-lg font-medium text-gray-900">
									{" "}
									<FormattedMessage id="aboutUs" defaultMessage="About Us" />
								</p>

								<ul className="mt-8 space-y-4 text-sm">
									<li>
										<a
											className="text-gray-700 transition hover:text-gray-700/75"
											href="/">
											<FormattedMessage
												id="contactUs"
												defaultMessage="Contact Us"
											/>
										</a>
									</li>

									<li>
										<a
											className="text-gray-700 transition hover:text-gray-700/75"
											href="/">
											{intl.formatMessage({
												id: "aboutUs",
												defaultMessage: "About Us",
											})}
											{/* <FormattedMessage
												id="aboutUs"
												defaultMessage="About Us"
											/> */}
										</a>
									</li>

									<li>
										<a
											className="text-gray-700 transition hover:text-gray-700/75"
											href="/">
											<FormattedMessage
												id="privacyPolicy"
												defaultMessage="Privacy Policy"
											/>
										</a>
									</li>

									<li>
										<a
											className="text-gray-700 transition hover:text-gray-700/75"
											href="/">
											{" "}
											<FormattedMessage
												id="sellerCentre"
												defaultMessage="Seller Centre"
											/>
										</a>
									</li>
								</ul>
							</div>

							<div className="text-center sm:text-left">
								<p className="text-lg font-medium text-gray-900">
									<FormattedMessage
										id="customerServices"
										defaultMessage="Customer Services"
									/>
								</p>

								<ul className="mt-8 space-y-4 text-sm">
									<li>
										<a
											className="text-gray-700 transition hover:text-gray-700/75"
											href="/">
											<FormattedMessage
												id="helpCentre"
												defaultMessage="Help Centre"
											/>
										</a>
									</li>

									<li>
										<a
											className="text-gray-700 transition hover:text-gray-700/75"
											href="/">
											{" "}
											<FormattedMessage
												id="howToBuy"
												defaultMessage="How To Buy"
											/>
										</a>
									</li>

									<li>
										<a
											className="text-gray-700 transition hover:text-gray-700/75"
											href="/">
											<FormattedMessage id="payment" defaultMessage="Payment" />
										</a>
									</li>

									<li>
										<a
											className="text-gray-700 transition hover:text-gray-700/75"
											href="/">
											<FormattedMessage
												id="shipping"
												defaultMessage="Shipping"
											/>
										</a>
									</li>

									<li>
										<a
											className="text-gray-700 transition hover:text-gray-700/75"
											href="/">
											<FormattedMessage
												id="returnRefund"
												defaultMessage="Return & Refund"
											/>
										</a>
									</li>

									<li>
										<a
											className="text-gray-700 transition hover:text-gray-700/75"
											href="/">
											<FormattedMessage
												id="warrantyPolicy"
												defaultMessage="Warranty Policy"
											/>
										</a>
									</li>
								</ul>
							</div>

							<div className="text-center sm:text-left">
								<p className="text-lg font-medium text-gray-900">
									<FormattedMessage
										id="helpfulLinks"
										defaultMessage="Helpful Links"
									/>
								</p>

								<ul className="mt-8 space-y-4 text-sm">
									<li>
										<a
											className="text-gray-700 transition hover:text-gray-700/75"
											href="/">
											<FormattedMessage id="faqs" defaultMessage="FAQs" />
										</a>
									</li>

									<li>
										<a
											className="text-gray-700 transition hover:text-gray-700/75"
											href="/">
											{" "}
											<FormattedMessage id="support" defaultMessage="Support" />
										</a>
									</li>

									<li>
										<a
											className="group flex justify-center gap-1.5 ltr:sm:justify-start rtl:sm:justify-end"
											href="/">
											<span className="text-gray-700 transition group-hover:text-gray-700/75">
												<FormattedMessage
													id="liveChat"
													defaultMessage="Live Chat"
												/>
											</span>

											<span className="relative flex h-2 w-2">
												<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75"></span>
												<span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500"></span>
											</span>
										</a>
									</li>
								</ul>
							</div>

							<div className="text-center sm:text-left">
								<p className="text-lg font-medium text-gray-900">
									<FormattedMessage
										id="contactUsTitle"
										defaultMessage="Contact Us"
									/>
								</p>

								<ul className="mt-8 space-y-4 text-sm">
									<li>
										<a
											className="flex items-center justify-center gap-1.5 ltr:sm:justify-start rtl:sm:justify-end"
											href="/">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5 shrink-0 text-gray-900"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												strokeWidth="2">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
												/>
											</svg>

											<span className="flex-1 text-gray-700">john@doe.com</span>
										</a>
									</li>

									<li>
										<a
											className="flex items-center justify-center gap-1.5 ltr:sm:justify-start rtl:sm:justify-end"
											href="/">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5 shrink-0 text-gray-900"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												strokeWidth="2">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
												/>
											</svg>

											<span className="flex-1 text-gray-700">0123456789</span>
										</a>
									</li>

									<li className="flex items-start justify-center gap-1.5 ltr:sm:justify-start rtl:sm:justify-end">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 shrink-0 text-gray-900"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											strokeWidth="2">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
											/>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
											/>
										</svg>

										<address className="-mt-0.5 flex-1 not-italic text-gray-700">
											<FormattedMessage
												id="address"
												defaultMessage="213 Lane, London, United Kingdom
												"
											/>
										</address>
									</li>
								</ul>
							</div>
						</div>
					</div>

					<div className="mt-12 border-t border-gray-100 pt-6">
						<div className="text-center sm:flex sm:justify-between sm:text-left">
							<p className="text-sm text-gray-500">
								<span className="block sm:inline">
									{" "}
									<FormattedMessage
										id="allRightsReserved"
										defaultMessage="All rights reserved."
									/>
								</span>
								<a
									className="inline-block text-teal-600 underline transition hover:text-teal-600/75"
									href="/">
									<FormattedMessage
										id="termsConditions"
										defaultMessage="Terms & Conditions"
									/>
								</a>
								<span>&middot;</span>
							</p>

							<p className="mt-4 text-sm text-gray-500 sm:order-first sm:mt-0">
								&copy; {new Date().getFullYear()}{" "}
								<FormattedMessage
									id="companyName"
									defaultMessage={"Craft Collaborations"}
								/>
							</p>
						</div>
					</div>
				</div>
			</footer>
		</>
	);
}
