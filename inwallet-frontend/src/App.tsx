import './App.css';
import Dashboard from './components/Dashboard';
import AIChatWidget from './components/AIChatWidget';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-logo heading-gradient">InWallet</div>
        <div className="user-profile">
          <div className="text-muted">Hoş Geldiniz, Yusa</div>
          <div className="avatar">YM</div>
        </div>
      </header>
      
      <main>
        <Dashboard />
      </main>

      <AIChatWidget />
    </div>
  );
}

export default App;
