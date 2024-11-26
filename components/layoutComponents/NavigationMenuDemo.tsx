"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
// import { Icons } from "@/components/icons"
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useFetchCategories } from "@/lib/dbModels";
import { FormattedMessage } from "react-intl";

const components: { title: string; href: string }[] = [
	{
		title: "UPCOMING AUCTIONS",
		href: "/Auctions",
	},
	{
		title: "AUCTION RESULTS",
		href: "/docs/primitives/hover-card",
	},
	{
		title: "BUY NOW",
		href: "/docs/primitives/progress",
	},
	{
		title: "FOTHEBY'S SEALED AUCTIONS",
		href: "/docs/primitives/scroll-area",
	},
	{
		title: "DEPARTEMENTS",
		href: "/docs/primitives/tabs",
	},
];

export function NavigationMenuDemo() {
	interface Category {
		value: number;
		label: string;
		description: string;
		image: string;
	}

	// Fetch category data
	const { categories } = useFetchCategories() as { categories: Category[] };
	return (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger>
						<FormattedMessage id="navCategories" defaultMessage="Categories" />
					</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-[450px] gap-2 p-4 md:w-[500px] md:grid-cols-2 lg:w-[480px] ">
							{categories.map((category) => (
								<ListItem key={category.value}>
									<Link
										href={{
											pathname: `/Categories`,
											query: { categoryId: category.value },
										}}
										className="text-gray-900 font-bold">
										{category.label}
									</Link>
								</ListItem>
							))}
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>

				<NavigationMenuItem>
					<Link href="/docs" legacyBehavior passHref>
						<NavigationMenuLink className={navigationMenuTriggerStyle()}>
							<FormattedMessage id="navDeals" defaultMessage="Deals" />
						</NavigationMenuLink>
					</Link>
				</NavigationMenuItem>

				<NavigationMenuItem>
					<Link href="#" legacyBehavior passHref>
						<NavigationMenuLink className={navigationMenuTriggerStyle()}>
							<FormattedMessage id="navWhatsNew" defaultMessage="What's New" />
						</NavigationMenuLink>
					</Link>
				</NavigationMenuItem>

				<NavigationMenuItem>
					<Link href="/ContactUs" legacyBehavior passHref>
						<NavigationMenuLink className={navigationMenuTriggerStyle()}>
							<FormattedMessage id="navContacts" defaultMessage="Contacts" />
						</NavigationMenuLink>
					</Link>
				</NavigationMenuItem>

				<NavigationMenuItem>
					<Link href="/Testimonials" legacyBehavior passHref>
						<NavigationMenuLink className={navigationMenuTriggerStyle()}>
							<FormattedMessage
								id="navTestimonial"
								defaultMessage="Testimonial"
							/>
						</NavigationMenuLink>
					</Link>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}

const ListItem = React.forwardRef<
	React.ElementRef<"a">,
	React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<a
					ref={ref}
					className={cn(
						"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
						className
					)}
					{...props}>
					<div className="text-sm font-medium leading-none">{title}</div>
					<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
						{children}
					</p>
				</a>
			</NavigationMenuLink>
		</li>
	);
});
ListItem.displayName = "ListItem";
