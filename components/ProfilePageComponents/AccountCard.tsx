import Link from "next/link";
import React from "react";
import { IconContext } from "react-icons";
import {
	FaRegAddressCard,
	FaRegListAlt,
	FaLock,
	FaRegCreditCard,
	FaTools,
	FaEnvelope,
	FaStar,
	FaHeadset,
	FaCertificate,
} from "react-icons/fa";

type IconMappingType = {
	[key: string]: JSX.Element;
};
import { FormattedMessage } from "react-intl";

const iconMapping: IconMappingType = {
	yourOrders: <FaRegListAlt size="3em" className="mb-2" />,
	yourAddresses: <FaRegAddressCard size="3em" className="mb-2" />,
	loginSecurity: <FaLock size="3em" className="mb-2" />,
	yourPayments: <FaRegCreditCard size="3em" className="mb-2" />,
	artisanProfile: <FaTools size="3em" className="mb-2" />,
	yourMessages: <FaEnvelope size="3em" className="mb-2" />,
	yourReviews: <FaStar size="3em" className="mb-2" />,
	customerService: <FaHeadset size="3em" className="mb-2" />,
	yourTestimonials: <FaCertificate size="3em" className="mb-2" />,
};

const AccountCard = ({
	titleId,
	descriptionId,
	url,
}: {
	titleId: any;
	descriptionId: any;
	url?: string;
}) => {
	const icon = iconMapping[titleId] || (
		<FaRegListAlt size="3em" className="mb-2" />
	);

	// If url is not provided, return a div instead of a Link component
	if (!url) {
		return (
			<div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out">
				<div>{icon}</div>
				<h2 className="font-semibold text-lg mb-1">
					<FormattedMessage id={titleId} defaultMessage="Default Title" />
				</h2>
				<p className="text-gray-600 text-sm">
					<FormattedMessage
						id={descriptionId}
						defaultMessage="Default Description"
					/>
				</p>
			</div>
		);
	}

	return (
		<Link href={url} className="text-decoration-none">
			<div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out">
				<div>{icon}</div>
				<h2 className="font-semibold text-lg mb-1">
					{" "}
					<FormattedMessage id={titleId} defaultMessage="Default Title" />
				</h2>
				<p className="text-gray-600 text-sm">
					<FormattedMessage
						id={descriptionId}
						defaultMessage="Default Description"
					/>
				</p>
			</div>
		</Link>
	);
};

export default AccountCard;
