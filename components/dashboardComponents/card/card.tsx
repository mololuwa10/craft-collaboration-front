import { MdSupervisedUserCircle } from "react-icons/md";
import styles from "./card.module.css";

interface Item {
	title: string;
	number: number;
	change: number | string;
	detail?: string;
}

const Card = ({ item }: { item: Item }) => {
	const renderChange = () => {
		// If change is a number, render the percentage and more/less indicator
		if (typeof item.change === "number") {
			const changeClass = item.change > 0 ? styles.positive : styles.negative;
			return (
				<>
					<span className={changeClass}>{Math.abs(item.change)}%</span>{" "}
					{item.change > 0 ? "more" : "less"} than previous week
				</>
			);
		} else {
			// If change is a string, render it directly
			return item.change;
		}
	};

	return (
		<div className={styles.container}>
			<MdSupervisedUserCircle size={24} />
			<div className={styles.texts}>
				<span className={styles.title}>{item.title}</span>
				<span className={styles.number}>{item.number}</span>
				<span className={styles.detail}>
					{/* <span className={item.change > 0 ? styles.positive : styles.negative}>
						{item.change}%
					</span>{" "} */}
					{/* {item.change > 0 ? "more" : "less"} than previous week */}
					{renderChange()}
				</span>
			</div>
		</div>
	);
};

export default Card;
