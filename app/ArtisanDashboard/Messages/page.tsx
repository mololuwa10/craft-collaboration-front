/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useFetchUserInfo } from "@/lib/data";
import { getAllConversations } from "@/lib/dbModels";
import React, { useCallback, useEffect, useState } from "react";
import {
	connect,
	sendMessage,
	disconnect,
	isConnected,
} from "@/lib/WebSocketService";
import { LanguageProvider } from "@/app/LanguageContext";

interface User {
	userId: number;
	firstname: string;
	lastname: string;
	user_email: string;
	username: string;
	contactTelephone: string;
	contactAddress: string;
	avatar?: string;
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
}

interface Conversation {
	otherParty: User;
	messages: Message[];
}

export default function Messages() {
	// const [users, setUsers] = useState({});
	const [selectedUserId, setSelectedUserId] = useState(null);
	const [messages, setMessages] = useState<
		{
			content: string;
			isUser: boolean;
			productDTO: {
				productId: number | string;
				productName: string;
			};
		}[]
	>([]);

	const [conversations, setConversations] = useState<Conversation[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { userDetails } = useFetchUserInfo() as {
		userDetails: { user: User } | null;
	};
	const [userId, setUserId] = useState<string | null>(null);

	const [inputValue, setInputValue] = useState("");

	useEffect(() => {
		if (userDetails && userDetails.user) {
			setUserId(userDetails.user.userId.toString());
		}
	}, [userDetails]);

	useEffect(() => {
		const fetchConversations = async () => {
			setLoading(true);
			try {
				const fetchedConversations = await getAllConversations();
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
						new Date(lastMessageB).getTime() - new Date(lastMessageA).getTime()
					);
				});
				setConversations(fetchedConversations);
				setLoading(false);
			} catch (error) {
				if (error instanceof Error) {
					setError(error.message);
				} else {
					setError(String(error));
				}
				setLoading(false);
			}
		};

		fetchConversations();
	}, []);

	const markMessagesAsRead = async (senderId: any, receiverId: any) => {
		const jwt = localStorage.getItem("jwt") ?? "";
		try {
			const response = await fetch(
				`http://localhost:8080/api/messages/mark-read/${senderId}/${receiverId}`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${jwt}`,
						"Content-Type": "application/json",
					},
				}
			);
			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Failed to mark messages as read: ${errorText}`);
			}
			// Here you could update the state or UI to reflect the change
		} catch (error) {
			console.error(error);
		}
	};

	// Function to handle when a user is clicked
	const handleUserClick = (otherUserId: any) => {
		setSelectedUserId(otherUserId);
		markMessagesAsRead(otherUserId, userId);
		fetchMessages(otherUserId);
	};

	// Fetch messages for a selected user
	const fetchMessages = useCallback(
		async (otherUserId: any) => {
			try {
				const response = await fetch(
					`http://localhost:8080/api/messages/history/${userId}?otherUserId=${otherUserId}`
				);

				if (!response.ok) {
					throw new Error("Failed to fetch messages");
				}
				const data = await response.json();
				setMessages(data);
			} catch (error) {
				console.error(error);
			}
		},
		[userId]
	);

	useEffect(() => {
		if (userId && selectedUserId) {
			fetchMessages(selectedUserId);
			const jwt = localStorage.getItem("jwt") ?? "";
			const onMessageReceived = (msg: any) => {
				setMessages((prevMessages) => [
					...prevMessages,
					{
						content: msg.content,
						isUser: msg.type === "SENT",
						productDTO: msg.productDTO,
					},
				]);
			};

			if (!isConnected() && selectedUserId) {
				connect(selectedUserId, onMessageReceived, jwt);
			}
			return () => disconnect();
		}
	}, [fetchMessages, selectedUserId, userId]);

	// Function to handle input changes
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

	const handleSendMessage = (e: any) => {
		e.preventDefault();
		if (inputValue.trim()) {
			const messageContent = {
				sender: userId,
				content: inputValue,
				recipientId: selectedUserId,
				productId: messages[messages.length - 1]?.productDTO?.productId,
				localDateTime: new Date().toISOString(),
			};
			sendMessage(messageContent);
			setInputValue("");
		}
	};

	if (loading) return <p>Loading conversations...</p>;
	if (error) return <p>Error fetching conversations: {error}</p>;

	return (
		<>
			<LanguageProvider>
				<div className="flex h-screen bg-gray-700">
					<aside className="w-1/4 bg-gray-600 p-4 overflow-y-auto">
						<div className="space-y-4">
							{conversations.map((conversation) => {
								const lastMessage = conversation.messages[0];
								return (
									<div
										key={conversation.otherParty.userId}
										className={`flex items-center px-2 py-1 cursor-pointer ${
											selectedUserId === conversation.otherParty.userId
												? "bg-gray-700 rounded-lg py-4 px-2"
												: ""
										}`}
										onClick={() =>
											handleUserClick(conversation.otherParty.userId)
										}
									>
										<img
											src={
												conversation.otherParty.avatar ||
												"https://randomuser.me/api/portraits/men/1.jpg"
											}
											alt={conversation.otherParty.firstname}
											className="h-10 w-10 rounded-full"
										/>

										<div className="ml-3">
											<p className="text-sm font-semibold">{`${conversation.otherParty.firstname} ${conversation.otherParty.lastname}`}</p>
											<p className="text-xs text-white">
												{lastMessage.messageText}
											</p>
										</div>

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
									</div>
								);
							})}
						</div>
					</aside>

					<main className="flex-1 p-4 bg-gray-700">
						<div className="flex flex-col-reverse h-full">
							<form onSubmit={handleSendMessage}>
								<div className="mb-4">
									<input
										type="text"
										className="w-full p-2 border rounded text-black focus:outline-none"
										placeholder="Type a message..."
										value={inputValue}
										onChange={handleInputChange}
									/>
								</div>
							</form>
							<div className="flex-1 overflow-y-auto">
								{messages.map((message: any, index: any) => {
									// const isCurrentUser = message.sender.userId === userId;

									const messageAlignment =
										message.type === "RECEIVED"
											? "justify-start"
											: "justify-end";
									const messageBackground =
										message.type === "RECEIVED"
											? "bg-white text-gray-800"
											: "bg-blue-500 text-white";
									return (
										<div
											key={index}
											className={`flex py-2 ${messageAlignment}`}
										>
											<div
												className={`rounded-lg p-3 mr-3 shadow ${messageBackground}`}
											>
												{message.type === "text" && <p>{message.content}</p>}
												{message.type === "image" && (
													<img
														src={message.content}
														alt="Sent image"
														className="max-h-40 w-auto"
													/>
												)}
												{message.type === "audio" && (
													<audio controls src={message.content}></audio>
												)}
												<p>{message.content}</p>
												<div className="flex">
													<p className="text-xs mt-1">
														{new Date(message.localDateTime).toLocaleDateString(
															"en-GB",
															{
																day: "numeric",
																month: "long",
																year: "numeric",
															}
														)}{" "}
														{new Date(
															message.localDateTime
														).toLocaleTimeString()}
													</p>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					</main>
				</div>
			</LanguageProvider>
		</>
	);
}
