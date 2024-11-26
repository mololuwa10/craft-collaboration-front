const ChatMessage = ({ message, isUser }: { message: any; isUser: any }) => {
	const messageClass = isUser
		? "bg-gray-700 text-white self-end"
		: "bg-green-300 text-black self-start";
	return (
		<div className={`max-w-xs md:max-w-md mb-2 p-2 rounded-lg ${messageClass}`}>
			<p>{message}</p>
		</div>
	);
};

export default ChatMessage;
