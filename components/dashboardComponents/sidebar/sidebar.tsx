"use client";

import Image from "next/image";
import styles from "./sidebar.module.css";
import {
	MdDashboard,
	MdSupervisedUserCircle,
	MdShoppingBag,
	MdWork,
	MdAnalytics,
	MdPeople,
	MdOutlineSettings,
	MdHelpCenter,
	MdLogout,
	MdCategory,
	MdReorder,
	MdContacts,
	MdEmail,
	MdMessage,
} from "react-icons/md";
import MenuLink from "./menuLink/menuLink";
import { useFetchUserInfo, useLogout } from "@/lib/data";

const menuItems = [
	{
		title: "Pages",
		list: [
			{
				title: "Dashboard",
				path: "/Dashboard",
				icon: <MdDashboard />,
			},
			{
				title: "Users",
				path: "/Dashboard/Users",
				icon: <MdSupervisedUserCircle />,
			},
			{
				title: "Products",
				path: "/Dashboard/Products",
				icon: <MdShoppingBag />,
			},
			{
				title: "Categories",
				path: "/Dashboard/Category",
				icon: <MdCategory />,
			},
			{
				title: "Orders",
				path: "/Dashboard/Orders",
				icon: <MdReorder />,
			},
			{
				title: "Testimonials",
				path: "/Dashboard/Testimonials",
				icon: <MdSupervisedUserCircle />,
			},
			{
				title: "Messages",
				path: "/Dashboard/Messages",
				icon: <MdMessage />,
			},
			{
				title: "Contact Us Queries",
				path: "/Dashboard/Contacts",
				icon: <MdEmail />,
			},
		],
	},
	{
		title: "Analytics",
		list: [
			{
				title: "Revenue",
				path: "/Dashboard/revenue",
				icon: <MdWork />,
			},
			{
				title: "Reports",
				path: "/Dashboard/Reports",
				icon: <MdAnalytics />,
			},
			{
				title: "Teams",
				path: "/Dashboard/teams",
				icon: <MdPeople />,
			},
		],
	},
	{
		title: "User",
		list: [
			{
				title: "Settings",
				path: "/Dashboard/settings",
				icon: <MdOutlineSettings />,
			},
			{
				title: "Help",
				path: "/Dashboard/help",
				icon: <MdHelpCenter />,
			},
		],
	},
];

const Sidebar = () => {
	const { userDetails } = useFetchUserInfo();

	const logout = useLogout();

	return (
		<div className={styles.container}>
			<div className={styles.user}>
				<Image
					className={styles.userImage}
					src={"/noavatar.png"}
					alt=""
					width="50"
					height="50"
				/>
				<div className={styles.userDetail}>
					{userDetails && (
						<>
							<span className={styles.username}></span>
							<span className={styles.userTitle}>
								{userDetails.user.firstname} {userDetails.user.lastname}
							</span>
						</>
					)}
				</div>
			</div>
			<ul className={styles.list}>
				{menuItems.map((cat) => (
					<li key={cat.title}>
						<span className={styles.cat}>{cat.title}</span>
						{cat.list.map((item) => (
							<MenuLink item={item} key={item.title} />
						))}
					</li>
				))}
			</ul>
			<form onSubmit={logout}>
				<button className={styles.logout}>
					<MdLogout />
					Logout
				</button>
			</form>
		</div>
	);
};

export default Sidebar;
