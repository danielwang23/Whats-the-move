// server.js
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// app.post('/save', (req, res) => {
//   const data = req.body;

//   // Read the existing data from responses.json
//   fs.readFile('responses.json', (err, fileData) => {
//     if (err && err.code !== 'ENOENT') return res.status(500).send('Error reading file');

//     const responses = fileData ? JSON.parse(fileData) : [];
//     responses.push(data);

//     // Write the updated data back to responses.json
//     fs.writeFile('responses.json', JSON.stringify(responses, null, 2), (err) => {
//       if (err) return res.status(500).send('Error saving data');
//       res.send('Data saved successfully');
//     });
//   });
// });

app.post('/save', (req, res) => {
  const data = req.body;
  console.log("Received data:", data);  // Log received data

  fs.readFile('responses.json', (err, fileData) => {
      if (err && err.code !== 'ENOENT') {
          console.error("Error reading file:", err);
          return res.status(500).send('Error reading file');
      }

      const responses = fileData ? JSON.parse(fileData) : [];
      responses.push(data);

      fs.writeFile('responses.json', JSON.stringify(responses, null, 2), (err) => {
          if (err) {
              console.error("Error saving data:", err);
              return res.status(500).send('Error saving data');
          }
          console.log("Data saved successfully");
          res.send('Data saved successfully');
      });
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));