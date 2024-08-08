import React, { useState, useCallback, useEffect } from "react"
import { GiftedChat, IMessage, InputToolbar } from "react-native-gifted-chat"

export default function Chat() {
  const [messages, setMessages] = useState<Array<IMessage>>()

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
    ])
  }, [])

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages),
    )
  }, [])

  return (
    <GiftedChat
      messages={messages}
      renderInputToolbar={renderInputToolbar}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 1,
      }}
    />
  )
}

function renderInputToolbar(props) {
  return (<InputToolbar {...props}/>)
}