const maincontainer = document.querySelector('.main-container');
const messageform = document.querySelector('#chat-form');
const messageInput = messageform[0];
const navigationcontainer = document.querySelector('.nevigation-container');
const messageContainer = document.querySelector('.message-container');

const joincontainer = document.querySelector('.join-container');
const joinForm = document.querySelector('.join-form');
const Name = document.querySelector('#name');

const newRoomName = document.querySelector('#createRoomName');
const joinRoombtn = document.querySelector('#joinRoombtn');

let userName;
let roomId;


//socket change to use on local network
const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('client connected with id:' + socket.id);
  navigationcontainer.append(socket.id);
})

socket.on('newConnection', (name, id) => {
  onNewUserConnection(name,id);
})


joinForm.addEventListener('submit', (e) => {
  e.preventDefault();
  userName = Name.value;
  joincontainer.style.display = 'none';
  maincontainer.style.display = 'flex';
  console.log('usr ' + userName, 'id ' + roomId)

  socket.emit('newConnection', userName,roomId);
  onNewUserConnection("you","lobby");
});



const onNewUserConnection = (userName, roomId) => {
  const center = document.createElement ("center");
  center.append(`${userName} just connected to ${roomId === null ? 'loby' : roomId}`);
  messageContainer.append(center);
}


socket.on('receive-msg', (message) => {  //receiveing message
  displayMessage(message,true);
  console.log('rec',message)
})

//message
messageform.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value;
  displayMessage(message, false);
  socket.emit('send-msg', message, roomId); // sending message
});

const displayMessage = (message, type) => {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add(type ? 'sender':'recever');
  messageDiv.innerText = message;
  messageContainer.append(messageDiv);
  messageform.reset();
}

joinRoombtn.addEventListener('click', (e) => {
  console.log(newRoomName.value ? `${newRoomName.value}` : 'please enter room name to join or create');
  roomId = newRoomName.value;
  socket.emit('join-room',roomId,userName);
})