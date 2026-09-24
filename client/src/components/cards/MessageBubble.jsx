import React from 'react';

const MessageBubble = ({ message, isCurrentUser }) => {
  const formattedTime = new Date(message.createdAt || message.timestamp || Date.now()).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex items-end gap-2 mb-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      {!isCurrentUser && (
        <div className="w-7 h-7 rounded-lg bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mb-1 overflow-hidden">
          {message.sender?.profileImage ? (
            <img
              src={message.sender.profileImage}
              alt={message.sender?.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{message.sender?.name ? message.sender.name.charAt(0).toUpperCase() : 'U'}</span>
          )}
        </div>
      )}

      <div
        className={`max-w-[75%] sm:max-w-[65%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-xs ${
          isCurrentUser
            ? 'bg-brand-600 text-white rounded-br-xs'
            : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.message}</p>
        <div
          className={`text-[10px] mt-1 font-medium text-right ${
            isCurrentUser ? 'text-brand-200' : 'text-slate-400'
          }`}
        >
          {formattedTime}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
