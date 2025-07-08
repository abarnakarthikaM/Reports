
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TeamActivity from './pages/TeamActivity';
import VallarchiPlan from './pages/VallarchiPlan';
import VallarchiSheet from './pages/VallarchiSheet';
import './App.css';

const { Content } = Layout;

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sidebar />
        <Layout>
          <Header />
          <Content style={{ padding: '24px' }}>
            <Routes>
              <Route path="/" element={<TeamActivity />} />
              <Route path="/todayplan" element={<TeamActivity />} />
              <Route path="/vallarchi" element={<VallarchiPlan />} />
              <Route path="/vallarchi/sheet" element={<VallarchiSheet />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;
