/* eslint-disable @next/next/no-img-element */
const categories = [
	{
		name: "Technology",
		discount: "10%",
		image: "/landingPage.jpg",
	},
	{ name: "Beauty", discount: "20%", image: "/blacktee.jpg" },
	{ name: "Fashion", discount: "40%", image: "/landingPage.jpg" },
];

type CategoryCardProps = {
	name: string;
	discount: string;
	image: string;
};

const CategoryCard = ({ name, discount, image }: CategoryCardProps) => (
	<div className="flex flex-col items-center rounded-lg shadow-lg p-4 m-2 flex-grow">
		<div className="text-yellow-500 font-bold">{discount} OFF</div>
		<div className="text-xl font-semibold mt-2 mb-4">{name}</div>
		<img src={image} alt={name} className="w-32 h-32 object-cover mb-4" />
		<button className="text-indigo-600 hover:text-indigo-800 transition-colors">
			Shop now →
		</button>
	</div>
);

export default function CategoriesDeals() {
	return (
		<div className="flex justify-center p-9">
			{categories.map((category) => (
				<CategoryCard key={category.name} {...category} />
			))}
		</div>
	);
}
