const conversations = [
  {
    id: "ava",
    name: "Ava Patel",
    initials: "AV",
    status: "Online - sales lead",
    tag: "VIP",
    last: "Can you send the launch deck?",
    messages: [
      { from: "incoming", text: "Hi Blu Sky team, can you send the latest launch deck and pricing sheet?", time: "09:41" },
      { from: "outgoing", text: "Absolutely. I am sharing the deck here and can schedule a video call for the final walkthrough.", time: "09:42" },
    ],
  },
  {
    id: "ops",
    name: "Operations War Room",
    initials: "OP",
    status: "38 members active",
    tag: "Team",
    last: "Shipment dashboard is ready.",
    messages: [
      { from: "incoming", text: "Shipment dashboard is ready. Please review before the 3 PM partner update.", time: "10:02" },
      { from: "outgoing", text: "Reviewed. Add the delay-risk column and pin the final PDF in the file vault.", time: "10:05" },
    ],
  },
  {
    id: "support",
    name: "Priority Support Queue",
    initials: "SQ",
    status: "12 customers waiting",
    tag: "SLA",
    last: "Refund approval needed.",
    messages: [
      { from: "incoming", text: "Customer #8841 needs refund approval and a human handoff.", time: "10:16" },
      { from: "outgoing", text: "Approved. Assigning this to the finance queue and sending a customer-safe reply.", time: "10:17" },
    ],
  },
  {
    id: "media",
    name: "Creator Partners",
    initials: "CP",
    status: "Campaign room",
    tag: "Media",
    last: "Video assets uploaded.",
    messages: [
      { from: "incoming", text: "The teaser video and product photos are uploaded for review.", time: "11:20" },
      { from: "outgoing", text: "Great. I will collect approvals and share the final content calendar today.", time: "11:21" },
    ],
  },
];

const tools = {
  smartReply: {
    title: "Smart replies",
    description: "Suggested replies help support, sales, and operations teams answer faster without losing a human tone.",
    replies: ["Thanks, I am checking this now.", "Yes, I can join a quick video call.", "I have attached the latest document."],
  },
  broadcast: {
    title: "Campaign broadcast",
    description: "Segment users, schedule launches, and send compliant announcements across large business audiences.",
    replies: ["Create launch audience", "Schedule announcement", "Review delivery analytics"],
  },
  vault: {
    title: "Secure file vault",
    description: "Keep contracts, invoices, decks, and media assets organized with role-based access controls.",
    replies: ["Request document approval", "Pin to customer profile", "Share expiring link"],
  },
  handoff: {
    title: "Agent handoff",
    description: "Move conversations between AI triage, sales, support, finance, and leadership queues without losing context.",
    replies: ["Assign to support", "Escalate to manager", "Add private note"],
  },
};

const conversationList = document.querySelector("#conversationList");
const messages = document.querySelector("#messages");
const messageInput = document.querySelector("#messageInput");
const composer = document.querySelector("#composer");
const attachButton = document.querySelector("#attachButton");
const fileInput = document.querySelector("#fileInput");
const activeAvatar = document.querySelector("#activeAvatar");
const activeName = document.querySelector("#activeName");
const activeStatus = document.querySelector("#activeStatus");
const toolTitle = document.querySelector("#toolTitle");
const toolDescription = document.querySelector("#toolDescription");
const quickReplies = document.querySelector("#quickReplies");
const searchInput = document.querySelector("#searchInput");
const callModal = document.querySelector("#callModal");
const callTitle = document.querySelector("#callTitle");
const remoteInitials = document.querySelector("#remoteInitials");
const localVideo = document.querySelector("#localVideo");
const videoButton = document.querySelector("#videoButton");
const voiceButton = document.querySelector("#voiceButton");
const closeCallButton = document.querySelector("#closeCallButton");
const endCallButton = document.querySelector("#endCallButton");
const muteButton = document.querySelector("#muteButton");
const cameraButton = document.querySelector("#cameraButton");
const installButton = document.querySelector("#installButton");

let activeConversation = conversations[0];
let localStream;
let installPrompt;

function getClock() {
  return new Intl.DateTimeFormat([], { hour: "2-digit", minute: "2-digit" }).format(new Date());
}

function renderConversations(items = conversations) {
  conversationList.innerHTML = "";
  items.forEach((conversation) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `conversation ${conversation.id === activeConversation.id ? "active" : ""}`;
    button.dataset.id = conversation.id;
    button.innerHTML = `
      <span class="avatar">${conversation.initials}</span>
      <span>
        <strong>${conversation.name}</strong>
        <span>${conversation.last}</span>
      </span>
      <span class="badge">${conversation.tag}</span>
    `;
    button.addEventListener("click", () => selectConversation(conversation.id));
    conversationList.appendChild(button);
  });
}

function renderMessages() {
  messages.innerHTML = "";
  activeConversation.messages.forEach((message) => {
    appendMessage(message, false);
  });
  messages.scrollTop = messages.scrollHeight;
}

function appendMessage(message, persist = true) {
  if (persist) {
    activeConversation.messages.push(message);
    activeConversation.last = message.text || message.fileName || "Shared an attachment";
    renderConversations();
  }

  const bubble = document.createElement("article");
  bubble.className = `message ${message.from}`;

  if (message.fileUrl) {
    const isImage = message.fileType.startsWith("image/");
    const isVideo = message.fileType.startsWith("video/");
    const media = isImage
      ? `<img src="${message.fileUrl}" alt="${message.fileName}" />`
      : isVideo
        ? `<video src="${message.fileUrl}" controls></video>`
        : `<span class="document-chip"><strong>DOC</strong><span>${message.fileName}</span></span>`;
    bubble.innerHTML = `<div class="attachment-preview">${media}<span>${message.text}</span></div><span class="meta">${message.time}</span>`;
  } else {
    bubble.innerHTML = `${message.text}<span class="meta">${message.time}</span>`;
  }

  messages.appendChild(bubble);
  messages.scrollTop = messages.scrollHeight;
}

function selectConversation(id) {
  const next = conversations.find((conversation) => conversation.id === id);
  if (!next) return;
  activeConversation = next;
  activeAvatar.textContent = next.initials;
  activeName.textContent = next.name;
  activeStatus.textContent = next.status;
  renderConversations();
  renderMessages();
}

function sendMessage(text) {
  const trimmed = text.trim();
  if (!trimmed) return;

  appendMessage({ from: "outgoing", text: trimmed, time: getClock() });
  messageInput.value = "";

  window.setTimeout(() => {
    appendMessage({
      from: "incoming",
      text: "Received instantly. blu sky can route this to CRM, support, broadcast, or a secure room in the production backend.",
      time: getClock(),
    });
  }, 320);
}

function renderTool(toolId) {
  const tool = tools[toolId];
  toolTitle.textContent = tool.title;
  toolDescription.textContent = tool.description;
  quickReplies.innerHTML = "";
  tool.replies.forEach((reply) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quick-reply";
    button.textContent = reply;
    button.addEventListener("click", () => sendMessage(reply));
    quickReplies.appendChild(button);
  });

  document.querySelectorAll(".tool-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.tool === toolId);
  });
}

function shareFiles(files) {
  [...files].forEach((file) => {
    const fileUrl = URL.createObjectURL(file);
    appendMessage({
      from: "outgoing",
      text: file.type.startsWith("image/")
        ? "Shared a photo."
        : file.type.startsWith("video/")
          ? "Shared a video."
          : "Shared a document.",
      time: getClock(),
      fileName: file.name,
      fileType: file.type || "application/octet-stream",
      fileUrl,
    });
  });
}

async function openCall(kind = "video") {
  callTitle.textContent = `${kind === "video" ? "Video calling" : "Voice calling"} ${activeConversation.name}`;
  remoteInitials.textContent = activeConversation.initials;
  callModal.hidden = false;

  if (kind === "video" && navigator.mediaDevices?.getUserMedia) {
    try {
      localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideo.srcObject = localStream;
    } catch {
      appendMessage({
        from: "incoming",
        text: "Camera permission was not granted. The production app should request camera and microphone access before starting a room.",
        time: getClock(),
      });
    }
  }
}

function closeCall() {
  callModal.hidden = true;
  if (localStream) {
    localStream.getTracks().forEach((track) => track.stop());
  }
  localStream = undefined;
  localVideo.srcObject = null;
}

composer.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage(messageInput.value);
});

attachButton.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", () => {
  shareFiles(fileInput.files);
  fileInput.value = "";
});

document.querySelectorAll(".tool-item").forEach((item) => {
  item.addEventListener("click", () => renderTool(item.dataset.tool));
});

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase().trim();
  const filtered = conversations.filter((conversation) =>
    [conversation.name, conversation.last, conversation.status, conversation.tag].join(" ").toLowerCase().includes(query),
  );
  renderConversations(filtered);
});

videoButton.addEventListener("click", () => openCall("video"));
voiceButton.addEventListener("click", () => openCall("voice"));
closeCallButton.addEventListener("click", closeCall);
endCallButton.addEventListener("click", closeCall);

muteButton.addEventListener("click", () => {
  if (!localStream) return;
  localStream.getAudioTracks().forEach((track) => {
    track.enabled = !track.enabled;
    muteButton.textContent = track.enabled ? "Mute" : "Unmute";
  });
});

cameraButton.addEventListener("click", () => {
  if (!localStream) return;
  localStream.getVideoTracks().forEach((track) => {
    track.enabled = !track.enabled;
    cameraButton.textContent = track.enabled ? "Camera" : "Camera off";
  });
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPrompt = event;
  installButton.hidden = false;
});

installButton.addEventListener("click", async () => {
  if (!installPrompt) return;
  installPrompt.prompt();
  await installPrompt.userChoice;
  installPrompt = undefined;
  installButton.hidden = true;
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}

renderConversations();
renderMessages();
renderTool("smartReply");
