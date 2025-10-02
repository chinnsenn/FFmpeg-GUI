import './App.css';

function App() {
  return (
    <div className="app">
      <div className="container">
        <h1>FFmpeg GUI</h1>
        <p>开发环境配置成功！</p>
        <div className="info">
          <p>Platform: {(window as any).electron?.platform || 'unknown'}</p>
          <p>Environment: Development</p>
        </div>
      </div>
    </div>
  );
}

export default App;
