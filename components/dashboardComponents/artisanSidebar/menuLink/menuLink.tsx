"use client";

import Link from "next/link";
import styles from "./menuLink.module.css";
import { usePathname } from "next/navigation";

interface Item {
	path: string;
	title: string;
	icon: React.ReactNode;
	notificationCount?: number;
}

const MenuLink = ({ item }: { item: Item }) => {
	const pathname = usePathname();

	return (
		<Link
			href={item.path}
			className={`${styles.container} ${
				pathname === item.path && styles.active
			}`}>
			{item.icon}
			{item.title}
			{item.notificationCount && item.notificationCount > 0 && (
				<span className={styles.notificationIndicator}>
					{item.notificationCount}
				</span>
			)}
		</Link>
	);
};

export default MenuLink;
