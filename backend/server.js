const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));


app.use('/api/auth', require('./routes/auth'));
app.use('/api/devices', require('./routes/devices'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/alerts', require('./routes/alerts'));

app.get('/', (req, res) => {
    res.send('Smart Energy Dashboard API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
