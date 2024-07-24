import React from 'react';
import Sidebar from './components/Sidebar'
import Chat from './components/Chat';
import './App.css';
import MainChatComponent from './components/HomeScreen';

const App: React.FC = () => {
  return (
    <div className="app">
     
      <MainChatComponent/>
    </div>
  );
};

export default App;
