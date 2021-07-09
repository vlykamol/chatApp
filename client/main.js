const messageform = document.querySelector('form');
const messageInput = messageform[0];
const messageContainer = document.querySelector('.message-container');

const socket = io('http://192.168.1.6:3000')

socket.on('connect', () => {
  console.log('client connected with id:' + socket.id);
})

socket.on('receive-msg', (message) => {
  displayMessage(message,true);
})


messageform.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value;
  displayMessage(message, false);
  socket.emit('send-msg', (message));
});

const displayMessage = (message, type) => {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add(type ? 'sender':'recever');
  messageDiv.innerText = message;
  messageContainer.append(messageDiv);
  messageform.reset();
}