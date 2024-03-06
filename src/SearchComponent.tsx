import React, { useState } from 'react';
import { Input, Button, Table, Row, Col, Space, Select, Radio, Modal, Form, message } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
const API_URL = process.env.REACT_APP_API_URL 

interface SearchResult {
  key: React.Key;
  title: string;
  paragraph: string;
  similarity: number;
}
const SearchComponent: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [collection, setCollection] = useState<string>('business');
  const [limit, setLimit] = useState<string>('10');
  const [results, setResults] = useState<SearchResult[]>([]);

  const [selectedRowKey, setSelectedRowKey] = useState<React.Key | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rating, setRating] = useState<string>('');

  const [hasSearched, setHasSearched] = useState(false); // To track if search has been performed
  const [hasRated, setHasRated] = useState(false); // To track whether user has rated


  const accessToken = localStorage.getItem('accessToken');
  const username = localStorage.getItem('username');
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('accessToken'); // Clear the access token from localStorage
    localStorage.removeItem('username'); // Optionally clear the username or any other stored user info
    navigate('/login'); // Redirect to login page
  };


  const fetchResults = async () => {
    if (!hasSearched || hasRated) { // Allow searching if not searched before, or after rating is submitted
      try {
        const response = await fetch(`${API_URL}api/search?q=${query}&collection=${collection}&limit=${limit}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
            'Authorization':`Bearer ${accessToken}`
          },
        });
        
        var data = await response.json();
        console.log(data);
        const formattedResults: SearchResult[] = data.results.map((item: any, index: number) => ({
          key: index,
          title: item[0].title,
          paragraph: item[0].paragraph,
          similarity: item[1],
        }));
        setResults(formattedResults);
        setHasSearched(true); // Mark that a search has been performed
        setHasRated(false); // Reset the rating submission flag for the new search
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };


  const columns: (ColumnGroupType<SearchResult> | ColumnType<SearchResult>)[] = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Paragraph',
      dataIndex: 'paragraph',
      key: 'paragraph',
    },
    {
      title: 'Similarity Score',
      dataIndex: 'similarity',
      key: 'similarity',
      render: (similarity: number) => `${similarity.toFixed(2)}`,
      responsive: ['sm'] as const,
    },
    {
      title: 'Select',
      dataIndex: 'select',
      key: 'select',
      render: (_, record: SearchResult) => (
        <Radio
        checked={record.key === selectedRowKey}
        onChange={() => handleSelectRow(record.key)}
          
        />
      ),
    },
  ];
  const onRatingChange = (value: string) => {
    if (value) {
      setRating(value)
    }
  };
  const handleSelectRow = (key: React.Key) => {
    if (!hasRated) { // Allow selecting a row for rating if not rated yet
      setSelectedRowKey(key);
      setIsModalVisible(true);
    }
  };
 


  const handleOk = async () => {
    // Ensure a rating is selected before proceeding
    if (!rating) {
      message.error("Please select a rating before submitting."); // Using Ant Design's message for a better user experience than alert
      return;
    }
  
    // Prevent submitting a rating more than once before a new search
    if (hasRated) {
      message.warning("You've already submitted a rating for this search.");
      return;
    }
  
    const dataToSend = {
      username, 
      query,
      results: results.map(result => result.title), // Send only the titles of the results
      selectedResult: results.find(result => result.key === selectedRowKey)?.title, // Send the title of the selected result
      rating,
    };
  
    try {
      const response = await fetch(`${API_URL}submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8',  
        'ngrok-skip-browser-warning': 'true', 
        'Authorization':`Bearer ${accessToken}`
      },
        body: JSON.stringify(dataToSend),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      // Assuming you process the response in some way
      const responseData = await response.json();
      console.log(responseData); // Log or handle the response data as needed
  
      message.success("Data submitted successfully");
      setHasRated(true); // Mark that a rating has been submitted
      setHasSearched(false); // Reset to allow a new search
      setIsModalVisible(false);
      setRating('');
      setSelectedRowKey(null);
    } catch (error) {
      console.error('Error submitting data:', error);
      message.error("Failed to submit data");
      setHasRated(true); // Mark that a rating has been submitted
      setHasSearched(false); // Reset to allow a new search
      setIsModalVisible(false);
      setRating('');
      setSelectedRowKey(null);
    }
  };
  

  const handleCancel = () => {
    setIsModalVisible(false);
    setRating('');
  };
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResults();
  };

  const baseWidth = 100; // Base width in pixels
  const maxWidth = 600; // Maximum width in pixels
  const minWidth = 50; // Minimum width in pixels
  const widthPerChar = 10; // Additional width per character
  const inputWidth = Math.min(Math.max(minWidth, baseWidth + query.length * widthPerChar), maxWidth);

return (
  <>
      <Row justify="center" style={{ paddingTop: '5px',paddingBottom: '30px', backgroundColor:'rgb(68, 66, 66)' }}>
        <Col>
          <Space direction="horizontal" size="middle" style={{ display: 'flex', justifyContent: 'center', backgroundColor:'rgb(68, 66, 66)' }}>
            <form onSubmit={handleSearch}>
             <Select
                defaultValue="business"
                style={{ width: 150, marginRight: '10px', marginTop: '5px' }}
                onChange={(value) => setCollection(value)}
              >
                <Select.Option value="business">Business</Select.Option>
                <Select.Option value="sports">Sports</Select.Option>
                <Select.Option value="entertainment">Entertainment</Select.Option>
                <Select.Option value="politics.en">Politics(Eng)</Select.Option>

              </Select>
              <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                style={{width: `${inputWidth}px`, marginRight: '10px', marginTop: '5px' }}
              />
               <Input
                type="number"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                placeholder="Limit"
                style={{ width:'5rem', marginRight:'15px', marginTop: '5px' }}
              />
         {
  (!hasSearched || hasRated) && (
    <Button type="primary" style={{ marginTop: '10px' }} htmlType="submit">
      Search
    </Button>
  )
}
            </form>
          </Space>
        </Col>
      </Row>
      <Table style={{ padding: ' 0 80px 80px 80px', backgroundColor:'rgb(68, 66, 66)' }} size = 'middle' columns={columns} dataSource={results}   pagination={{ pageSize: parseInt(limit) }} />

      <Modal title="Please select a rating" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
  <Form.Item label="Rating"  rules={[{ required: true, message: 'Please select a rating!' }]}
>
<Select
          onChange={onRatingChange}
          value={rating}

          allowClear
        >
          <Option value="very_poor">Very poor</Option>
          <Option value="poor">Poor</Option>
          <Option value="neutral">Neutral</Option>
          <Option value="good">Good</Option>
          <Option value="very_good">Very Good</Option>

        </Select>
  </Form.Item>
</Modal>
<Button type="primary" onClick={handleLogout} style={{ margin: '20px 0' }}>
    Logout
  </Button>
    </>
);
};

export default SearchComponent;
