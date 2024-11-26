/* eslint-disable @next/next/no-img-element */

"use client";

import React, { useCallback, useEffect, useState } from "react";
import { LanguageProvider } from "@/app/LanguageContext";
import Footer from "@/components/layoutComponents/Footer";
import Header from "@/components/layoutComponents/Header";
import { getAllConversations } from "@/lib/dbModels";
import { useFetchUserInfo } from "@/lib/data";

interface User {
	avatar: string;
	userId: number;
	firstname: string;
	lastname: string;
	user_email: string;
	username: string;
	contactTelephone: string;
	contactAddress: string;
	authorities: {
		roleId: number;
		authority: string;
	};
}

interface Message {
	messageId: number;
	sender: User;
	receiver: User;
	messageText: string;
	dateSent: string;
	read: boolean;
}

interface Conversation {
	otherParty: User;
	messages: Message[];
}

interface ConversationWithUnreadCount extends Conversation {
	unreadCount: number;
}

const SidebarItem = ({ title, count }: { title: any; count: any }) => {
	return (
		<a
			href="#"
			className="flex items-center justify-between px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100">
			<span className="font-medium">{title}</span>
			{count > 0 && (
				<span className="text-xs font-semibold text-white bg-gray-800 rounded-full px-2 py-0.5">
					{count}
				</span>
			)}
		</a>
	);
};

const MessageInbox = () => {
	const [conversations, setConversations] = useState<
		ConversationWithUnreadCount[]
	>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [unreadCount, setUnreadCount] = useState(0);
	// const [totalUnreadCount, setTotalUnreadCount] = useState(0);

	const { userDetails } = useFetchUserInfo();

	useEffect(() => {
		const fetchConversations = async () => {
			setLoading(true);
			try {
				const fetchedConversations = await getAllConversations();
				let totalCount = 0;
				let totalUnreadCount = 0;

				if (userDetails) {
					const currentUserId = userDetails.user.userId;
					fetchedConversations.forEach((conversation: any) => {
						const unreadMessages = conversation.messages.filter(
							(message: any) => {
								return (
									!message.read && message.receiver.userId === currentUserId
								);
							}
						).length;

						totalCount += unreadMessages;
					});

					// fetchedConversations.map((conversation: any) => {
					// 	const unreadCount = conversation.messages.reduce(
					// 		(count: any, message: any) => {
					// 			if (
					// 				!message.read &&
					// 				message.receiver.userId === userDetails.user.userId
					// 			) {
					// 				count++;
					// 			}
					// 			return count;
					// 		},
					// 		0
					// 	);

					// 	totalUnreadCount += unreadCount;

					// 	return {
					// 		...conversation,
					// 		unreadCount, // This will be used to display the count next to each conversation
					// 	};
					// });

					// Sort messages in each conversation

					fetchedConversations.forEach((conversation: any) => {
						conversation.messages.sort(
							(a: any, b: any) =>
								new Date(b.dateSent).getTime() - new Date(a.dateSent).getTime()
						);
					});

					// Sort conversations by the latest message
					fetchedConversations.sort((a: any, b: any) => {
						const lastMessageA = a.messages[0].dateSent;
						const lastMessageB = b.messages[0].dateSent;
						return (
							new Date(lastMessageB).getTime() -
							new Date(lastMessageA).getTime()
						);
					});
				}

				// setTotalUnreadCount(totalUnreadCount);
				setUnreadCount(totalCount);
				setConversations(fetchedConversations);
				setLoading(false);
			} catch (error) {
				setError(error.message);
				setLoading(false);
			}
		};

		fetchConversations();
	}, [userDetails]);

	const sidebarItems = [
		{ title: "Inbox", count: unreadCount },
		{ title: "From Etsy", count: 3 },
	];

	return (
		<>
			<LanguageProvider>
				<Header />

				<div className="px-6 py-4 border-b border-gray-200">
					<div className="font-semibold text-xl">Messages</div>
					<input
						type="search"
						className="mt-2 p-2 w-full bg-gray-100 rounded-md"
						placeholder="Search your messages"
					/>
				</div>
				<div className="flex h-screen mb-8">
					{/* Sidebar */}
					<aside className="w-64 border-r">
						<div className="px-4 py-2">
							<div className="mt-4">
								{sidebarItems.map((item) => (
									<SidebarItem
										key={item.title}
										title={item.title}
										count={item.count}
									/>
								))}
							</div>
						</div>
					</aside>

					{/* Message list */}
					<main className="flex-1 overflow-y-auto">
						{conversations.map((conversation) => {
							const lastMessage = conversation.messages[0];
							return (
								<li
									key={conversation.otherParty.userId}
									className="border-b last:border-b-0 border-gray-200">
									<a
										href="#"
										className="flex items-center p-4 hover:bg-gray-50">
										<img
											src={
												conversation.otherParty.avatar ||
												"https://randomuser.me/api/portraits/men/1.jpg"
											}
											alt={conversation.otherParty.firstname}
											className="h-10 w-10 rounded-full"
										/>

										<div className="ml-4">
											<p className="text-sm font-medium">
												{`${conversation.otherParty.firstname} ${conversation.otherParty.lastname}`}
											</p>
											<p className="text-sm text-gray-600">
												{lastMessage.messageText}
											</p>
										</div>

										{/* {conversation.unreadCount > 0 && (
											<span className="text-xs font-semibold text-white bg-blue-500 rounded-full px-2 py-0.5 mr-2">
												{conversation.unreadCount}
											</span>
										)} */}

										<div className="ml-auto text-right">
											<span className="block text-xs">
												{new Date(lastMessage.dateSent).toLocaleDateString(
													"en-GB",
													{
														day: "numeric",
														month: "long",
														year: "numeric",
													}
												)}
											</span>
											<span className="block text-xs">
												{new Date(lastMessage.dateSent).toLocaleTimeString()}
											</span>
										</div>
									</a>
								</li>
							);
						})}
					</main>
				</div>
				<Footer />
			</LanguageProvider>
		</>
	);
};

export default MessageInbox;
