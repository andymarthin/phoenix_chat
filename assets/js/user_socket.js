// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "assets/js/app.js".

// Bring in Phoenix channels client library:
import { Socket } from "phoenix"

// And connect to the path in "lib/phoenix_chat_web/endpoint.ex". We pass the
// token for authentication. Read below how it should be used.
let socket = new Socket("/socket", { params: { token: window.userToken } })
socket.connect()

// Now that you are connected, you can join channels with a topic.
// Let's assume you have a channel with a topic named `room` and the
// subtopic is its id - in this case 42:
let channel = socket.channel("room:lobby", {})
let chatInput = document.querySelector("#chat-input")
let messagesContainer = document.querySelector("#messages")

chatInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    channel.push("new_msg", { body: chatInput.value, received: true })
    chatInput.value = ""
  }
})

channel.on("new_msg", (payload) => {
  let messageItem = document.createElement("p")
  messageItem.innerText = `[${Date()}] ${payload.body}`
  messagesContainer.appendChild(messageItem)
})

channel
  .join()
  .receive("ok", (resp) => {
    console.log("Joined successfully", resp)
  })
  .receive("error", (resp) => {
    console.log("Unable to join", resp)
  })

export default socket
