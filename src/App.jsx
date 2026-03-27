import Identity from './components/Identity';
import Feed from './components/Feed';
import Projects from './components/Projects';

function App() {
  return (
    <div className="min-h-screen text-white" style={{ background: '#080808' }}>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_2fr] min-h-screen">
        {/* Left Column - Identity */}
        <div className="lg:col-span-1 border-r border-gray-800">
          <Identity />
        </div>
        
        {/* Middle Column - Feed */}
        <div className="lg:col-span-1 border-r border-gray-800">
          <Feed />
        </div>
        
        {/* Right Column - Projects */}
        <div className="lg:col-span-1">
          <Projects />
        </div>
      </div>
    </div>
  );
}

export default App
