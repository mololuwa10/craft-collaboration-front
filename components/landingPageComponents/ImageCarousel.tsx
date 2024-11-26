import Link from "next/link";
import { Button } from "../ui/button";

export default function ImageCarousel() {
	return (
		<>
			<section className="overflow-hidden bg-[url(/landingPage.jpg)] bg-cover bg-top bg-no-repeat">
				<div className="bg-black/25 p-8 md:p-12 lg:px-16 lg:py-24">
					<div className="text-center ltr:sm:text-left rtl:sm:text-right">
						<h2 className="text-2xl font-bold text-white sm:text-3xl md:text-5xl">
							Latest Shirts
						</h2>

						<p className="hidden max-w-lg text-white/90 md:mt-6 md:block md:text-lg md:leading-relaxed">
							Lorem ipsum dolor, sit amet consectetur adipisicing elit.
							Inventore officia corporis quasi doloribus iure architecto quae
							voluptatum beatae excepturi dolores.
						</p>

						<div className="mt-4 sm:mt-8">
							<Link href="#">
								<Button className="inline-block rounded-full bg-gray-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-gray-700 focus:outline-none focus:ring focus:ring-yellow-400">
									Get Yours Today
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}