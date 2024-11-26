import Sidebar from "@/components/dashboardComponents/sidebar/sidebar";
import styles from "@/components/dashboardComponents/dashboard.module.css";
import Navbar from "@/components/dashboardComponents/navbar/navbar";
import Footer from "@/components/dashboardComponents/footer/footer";
import { useFetchUserInfo } from "@/lib/data";
import { LanguageProvider } from "../LanguageContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Layout = ({ children }: { children: React.ReactNode }) => {
	// const { userDetails, userRole, isLoggedIn } = useFetchUserInfo();
	// if (!isLoggedIn || userRole !== "ADMIN" || userDetails == null) {
	// 	return <div>You are not authorized to view this page</div>;
	// }
	return (
		<div
			className={styles.container}
			style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
			<div className={styles.menu}>
				<Sidebar />
			</div>
			<div className={styles.content}>
				<Navbar />
				{children}
				<Footer />
			</div>
		</div>
	);
};

export default Layout;
