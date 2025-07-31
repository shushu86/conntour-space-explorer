const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 8001;
app.use(cors());
app.use(express.json()); 

const historyPath = path.join(__dirname, 'data', 'SearchHistory.json');
const history = fs.readFileSync(historyPath, 'utf8');
const parsedHistory = !history.trim() ? [] : JSON.parse(history);
    
app.get('/api/sources', (req, res) => {
  const dataPath = path.join(__dirname, 'data', 'mock_data.json');
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data:', err);
      return res.status(500).json({ error: 'Failed to read data' });
    }
    try {
      const jsonData = JSON.parse(data);
      const items = jsonData.collection.items;
      const query = req.query.q;
      if (!query) {
        return res.json(items);
      }
      const keywords = query.split(/[ ,]+/).map(k => k.trim().toLowerCase()).filter(k => k.length > 0);
      
      if (keywords.length === 0) {
        return res.json([]);
      }
      
      const scored = items.map(item => {
        const description = item.data && item.data[0] && item.data[0].description ? item.data[0].description.toLowerCase() : '';
        const itemKeywords = item.data && item.data[0] && item.data[0].keywords ? item.data[0].keywords : [];
        
        let score = 0;
        let matchedKeywords = 0;
        
        keywords.forEach(searchKeyword => {
          if (searchKeyword.length < 3) return;
          
          const descriptionWords = description.split(/\s+/).map(word => 
            word.replace(/[^\w]/g, '').toLowerCase()
          );
          const hasDescriptionMatch = descriptionWords.includes(searchKeyword);
          
          if (hasDescriptionMatch) {
            score++;
            matchedKeywords++;
          }
          
          const hasKeywordMatch = itemKeywords.some(itemKeyword => {
            const itemKeywordLower = itemKeyword.toLowerCase();
            const itemKeywordWords = itemKeywordLower.split(/[,\s]+/).map(word => 
              word.replace(/[^\w]/g, '').toLowerCase()
            );
            return itemKeywordWords.includes(searchKeyword);
          });
          
          if (hasKeywordMatch) {
            score += 2;
            matchedKeywords++;
          }
        });
        
        return { ...item, score, matchedKeywords };
      }).filter(item => item.score > 0 && item.matchedKeywords > 0)
        .sort((a, b) => b.score - a.score);
      res.json(scored);
    } catch (parseErr) {
      console.error('Error parsing:', parseErr);
      res.status(500).json({ error: 'Failed to parse data' });
    }
  });
});

app.post('/api/insert-search-history', (req, res) => {
  const { query } = req.body;
  
  try {
    let history = [];
    
    if (fs.existsSync(historyPath)) {
      const historyData = fs.readFileSync(historyPath, 'utf8');
      if (historyData.trim()) {
        history = JSON.parse(historyData);
      }
    }

    const queryExists = history.some(item => 
      item.query.toLowerCase() === query.toLowerCase()
    );

    if (!queryExists) {
      const newEntry = {
        id: uuidv4(),
        query: query,
        timestamp: new Date().toISOString(),
      };
      history.unshift(newEntry);
      
      fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
      res.json({ message: 'Search history saved', id: newEntry.id, query: query });
    } else {
      res.json({ message: 'Query already exists in history', query: query });
    }
  } catch (error) {
    console.error('Error saving search history:', error);
    res.status(500).json({ error: 'Failed to save search history' });
  }
});

app.get('/api/get-search-history', (req, res) => {
  try {
    
    if (!Array.isArray(parsedHistory) || parsedHistory.length === 0) {
      return res.json([]);
    }
    
    res.json(parsedHistory);
  } catch (error) {
    console.error('Error reading search history:', error);
    res.json([]);
  }
});

app.delete('/api/delete-search-history', (req, res) => {
  const { id } = req.body;    
  const filteredHistory = parsedHistory.filter(item => item.id !== id);
  fs.writeFileSync(historyPath, JSON.stringify(filteredHistory, null, 2));
  res.json({ message: 'Search history deleted' });
});

app.listen(PORT, () => {
  console.log(`Node backend running at http://localhost:${PORT}`); 
}); 