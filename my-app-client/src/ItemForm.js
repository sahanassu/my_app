import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Row, Col, message, Spin } from 'antd';
import axios from 'axios';

const ItemForm = ({ item, onFormSubmit, isAuthorized, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      form.setFieldsValue(item);
    } else {
      form.resetFields();
    }
  }, [item, form]);

  const checkNameUnique = async (name) => {
    try {
      const response = await axios.post('http://localhost:5000/api/items/check-name', { name, _id: item?._id });
      return response.data.message === 'Name is available';
    } catch (error) {
      return false;
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    const isUnique = await checkNameUnique(values.name);
    if (!isUnique) {
      message.error('Name already exists');
      setLoading(false);
      return;
    }
    await onFormSubmit({ ...values, _id: item?._id });
    form.resetFields();
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '600px', padding: '20px' }}>
      <Spin spinning={loading}>
        <Form form={form} layout="horizontal" onFinish={onFinish} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item
                label={<strong>Name</strong>}
                name="name"
                rules={[
                  { required: true, message: 'Please input the name!' },
                  () => ({
                    async validator(_, value) {
                      if (await checkNameUnique(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Name already exists'));
                    },
                  }),
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item
                label={<strong>Description</strong>}
                name="description"
                rules={[{ required: isAuthorized, message: 'Please input the description!' }]}
              >
                <Input disabled={!isAuthorized} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item
                label={<strong>Quantity</strong>}
                name="quantity"
                rules={[{ required: isAuthorized, message: 'Please input the quantity!' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} disabled={!isAuthorized} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item wrapperCol={{ span: 24 }}>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: 'blue', borderColor: 'blue', marginRight: '10px' }}>
              Update
            </Button>
            <Button onClick={onCancel} style={{ borderColor: 'blue' }}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default ItemForm;
