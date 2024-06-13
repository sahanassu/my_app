import React, { useState, useEffect } from 'react';
import { Button, message, Card, Typography, Row, Col } from 'antd';
import axios from 'axios';
import ItemForm from './ItemForm';

const { Text } = Typography;

const App = () => {
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(true); // Assuming true for demonstration
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/items');
      setItems(response.data);
      if (response.data.length > 0) {
        setCurrentItem(response.data[0]); // Display the first item initially
      }
    } catch (error) {
      message.error('Failed to fetch items');
    }
  };

  const handleFormSubmit = async (item) => {
    try {
      if (item._id) {
        await axios.put(`http://localhost:5000/api/items/${item._id}`, item);
        message.success('Item updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/items', item);
        message.success('Item created successfully');
      }
      fetchItems();
      setEditMode(false);
    } catch (error) {
      message.error('Failed to submit item');
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      {editMode ? (
        <ItemForm 
          item={currentItem} 
          onFormSubmit={handleFormSubmit} 
          isAuthorized={isAuthorized}
          onCancel={handleCancel}
        />
      ) : currentItem ? (
        <Card style={{ padding: '20px', maxWidth: '600px' }}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Row gutter={[16, 16]}>
                <Col span={6}>
                  <Text strong>Name:</Text>
                </Col>
                <Col span={18}>
                  <Text>{currentItem.name}</Text>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row gutter={[16, 16]}>
                <Col span={6}>
                  <Text strong>Description:</Text>
                </Col>
                <Col span={18}>
                  <Text>{currentItem.description}</Text>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row gutter={[16, 16]}>
                <Col span={6}>
                  <Text strong>Quantity:</Text>
                </Col>
                <Col span={18}>
                  <Text>{currentItem.quantity}</Text>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Button 
                type="primary" 
                onClick={handleEdit} 
                style={{ backgroundColor: 'blue', borderColor: 'blue' }}
              >
                Edit Details
              </Button>
            </Col>
          </Row>
        </Card>
      ) : (
        <p>No items to display</p>
      )}
    </div>
  );
};

export default App;
