
import React, { useState } from 'react';
import { Form, Input, Button, Select, DatePicker, Table, Space, Card, Row, Col, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { TaskRow, TeamActivityFormData } from '../types';

// Ensure dayjs plugins are loaded
import customParseFormat from 'dayjs/plugin/customParseFormat';
import advancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);

const { Option } = Select;

const TeamActivity: React.FC = () => {
  const [form] = Form.useForm();
  const [tasks, setTasks] = useState<TaskRow[]>([
    {
      id: 1,
      mainTask: '',
      subTask: '',
      todayTask: '',
      resourceName: '',
      phaseAndSprint: '',
      status: '',
      taskStartDate: dayjs(),
      taskEndDate: dayjs().add(7, 'day'),
      comments: ''
    }
  ]);

  const mainTaskOptions = [
    'Development',
    'Testing',
    'Design',
    'Documentation',
    'Planning'
  ];

  const subTaskOptions = [
    'Frontend Development',
    'Backend Development',
    'API Integration',
    'Unit Testing',
    'Integration Testing',
    'UI Design',
    'UX Research'
  ];

  const resourceOptions = [
    'John Doe',
    'Jane Smith',
    'Mike Johnson',
    'Sarah Wilson',
    'David Brown'
  ];

  const phaseOptions = [
    'Phase 1 - Sprint 1',
    'Phase 1 - Sprint 2',
    'Phase 2 - Sprint 1',
    'Phase 2 - Sprint 2'
  ];

  const statusOptions = [
    'Not Started',
    'In Progress',
    'Completed',
    'Blocked',
    'On Hold'
  ];

  const products = [
    'Product1',
    'Product2',
    'Product3'
  ];

  const addTaskRow = () => {
    const newTask: TaskRow = {
      id: tasks.length + 1,
      mainTask: '',
      subTask: '',
      todayTask: '',
      resourceName: '',
      phaseAndSprint: '',
      status: '',
      taskStartDate: dayjs(),
      taskEndDate: dayjs().add(7, 'day'),
      comments: ''
    };
    setTasks([...tasks, newTask]);
  };

  const removeTaskRow = (id: number) => {
    if (tasks.length > 1) {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const updateTask = (id: number, field: keyof TaskRow, value: any) => {
    setTasks(tasks.map(task => 
      task.id === id ? { 
        ...task, 
        [field]: (field === 'taskStartDate' || field === 'taskEndDate') 
          ? (value && dayjs.isDayjs(value) ? value : dayjs()) 
          : value 
      } : task
    ));
  };

  const onSubmit = (values: any) => {
    const formData: TeamActivityFormData = {
      ...values,
      tasks: tasks
    };
    console.log('Team Activity Data:', formData);
    message.success('Team activity submitted successfully!');
  };

  const columns = [
    {
      title: 'Main Task',
      dataIndex: 'mainTask',
      key: 'mainTask',
      width: 150,
      render: (text: string, record: TaskRow) => (
        <Select
          value={record.mainTask}
          onChange={(value) => updateTask(record.id, 'mainTask', value)}
          style={{ width: '100%' }}
          placeholder="Select main task"
        >
          {mainTaskOptions.map(option => (
            <Option key={option} value={option}>{option}</Option>
          ))}
        </Select>
      )
    },
    {
      title: 'Sub Task',
      dataIndex: 'subTask',
      key: 'subTask',
      width: 180,
      render: (text: string, record: TaskRow) => (
        <Select
          value={record.subTask}
          onChange={(value) => updateTask(record.id, 'subTask', value)}
          style={{ width: '100%' }}
          placeholder="Select sub task"
        >
          {subTaskOptions.map(option => (
            <Option key={option} value={option}>{option}</Option>
          ))}
        </Select>
      )
    },
    {
      title: 'Today Task',
      dataIndex: 'todayTask',
      key: 'todayTask',
      width: 200,
      render: (text: string, record: TaskRow) => (
        <Input
          value={record.todayTask}
          onChange={(e) => updateTask(record.id, 'todayTask', e.target.value)}
          placeholder="Enter today's task"
        />
      )
    },
    {
      title: 'Resource',
      dataIndex: 'resourceName',
      key: 'resourceName',
      width: 140,
      render: (text: string, record: TaskRow) => (
        <Select
          value={record.resourceName}
          onChange={(value) => updateTask(record.id, 'resourceName', value)}
          style={{ width: '100%' }}
          placeholder="Select resource"
        >
          {resourceOptions.map(option => (
            <Option key={option} value={option}>{option}</Option>
          ))}
        </Select>
      )
    },
    {
      title: 'Phase & Sprint',
      dataIndex: 'phaseAndSprint',
      key: 'phaseAndSprint',
      width: 160,
      render: (text: string, record: TaskRow) => (
        <Select
          value={record.phaseAndSprint}
          onChange={(value) => updateTask(record.id, 'phaseAndSprint', value)}
          style={{ width: '100%' }}
          placeholder="Select phase"
        >
          {phaseOptions.map(option => (
            <Option key={option} value={option}>{option}</Option>
          ))}
        </Select>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (text: string, record: TaskRow) => (
        <Select
          value={record.status}
          onChange={(value) => updateTask(record.id, 'status', value)}
          style={{ width: '100%' }}
          placeholder="Select status"
        >
          {statusOptions.map(option => (
            <Option key={option} value={option}>{option}</Option>
          ))}
        </Select>
      )
    },
    {
      title: 'Start Date',
      dataIndex: 'taskStartDate',
      key: 'taskStartDate',
      width: 140,
      render: (text: string, record: TaskRow) => (
        <DatePicker
          value={record.taskStartDate && dayjs.isDayjs(record.taskStartDate) ? record.taskStartDate : null}
          onChange={(date) => updateTask(record.id, 'taskStartDate', date)}
          style={{ width: '100%' }}
        />
      )
    },
    {
      title: 'End Date',
      dataIndex: 'taskEndDate',
      key: 'taskEndDate',
      width: 140,
      render: (text: string, record: TaskRow) => (
        <DatePicker
          value={record.taskEndDate && dayjs.isDayjs(record.taskEndDate) ? record.taskEndDate : null}
          onChange={(date) => updateTask(record.id, 'taskEndDate', date)}
          style={{ width: '100%' }}
        />
      )
    },
    {
      title: 'Comments',
      dataIndex: 'comments',
      key: 'comments',
      width: 200,
      render: (text: string, record: TaskRow) => (
        <Input.TextArea
          value={record.comments}
          onChange={(e) => updateTask(record.id, 'comments', e.target.value)}
          placeholder="Enter comments"
          rows={2}
        />
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      fixed: 'right' as const,
      render: (text: string, record: TaskRow) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeTaskRow(record.id)}
          disabled={tasks.length === 1}
        />
      )
    }
  ];

  return (
    <div style={{ 
      padding: '24px', 
      backgroundColor: '#f5f5f5', 
      minHeight: 'calc(100vh - 64px)',
      width: '100%',
      overflow: 'auto'
    }}>
      <Card 
        title="Team Activity" 
        style={{ 
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: '8px',
          width: '100%'
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onSubmit}
          initialValues={{
            date: dayjs(),
            workingResources: 1,
            selectedProduct: ''
          }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item
                label="Date"
                name="date"
                rules={[{ required: true, message: 'Please select date!' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                label="Working Resources"
                name="workingResources"
                rules={[{ required: true, message: 'Please enter working resources!' }]}
              >
                <Input type="number" min={1} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                label="Selected Product"
                name="selectedProduct"
              >
                <Select placeholder="Select product">
                  {products.map(product => (
                    <Option key={product} value={product}>{product}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card 
        title="Tasks" 
        style={{ 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: '8px'
        }}
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={addTaskRow}
            style={{ borderRadius: '6px' }}
          >
            Add Task
          </Button>
        }
      >
        <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
          <Table
            columns={columns}
            dataSource={tasks}
            rowKey="id"
            pagination={false}
            scroll={{ x: 1400 }}
            size="small"
            bordered
            style={{ minWidth: '1400px' }}
          />
        </div>
        
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Button 
            type="primary" 
            size="large"
            onClick={() => form.submit()}
            style={{ 
              borderRadius: '6px',
              paddingLeft: '32px',
              paddingRight: '32px',
              height: '40px'
            }}
          >
            Submit Team Activity
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default TeamActivity;
