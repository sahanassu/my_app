const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

// Define a Mongoose schema and model
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
});

const Item = mongoose.model('Item', itemSchema);

// Routes
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/api/items', async (req, res) => {
  try {
    const existingItem = await Item.findOne({ name: req.body.name });
    if (existingItem) {
      return res.status(400).json({ message: 'Name already exists' });
    }
    const newItem = new Item(req.body);
    await newItem.save();
    res.json(newItem);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put('/api/items/:id', async (req, res) => {
  try {
    const existingItem = await Item.findOne({ name: req.body.name, _id: { $ne: req.params.id } });
    if (existingItem) {
      return res.status(400).json({ message: 'Name already exists' });
    }
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete('/api/items/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/api/items/check-name', async (req, res) => {
  try {
    const existingItem = await Item.findOne({ name: req.body.name, _id: { $ne: req.body._id } });
    if (existingItem) {
      return res.status(400).json({ message: 'Name already exists' });
    }
    res.json({ message: 'Name is available' });
  } catch (error) {
    res.status(500).send(error);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
