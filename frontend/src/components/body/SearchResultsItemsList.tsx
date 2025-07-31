import { Row, Col, Flex, Pagination } from "antd";
import { useState } from "react";
import SearchResultsItems from "./SearchResultsItems";
import "./SearchResultsItemsList.scss";

export const SearchResultsItemsList = (props: any) => {
  const { images } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentImages = images.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    images.length > 0 ? (
      <>
        <Row gutter={[16, 16]} className="images-grid">
          {currentImages.map((image: any, index: any) => {
            const imageData = image.data[0];
            const imageUrl = image.links.find((link: any) => link.rel === 'preview')?.href || '';
            
            return (
              <Col xs={24} sm={12} md={8} lg={6} xl={6} key={image.id}>
                <div className="image-card-wrapper">
                  <SearchResultsItems
                    id={image.id}
                    title={imageData.title}
                    description={imageData?.description}
                    href={imageUrl}
                    date={new Date(imageData?.date_created).toLocaleDateString()}
                    href_full={image.links.find((link: any) => link.rel === 'alternate')?.href || ''}
                  />
                </div>
              </Col>
            );
          })}
        </Row>
        <Flex justify="center">
          <Pagination
            current={currentPage}
            total={images.length}
            pageSize={pageSize}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </Flex>
      </>
    ) : (
      <Flex vertical gap="large" align='center' className="no-images-container">
        <div className="no-images-message">No images to show</div>
      </Flex>
    )
  );
};