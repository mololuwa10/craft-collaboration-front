"use client";

import { MoveRight } from "lucide-react";
import Link from "next/link";
import { useGetTestimonials } from "@/lib/dbModels";

export default function TestimonialsComponents() {
	// const [testimonials, setTestimonials] = useState([]);
	interface Testimonials {
		testimonialId: number;
		testimonialTitle: string;
		rating: number;
		comment: string;
		reviewDate: string;
		applicationUser: {
			userId: number;
			firstname: string;
			lastname: string;
			username: string;
		};
	}
	const { testimonials } = useGetTestimonials() as {
		testimonials: Testimonials[];
	};

	const renderStars = (rating: number) => {
		return (
			<div className="flex gap-0.5 text-green-500">
				{[...Array(5)].map((_, index) => (
					<svg
						key={index}
						className={`h-5 w-5 ${
							index < rating
								? "fill-current text-yellow-500"
								: "fill-current text-gray-400"
						}`}
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg">
						<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
					</svg>
				))}
			</div>
		);
	};

	return (
		<>
			<section className="bg-gray-300">
				<div className="mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 lg:px-20 lg:py-16">
					<div className="md:flex md:items-end md:justify-between">
						<div className="max-w-xl">
							<h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
								Read trusted reviews from our customers
							</h2>
						</div>

						<Link
							href="/Testimonials"
							className="mt-6 inline-flex shrink-0 items-center gap-2 rounded-full border border-rose-600 px-5 py-3 text-rose-600 transition hover:bg-rose-600 hover:text-white md:mt-0">
							<span className="font-medium"> Read all Testimonials </span>

							<MoveRight />
						</Link>
					</div>

					<div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
						{(testimonials || []).slice(0, 3).map((testimonial) => (
							<blockquote
								key={testimonial.testimonialId}
								className="flex h-full flex-col justify-between bg-white p-6 shadow-sm sm:p-8">
								<div>
									{renderStars(testimonial.rating)}

									<div className="mt-4">
										<p className="text-2xl font-bold text-rose-600 sm:text-3xl">
											{testimonial.testimonialTitle}
										</p>

										<p className="mt-4 leading-relaxed text-gray-700">
											{testimonial.comment}
										</p>
									</div>
								</div>

								<footer className="mt-4 text-sm font-medium text-gray-700 sm:mt-6">
									&mdash; {testimonial.applicationUser.firstname}{" "}
									{testimonial.applicationUser.lastname}
								</footer>
							</blockquote>
						))}
					</div>
				</div>
			</section>
		</>
	);
}
