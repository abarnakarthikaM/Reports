
import React, { useState } from 'react';
import { Card, Select, Checkbox, Button, Space, List, Typography, Row, Col } from 'antd';
import { useCurrentDate } from '../hooks/useCurrentDate';
import type { Product, Task, PlanDetails } from '../types';

const { Option } = Select;
const { Title, Text } = Typography;

const VallarchiPlan: React.FC = () => {
  const { getFormattedDateShort } = useCurrentDate();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [planDetails, setPlanDetails] = useState<PlanDetails | null>(null);

  const products: Product[] = [
    { id: '1', name: 'Product A' },
    { id: '2', name: 'Product B' },
    { id: '3', name: 'Product C' }
  ];

  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Multicity development', completed: true },
    { id: '2', title: 'Flight flow responsive development', completed: false },
    { id: '3', title: 'List page revamp', completed: true },
    { id: '4', title: 'API Migration', completed: false }
  ]);

  const onProductChange = (productId: string) => {
    const product = products.find(p => p.id === productId) || null;
    setSelectedProduct(product);
    loadProductDetails(product);
  };

  const loadProductDetails = (product: Product | null) => {
    if (product) {
      setPlanDetails({
        tasks: [
          'Multicity development 80% completed',
          'List page revamp integrates'
        ]
      });
    } else {
      setPlanDetails(null);
    }
  };

  const onTaskChange = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const onSubmitAndView = () => {
    console.log('Submit and view clicked');
    // Handle submit and view action
  };

  const onSendToManager = () => {
    console.log('Send to manager clicked');
    // Handle send to manager action
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card title="Vallarchi Plan" style={{ marginBottom: '24px' }}>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Title level={4}>Date: {getFormattedDateShort()}</Title>
          </Col>
          <Col xs={24} sm={12}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>Select Product:</Text>
              <Select
                style={{ width: '100%' }}
                placeholder="Choose a product"
                onChange={onProductChange}
                value={selectedProduct?.id}
              >
                {products.map(product => (
                  <Option key={product.id} value={product.id}>
                    {product.name}
                  </Option>
                ))}
              </Select>
            </Space>
          </Col>
        </Row>
      </Card>

      {planDetails && (
        <Card title="Product Details" style={{ marginBottom: '24px' }}>
          <List
            dataSource={planDetails.tasks}
            renderItem={(task) => (
              <List.Item>
                <Text>{task}</Text>
              </List.Item>
            )}
          />
        </Card>
      )}

      <Card title="Tasks" style={{ marginBottom: '24px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          {tasks.map(task => (
            <Checkbox
              key={task.id}
              checked={task.completed}
              onChange={() => onTaskChange(task.id)}
            >
              {task.title}
            </Checkbox>
          ))}
        </Space>
      </Card>

      <Card>
        <Space>
          <Button type="primary" onClick={onSubmitAndView}>
            Submit and View
          </Button>
          <Button onClick={onSendToManager}>
            Send to Manager
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default VallarchiPlan;
