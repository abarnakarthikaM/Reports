
import React, { useState } from 'react';
import { Form, Input, Button, Select, DatePicker, Table, Space, Card, Row, Col, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { TaskRow, TeamActivityFormData } from '../types';

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
      taskStartDate: dayjs().format('YYYY-MM-DD'),
      taskEndDate: dayjs().add(7, 'day').format('YYYY-MM-DD'),
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
      taskStartDate: dayjs().format('YYYY-MM-DD'),
      taskEndDate: dayjs().add(7, 'day').format('YYYY-MM-DD'),
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
      task.id === id ? { ...task, [field]: value } : task
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
      render: (text: string, record: TaskRow) => (
        <DatePicker
          value={dayjs(record.taskStartDate)}
          onChange={(date) => updateTask(record.id, 'taskStartDate', date?.format('YYYY-MM-DD'))}
          style={{ width: '100%' }}
        />
      )
    },
    {
      title: 'End Date',
      dataIndex: 'taskEndDate',
      key: 'taskEndDate',
      render: (text: string, record: TaskRow) => (
        <DatePicker
          value={dayjs(record.taskEndDate)}
          onChange={(date) => updateTask(record.id, 'taskEndDate', date?.format('YYYY-MM-DD'))}
          style={{ width: '100%' }}
        />
      )
    },
    {
      title: 'Comments',
      dataIndex: 'comments',
      key: 'comments',
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
    <div style={{ padding: '24px' }}>
      <Card title="Team Activity" style={{ marginBottom: '24px' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onSubmit}
          initialValues={{
            date: dayjs().format('YYYY-MM-DD'),
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
                <DatePicker style={{ width: '100%' }} />
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
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={addTaskRow}>
            Add Task
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={tasks}
          rowKey="id"
          pagination={false}
          scroll={{ x: 1200 }}
        />
        
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Button type="primary" onClick={() => form.submit()}>
            Submit Team Activity
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default TeamActivity;
