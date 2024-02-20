import React, {useState, useEffect} from 'react';
import {Grid, TextField, Button, List, ListItem, ListItemText, Paper, Typography} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import './App.css';
import MarkdownDisplay from "./MarkdownDisplay";

function App() {
  const [message, setMessage] = useState<string>(''); // Explicitly type as string
  const [chatHistory, setChatHistory] = useState<string[]>([]); // Explicitly type as array of strings
  const [currentMessage, setCurrentMessage] = useState<string>(''); // Explicitly type as string

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8000/ws');

    socket.addEventListener('open', function (event) {
      console.log('WebSocket is connected.');
    });

    socket.addEventListener('message', function (event) {
      console.log('Message from server ', event.data);
      // setChatHistory((prev) => [...prev, event.data]);
      setMessage(event.data);
    });

    return () => {
      socket.close();
    };
  }, []);

  const handleSendMessage = () => {
    // Add WebSocket send logic here if needed
    setChatHistory((prev) => [...prev, currentMessage]);
    setCurrentMessage('');
  };

  return (
    <div className="App">
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <MarkdownDisplay markdownText={message}/>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h6" gutterBottom>
            Chat Conversation
          </Typography>
          <Paper style={{padding: '20px', height: '70vh', overflow: 'auto'}}>
            <List>
              {chatHistory.map((msg, index) => (
                <ListItem key={index}>
                  <ListItemText primary={msg}/>
                </ListItem>
              ))}
            </List>
          </Paper>
          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            label="Type your message here..."
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' ? handleSendMessage() : null}
          />
          <Button variant="contained" endIcon={<SendIcon/>} onClick={handleSendMessage}>
            Send
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
