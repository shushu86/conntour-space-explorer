import React, { useEffect, useState } from 'react';
import { Flex } from 'antd';
import SearchBar from './components/header/SearchBar';
import SearchHistory from './components/sidebar/SearchHistory';
import './App.scss';
import { SearchResultsItemsList } from './components/body/SearchResultsItemsList';
import axios from 'axios';


interface ImageData {
  center: string;
  date_created: string;
  description: string;
  description_508?: string;
  keywords: string[];
  media_type: string;
  nasa_id: string;
  secondary_creator?: string;
  title: string;
  location?: string;
  photographer?: string;
  album?: string[];
}

interface ImageLink {
  href: string;
  rel: string;
  render: string;
  width?: number;
  height?: number;
  size?: number;
}

interface ImageItem {
  id: string;
  href: string;
  data: ImageData[];
  links: ImageLink[];
}

const App: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [searchHistory, setSearchHistory] = useState<any[]>([]);
  const [searchFromHistory, setSearchFromHistory] = useState<string>('');
  
  const handleGetSearchHistory = async () => {
    try {
        const response = await axios.get('http://localhost:8001/api/get-search-history');
        const data = response.data;
        setSearchHistory(data);
        console.log(data);
    } catch (error) {
        console.error('Error fetching search history:', error);
    }
  };

  useEffect(() => {
    handleGetSearchHistory();
  }, []);

  return (
    <div className="app-container">
      <div className="app-layout">
        <SearchHistory searchHistory={searchHistory || []} setSearchHistory={setSearchHistory} setSearchFromHistory={setSearchFromHistory} />
        <div className="main-content">
          <Flex vertical gap="large" align='center'>
            <Flex justify='center'  align='center'  gap='large' className="header-container">
              <div className="responsive-title">Conntour - NASA Image Search</div>
              <SearchBar setImages={setImages} setSearchHistory={setSearchHistory} searchHistory={searchHistory || []} searchFromHistory={searchFromHistory} />
            </Flex>
            <SearchResultsItemsList images={images} />          
          </Flex>
        </div>
      </div>
    </div>
  );
};

export default App; 