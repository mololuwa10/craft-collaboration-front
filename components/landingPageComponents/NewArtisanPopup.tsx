import { X } from "lucide-react";
import { Button } from "../ui/button";

const NewArtisanPopup = ({
	count,
	onViewClick,
	showPopup,
	onClose,
}: {
	count: number;
	onViewClick: () => void;
	showPopup: boolean;
	onClose: () => void;
}) => {
	const popupClasses = showPopup ? "translate-x-0" : "translate-x-full";

	if (count > 0) {
		return (
			<div
				className={`fixed top-[20%] right-0 transform transition-transform ease-out duration-300 p-4 bg-white shadow-lg border rounded-lg border-gray-200 z-50 ${popupClasses}`}>
				<Button
					onClick={onClose}
					className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto flex items-center"
					title="Close">
					<X className="w-5 h-5" />
				</Button>
				<p className="text-sm font-medium text-gray-800 flex items-center justify-center">
					<span className="pop-in">🌟</span>
					<span className="mx-2">
						Hey there! {count} new artisan{count !== 1 ? "s have" : " has"} just
						arrived! Check them out!
					</span>
					<span className="pop-in">🚀</span>
				</p>
				<Button
					className="mt-3 text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2"
					onClick={onViewClick}>
					View All Artisans
				</Button>
			</div>
		);
	} else {
		return null;
	}
};

export default NewArtisanPopup;
