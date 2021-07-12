const maincontainer = document.querySelector('.main-container');
const messageform = document.querySelector('#chat-form');
const messageInput = messageform[0];
const navigationcontainer = document.querySelector('.nevigation-container');
const messageContainer = document.querySelector('.message-container');

const joincontainer = document.querySelector('.join-container');
const joinForm = document.querySelector('.join-form');
const Name = document.querySelector('#name');
const room = document.querySelector('#room');


let userName;
let roomId;


//socket change to use on local network
const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('client connected with id:' + socket.id);
  navigationcontainer.append(socket.id);
})


joinForm.addEventListener('submit', (e) => {
  e.preventDefault();
  userName = Name.value;
  roomId = room.value;
  onNewUserConnection(userName,roomId);
});



const onNewUserConnection = (userName, roomId) => {
  const center = document.createElement ("center");
  center.append(`${userName} just connected`);
  messageContainer.append(center);
}


socket.on('receive-msg', (message) => {  //receiveing message
  displayMessage(message,true);
})

//message
messageform.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value;
  displayMessage(message, false);
  socket.emit('send-msg', (message)); // sending message
});

const displayMessage = (message, type) => {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add(type ? 'sender':'recever');
  messageDiv.innerText = message;
  messageContainer.append(messageDiv);
  messageform.reset();
}