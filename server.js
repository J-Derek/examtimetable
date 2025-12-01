const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Load exam data into memory
let examData = [];
const DATA_FILE = path.join(__dirname, 'exam_data.json');

try {
    if (fs.existsSync(DATA_FILE)) {
        const rawData = fs.readFileSync(DATA_FILE, 'utf8');
        examData = JSON.parse(rawData);
        console.log(`Loaded ${examData.length} exams.`);
    } else {
        console.error("exam_data.json not found!");
    }
} catch (error) {
    console.error("Error loading exam data:", error);
}

// API Endpoint
app.get('/api/timetable', (req, res) => {
    const { search } = req.query;
    
    if (!search) {
        return res.json(examData);
    }

    const query = search.toLowerCase();
    const filtered = examData.filter(exam => 
        exam.courseCode.toLowerCase().includes(query) ||
        exam.venue.toLowerCase().includes(query)
    );
    
    res.json(filtered);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
