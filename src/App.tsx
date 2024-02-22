import React, {useState, useEffect} from 'react';
import {
  Grid,
  TextField,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem, SelectChangeEvent
} from '@mui/material';
import './App.css';
import MarkdownDisplay from "./MarkdownDisplay";

function App() {
  const [document, setDocument] = useState<string>(''); // Explicitly type as string
  const [chatHistory, setChatHistory] = useState<{ message: string; type: string }[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>(''); // Explicitly type as string
  const [documentID, setDocumentID] = useState<string>('customer_info');

  const handleChange = (event: SelectChangeEvent) => {
    const d = event.target.value as string;
    console.log("---------------", d);
    setDocumentID(d);
  };
  useEffect(() => {
    const pollMessages = () => {
      fetch('http://127.0.0.1:5002/chat')
        .then(response => response.json())
        .then(data => {
          if (data.status === 'new') {
            setChatHistory(prev => [...prev, {message: data.chat, type: 'received'}]);
          }
        })
        .catch(error => console.error('Error fetching chat messages:', error));

      fetch('http://127.0.0.1:5002/document/' + documentID)
        .then(response => response.json())
        .then(data => {
          // console.log(data);
          if (data.status === 'ok') {
            setDocument(data.content);
          }
        })
        .catch(error => console.error('Error fetching chat messages:', error));
    };

    const timerId = setInterval(pollMessages, 1000); // Poll every 1 second

    return () => clearInterval(timerId); // Clean up the timer when the component is unmounted
  }, [documentID]); // Empty dependency array means this effect runs once on mount and then cleans up on unmount


  const handleSendMessage = () => {
    // Prepare the message in the format expected by your Flask backend
    const data = {message: currentMessage}; // Adjust this according to your backend requirements

    // Perform the POST request to the Flask API
    fetch('http://127.0.0.1:5002/chat', {
      method: 'POST', // Specify the method
      headers: {
        'Content-Type': 'application/json', // Specify the content type
      },
      body: JSON.stringify(data), // Convert the JavaScript object to a JSON string
    })
      .then(response => response.json()) // Convert the response to JSON
      .then(data => {
        console.log('Success:', data);
        // Optionally, update the UI or state based on the response
        // For example, you might want to clear the currentMessage state or add the message to chatHistory as a 'sent' message
        setChatHistory(prev => [...prev, {message: currentMessage, type: 'sent'}]);
        console.log(chatHistory);
        setCurrentMessage('');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };


  return (
    <div className="App">
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Document</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={documentID}
              label="Age"
              onChange={handleChange}
            >
              <MenuItem value={'customer_info'}>User Info Document</MenuItem>
              <MenuItem value={'usecases'}>Use-cases Document</MenuItem>
              <MenuItem value={'srs'}>SRS Document</MenuItem>
            </Select>
          </FormControl>

          <MarkdownDisplay markdownText={document}/>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h6" gutterBottom>
            Chat Conversation
          </Typography>
          <Paper style={{padding: '20px', height: '70vh', overflow: 'auto'}}>
            <List>
              {chatHistory.map((item, index) => (
                <ListItem key={index}
                          style={{display: 'flex', flexDirection: item.type === 'sent' ? 'row-reverse' : 'row'}}>
                  <Paper className={item.type === 'sent' ? 'message-sent' : 'message-received'}>
                    <ListItemText primary={item.message}/>
                  </Paper>
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
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
