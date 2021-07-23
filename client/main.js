const maincontainer = document.querySelector('.main-container');
const messageform = document.querySelector('#chat-form');
const messageInput = messageform[0];
const navigationcontainer = document.querySelector('.nevigation-container');
const messageContainer = document.querySelector('.message-container');

const activeRooms = document.querySelector('.room-container');

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
  console.log('usr ' + userName)

  socket.emit('newConnection', userName);
  onNewUserConnection("you","lobby");
});



const onNewUserConnection = (userName, roomId) => {
  const center = document.createElement ("center");
  center.append(`${userName} just connected to ${roomId === null ? 'loby' : roomId}`);
  messageContainer.append(center);
}


socket.on('receive-msg', (roomid, message) => {  //receiveing message
  displayMessage(message, roomid, true);
  
  // console.log('msg recived', message, 'in room', roomid)
})

//message
messageform.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value;
  displayMessage(message, 'lobby', false);
  socket.emit('send-msg', message, roomId = null); // sending message
});

const displayMessage = (message, roomid, type) => {
  // console.log(roomid);
  const room = document.querySelector(`#${roomid}-room`)
  const messageDiv = document.createElement('div');
  messageDiv.classList.add(type ? 'sender':'recever');
  messageDiv.innerText = message;
  // console.log(room);
  
  room.append(messageDiv);
  messageform.reset();
}

joinRoombtn.addEventListener('click', (e) => {
  roomId = newRoomName.value;
  if(roomId === "") alert("please enter id to join!");
  else{
    socket.emit('join-room',roomId,userName);
    

    const newRoom = document.createElement('li');
    newRoom.innerText = `${roomId}`
    newRoom.setAttribute('id', `${roomId}`);
    activeRooms.append(newRoom);

    createNewMsgDiv();
  }
})


const createNewMsgDiv = () => {
  const newDiv = document.createElement('div');
  newDiv.classList.add("chat-container");
  newDiv.setAttribute('id', `${roomId}-chat`);
  const newMsgDiv = document.createElement('div');
  newMsgDiv.classList.add("message-container");
  newMsgDiv.setAttribute('id', `${roomId}-room`);
  newMsgDiv.innerHTML = `<center><h1>${roomId}</h1></center>`;


  const newChatForm = document.createElement('form');
  newChatForm.setAttribute('id', 'chat-form');
  const newInput = document.createElement('input');
  newInput.setAttribute('type', 'text');
  const newSendBtn = document.createElement('button');
  newSendBtn.innerText = 'send';
  newChatForm.append(newInput);
  newChatForm.append(newSendBtn);

  newDiv.append(newMsgDiv);
  newDiv.append(newChatForm);
  maincontainer.append(newDiv);

  addMsgSent(newChatForm, newInput, roomId);
}


const addMsgSent = (form,input,roomId) => {

  //message
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = input.value;
    displayMessage(message, roomId, false);
    socket.emit('send-msg', message, roomId); // sending message
  });
  
}