import { Button, Container, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const App = () => {
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [room, setRoom] =useState("");
  const [socketId , setSocketId] = useState(null);
  const [messages ,setMessages] = useState([]);
  const newSocket = useMemo(() => io("http://localhost:3000"),[]);

  useEffect(() => {
    setSocket(newSocket);

    
    // Socket events
    newSocket.on("connect", () => {
      setSocketId(newSocket.id);
      console.log("Connected", newSocket.id);
    });

    newSocket.on("Welcome", (s) => {
      console.log(s);
    });

    newSocket.on("receive-message", (data)=>{
      console.log(data)
      setMessages((messages) => [...messages, data])
    })

    // Cleanup on unmount
    return () => {
      console.log("Disconnecting socket");
      newSocket.disconnect();
    };
  }, []); // Empty dependency array ensures this runs only on mount/unmount

  const handleSubmit = (e) => {
    e.preventDefault();
    if (socket) {
      socket.emit("message", {message , room});
      console.log("Message sent:", message);
    }
    setMessage(""); 
  };

  return (
    <Container>
      <Typography variant="h1" component="div" gutterBottom>
        Welcome to Socket.io
      </Typography>
      
      {socketId}
      <form onSubmit={handleSubmit}>
        <TextField
          id="message-input"
          label="Message"
          variant="outlined"
          fullWidth
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          margin="normal"
        />
        <TextField
          id="room-input"
          label="room"
          variant="outlined"
          fullWidth
          onChange={(e) => setRoom(e.target.value)}
          value={room}
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
      <Stack>
        {messages.map((m,i)=>(
          <Typography key={i} variant="h6" component="div" gutterBottom>
            {m}
          </Typography>
        ))}
      </Stack>
    </Container>
  );
};

export default App;
