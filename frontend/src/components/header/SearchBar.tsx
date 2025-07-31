import React, { useEffect, useState } from 'react';
import { Input } from 'antd';
import axios from 'axios';
import './SearchBar.scss';

interface SearchBarProps {
  setImages: (images: any[]) => void;
  setSearchHistory: React.Dispatch<React.SetStateAction<any[]>>;
  searchHistory: any[];
  searchFromHistory: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ setImages, setSearchHistory, searchHistory, searchFromHistory }) => {
  const [searchKeyword, setSearchKeyword] = useState('');

  const fetchSources = async (keyword: string, isFromHistory: boolean = false) => {
    try {
      if(keyword.trim() === '') {
        return;
      }
      const response = await axios.get(`http://localhost:8001/api/sources?q=${encodeURIComponent(keyword)}`);
      const items = response.data;
      setImages(items);
      if (!isFromHistory) {
        handleInsertSearchHistory();
      }
    } catch (error) {
      console.error('Error fetching sources:', error);
    }
  };

  const handleInsertSearchHistory = async () => {
    try {
        const response = await axios.post('http://localhost:8001/api/insert-search-history', { query: searchKeyword });
        if (response.data.id) {
            setSearchHistory((prevHistory: any[]) => [...prevHistory, { id: response.data.id, query: response.data.query }]);
        }
    } catch (error) {
        console.error('Error inserting search history:', error);
    }
  };

  useEffect(() => {
    setSearchKeyword(searchFromHistory);
    if (searchFromHistory && searchFromHistory.trim()) {
      fetchSources(searchFromHistory, true);
    }
  }, [searchFromHistory]);  

  return (
    <Input
      className="search-bar-autocomplete"
      placeholder="Search for images"
      value={searchKeyword}
      onChange={(e) => setSearchKeyword(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          fetchSources(searchKeyword);
        }
      }}
      autoFocus
    />
  );
};

export default SearchBar;