import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const HeaderTabs = () => {
	const [isMounted, setIsMounted] = useState(false);
	const router = useRouter();
	const navigationPathname = usePathname();

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const isActive = (pathname: any) => {
		return isMounted && navigationPathname === pathname;
	};
	return (
		<>
			<div className="flex border-b">
				<a
					href="/Profile/Orders"
					className={`text-sm font-medium px-4 py-2 hover:bg-gray-100 ${
						isActive("/Profile/Orders")
							? "text-gray-900 border-b-2 border-gray-500"
							: "text-gray-500"
					}`}
					// Prevent the default anchor behavior
					onClick={(e) => {
						e.preventDefault();
						router.push("/Profile/Orders");
					}}>
					Orders
				</a>
				<a
					href="/Profile/Orders/Cancelled"
					className={`text-sm font-medium px-4 py-2 hover:bg-gray-100 ${
						isActive("/Profile/Orders/Cancelled")
							? "text-gray-900 border-b-2 border-gray-500"
							: "text-gray-500"
					}`}
					onClick={(e) => {
						e.preventDefault();
						router.push("/Profile/Orders/Cancelled");
					}}>
					Cancelled Orders
				</a>
				<a
					href="/Profile/Orders/BuyAgain"
					className={`text-sm font-medium px-4 py-2 hover:bg-gray-100 ${
						isActive("/Profile/Orders/BuyAgain")
							? "text-gray-900 border-b-2 border-gray-500"
							: "text-gray-500"
					}`}
					onClick={(e) => {
						e.preventDefault();
						router.push("/Profile/Orders/BuyAgain");
					}}>
					Buy Again
				</a>
			</div>
		</>
	);
};

export default HeaderTabs;
