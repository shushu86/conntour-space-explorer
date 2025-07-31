import React from 'react';
import { Card } from 'antd';
import './SearchResultsItems.scss';
const { Meta } = Card;

type SearchResultsItemsProps = {
    id: string;
    title: string;
    description: string;
    href: string;
    date: string;
    href_full: string;
}

const SearchResultsItems: React.FC<SearchResultsItemsProps> = ({title, description, href, date, href_full}) => {

    return (
        <Card
            hoverable
            className="search-result-card"
            cover={<div className="card-cover"><img src={href} className="card-image" /></div>}
            onClick={() => window.open(href_full, '_blank')}
        >
            <Meta 
                title={
                    <div className="card-title">
                        {title}
                    </div>
                }
                description={
                    <div className="card-description">
                        <div className="card-date">
                            {date}
                        </div>
                        <div className="card-description-text">
                            {description}
                        </div>
                    </div>
                } 
            />
        </Card>
    );
}

export default SearchResultsItems;