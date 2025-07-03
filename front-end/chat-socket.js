// Global state
let socket = null;
let currentRoom = "";

// DOM Elements
const messageInput = document.getElementById("message");
const messagesContainer = document.getElementById("messages");
const roomNameInput = document.getElementById("roomName");
const joinRoomButton = document.getElementById("joinRoomButton");
const roomSelectionDiv = document.getElementById("room-selection");
const chatAreaDiv = document.getElementById("chat-area");
const currentRoomDisplay = document.getElementById("currentRoomDisplay");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function joinRoomAndConnect() {
  const roomName = roomNameInput.value.trim();
  if (!roomName) {
    alert("Please enter a room name.");
    return;
  }
  currentRoom = roomName;

  // Disconnect existing socket if any
  if (socket && socket.connected) {
    socket.disconnect();
  }

  // Clear previous messages
  messagesContainer.innerHTML = "";

  // Initialize socket connection with room query parameter
  socket = io("wss://chosen-chat-app-production.up.railway.app", {
    transports: ["websocket"],
    query: { room: currentRoom },
    // forceNew: true, // Can be useful if server doesn't handle query changes on reconnect well
  });

  setupSocketListeners();

  // Update UI
  roomSelectionDiv.style.display = "none";
  chatAreaDiv.style.display = "flex"; // Assuming chat-area is a flex container
  currentRoomDisplay.textContent = `Room: ${currentRoom}`;
  messageInput.focus();
}

function setupSocketListeners() {
  if (!socket) return;

  socket.on("connect", () => {
    console.log(`Connected to server in room: ${currentRoom} with ID: ${socket.id}`);
  });

  socket.on("disconnect", (reason) => {
    console.log(`Disconnected from server: ${reason}. Current room: ${currentRoom}`);
    // Optionally, you could show the room selection again or attempt to reconnect with the same room.
    // For now, we'll rely on manual re-joining or automatic reconnection preserving the query.
  });

  socket.on("connect_error", (err) => {
    console.error("Connection Error:", err);
    alert(`Failed to connect to room ${currentRoom}. Please try again. Error: ${err.message}`);
    // Re-show room selection on connection error
    roomSelectionDiv.style.display = "flex";
    chatAreaDiv.style.display = "none";
  });

  // Listen for the 'message' event from the server
  socket.on("message", ({ data, id, room }) => {
    // Ensure message is for the current room, though server should handle this
    if (room === currentRoom) {
      handleNewMessage(data, id);
    }
  });

  // Listen for the 'chat-history' event from the server
  socket.on("chat-history", ({ data: history, room }) => {
    if (room !== currentRoom || !history) return;

    messagesContainer.innerHTML = ""; // Clear messages before loading history

    if (Array.isArray(history)) {
      // History now contains objects like { message: string, id: string }
      for (let i = 0; i < history.length; i++) {
        handleNewMessage(history[i].message, history[i].id, true); // Pass true for isHistory
      }
    }
    // else if (typeof history === 'object') { // If history is a single message object (less likely for history)
    //   handleNewMessage(history.message, history.id, true);
    // }
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function submitMessageToServer() {
  if (!socket || !socket.connected) {
    alert("Not connected to the server. Please join a room first.");
    return;
  }
  const messageText = messageInput.value.trim();
  if (messageText === "") return;

  socket.emit("message", {
    data: messageText,
    id: socket.id, // client's own socket ID
    room: currentRoom,
  });
  clearInput();
}

function handleNewMessage(data, senderId, isHistory = false) {
  let textMessage = createNewMessage(data);
  if (senderId === socket.id) {
    textMessage.classList.add("my-own-message");
  }

  if (isHistory) {
    messagesContainer.appendChild(textMessage); // Append at the end for history
  } else {
    messagesContainer.insertBefore(textMessage, messagesContainer.firstChild); // Insert at the top for new messages
  }

  if (!isHistory) {
      scrollInPlace(textMessage);
  } else if (messagesContainer.children.length > 0 && isHistory && messagesContainer.lastChild === textMessage) {
      // scroll to bottom after history is loaded
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}

function createNewMessage(data) {
  const textMsg = document.createElement("div");
  textMsg.classList.add("message-div");
  textMsg.appendChild(document.createTextNode(data));
  return textMsg;
}

function clearInput() {
  messageInput.value = "";
}

function scrollInPlace(node) {
  // For new messages, scroll to keep it in view (top)
  // For history, this might not be desired or needs different handling
  // Let's assume this is primarily for new messages.
   node.scrollIntoView({ behaviour: "smooth", block: "end" }); // this was making new messages appear at bottom
  // For new messages, we want them at the top, so no scroll or scroll to top might be better
  // messagesContainer.scrollTop = 0; // Scroll to top to see the latest message
}

// Make joinRoomButton active if user presses Enter in roomNameInput
roomNameInput.addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
    joinRoomButton.click(); // Simulate a click on the join button
  }
});
