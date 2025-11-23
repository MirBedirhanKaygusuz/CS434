import React from 'react';

interface HeaderProps {
  onNew: () => void;
  onSave: () => void;
  onRestore: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNew, onSave, onRestore }) => {
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="app-title">📝 SmartEdit</h1>
      </div>
      <div className="header-menu">
        <button className="menu-btn" onClick={onNew}>New</button>
        <button className="menu-btn" onClick={onSave}>Save As...</button>
        <button className="menu-btn" onClick={onRestore}>Restore Points</button>
      </div>
    </header>
  );
};

export default Header;
