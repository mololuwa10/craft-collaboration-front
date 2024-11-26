const Breadcrumb = ({ title }: { title: string }) => {
	return (
		<div className="bg-white py-3 px-5">
			<h1 className="text-xl font-bold">{title}</h1>
		</div>
	);
};

export default Breadcrumb;
