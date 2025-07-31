import React from 'react';
import { Menu } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import './SearchHistory.scss';

interface SearchHistoryProps {
  searchHistory: any[];
  setSearchHistory: React.Dispatch<React.SetStateAction<any[]>>;
  setSearchFromHistory: React.Dispatch<React.SetStateAction<string>>;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({ searchHistory, setSearchHistory, setSearchFromHistory }) => {
  const handleDeleteHistory = async (id: string) => {
    try {
        await axios.delete('http://localhost:8001/api/delete-search-history', { data: { id } });
        setSearchHistory(searchHistory.filter((item: any) => item.id !== id));
      } catch (error) {
        console.error('Error deleting search history:', error);
    }
  };

  const handleSearchHistoryClick = (query: string) => {
    setSearchFromHistory(query);
  };

  const menuItems = searchHistory.map((item) => ({
    key: item.id || item.query || item,
    label: <div className="search-history-item" onClick={() => handleSearchHistoryClick(item.query)}>
            <DeleteOutlined onClick={() => handleDeleteHistory(item.id)} /> {item.query || item}
            </div>,
  }));

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <h3>Search History</h3>
        <Menu
          className="search-history-menu"
          mode="vertical"
          items={menuItems}
        />
      </div>
    </div>
  );
};

export default SearchHistory; 