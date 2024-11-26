/* eslint-disable @next/next/no-img-element */
"use client";

// import Image from "next/image";
import { FormattedMessage } from "react-intl";

export default function Blog() {
	const date = new Date();
	const day = date.getDate();
	const month = date.toLocaleString("default", { month: "short" });
	const year = date.getFullYear();

	let suffix;
	if (day > 3 && day < 21) suffix = "th";
	else if (day % 10 === 1) suffix = "st";
	else if (day % 10 === 2) suffix = "nd";
	else if (day % 10 === 3) suffix = "rd";
	else suffix = "th";

	const formattedDate = `${day}${suffix} ${month} ${year}`;

	return (
		<>
			<section className="mx-auto mt-10">
				<h1 className="text-bold font-medium text-2xl ml-24">
					<FormattedMessage
						id="moreFromUs"
						defaultMessage="More From Craft Collaborations"
					/>
				</h1>
				<div className="mt-5 grid gap-6 grid-cols-3 px-20">
					<article className="overflow-hidden rounded-lg shadow transition hover:shadow-lg">
						<img
							alt="Office"
							src="/payment.jpg"
							className="h-56 w-full object-cover"
						/>

						<div className="bg-white p-4 sm:p-6">
							<time
								dateTime={new Date().getFullYear().toString()}
								className="block text-xs text-gray-500"
							>
								{formattedDate}
							</time>

							<a href="#">
								<h3 className="mt-0.5 text-lg text-gray-900">
									<FormattedMessage
										id="onlinePayment"
										defaultMessage="Online Payment Processs"
									/>
								</h3>
							</a>

							<p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-500">
								Lorem ipsum dolor sit amet, consectetur adipisicing elit.
								Recusandae dolores, possimus pariatur animi temporibus nesciunt
								praesentium dolore sed nulla ipsum eveniet corporis quidem,
								mollitia itaque minus soluta, voluptates neque explicabo tempora
								nisi culpa eius atque dignissimos. Molestias explicabo corporis
								voluptatem?
							</p>
						</div>
					</article>

					<article className="overflow-hidden rounded-lg shadow transition hover:shadow-lg">
						<img
							alt="Office"
							src="/FAQs.jpg"
							className="h-56 w-full object-cover"
						/>

						<div className="bg-white p-4 sm:p-6">
							<time
								dateTime={new Date().getFullYear().toString()}
								className="block text-xs text-gray-500"
							>
								{formattedDate}
							</time>

							<a href="#">
								<h3 className="mt-0.5 text-lg text-gray-900">
									<FormattedMessage
										id="faq"
										defaultMessage="Frequently Asked Questions"
									/>
								</h3>
							</a>

							<p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-500">
								Lorem ipsum dolor sit amet, consectetur adipisicing elit.
								Recusandae dolores, possimus pariatur animi temporibus nesciunt
								praesentium dolore sed nulla ipsum eveniet corporis quidem,
								mollitia itaque minus soluta, voluptates neque explicabo tempora
								nisi culpa eius atque dignissimos. Molestias explicabo corporis
								voluptatem?
							</p>
						</div>
					</article>

					<article className="overflow-hidden rounded-lg shadow transition hover:shadow-lg">
						<img
							alt="Office"
							src="/homedelivery.jpg"
							className="h-56 w-full object-cover"
						/>

						<div className="bg-white p-4 sm:p-6">
							<time
								dateTime={new Date().getFullYear().toString()}
								className="block text-xs text-gray-500"
							>
								{formattedDate}
							</time>

							<a href="#">
								<h3 className="mt-0.5 text-lg text-gray-900">
									<FormattedMessage
										id="homeDelivery"
										defaultMessage="Home Delivery Options"
									/>
								</h3>
							</a>

							<p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-500">
								Lorem ipsum dolor sit amet, consectetur adipisicing elit.
								Recusandae dolores, possimus pariatur animi temporibus nesciunt
								praesentium dolore sed nulla ipsum eveniet corporis quidem,
								mollitia itaque minus soluta, voluptates neque explicabo tempora
								nisi culpa eius atque dignissimos. Molestias explicabo corporis
								voluptatem?
							</p>
						</div>
					</article>
				</div>
			</section>
		</>
	);
}
