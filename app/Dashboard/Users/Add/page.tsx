"use client";

import AddUserForm from "@/components/dashboardComponents/users/addUser/AddUserForm.client";
import styles from "@/components/dashboardComponents/users/addUser/addUser.module.css";

const AddUserPage = () => {
	return (
		<div className={styles.container}>
			<AddUserForm />
		</div>
	);
};

export default AddUserPage;
