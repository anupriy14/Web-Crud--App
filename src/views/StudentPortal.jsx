import React, { useState, useEffect } from 'react';
import API from '../Api/Service.js';
import CodeCanvas from '../components/CodeCanvas';

function StudentPortal({ onAdminLogin }) {
  const [activeTrack, setActiveTrack] = useState('html');
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [showPlayground, setShowPlayground] = useState(false);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/${activeTrack}_track`);
        setTopics(response.data);
        setSelectedTopic(response.data.length > 0 ? response.data[0] : null);
        setShowPlayground(false); 
      } catch (err) {
        console.error("Error loading student track:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, [activeTrack]);

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    setShowPlayground(false); 
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col lg:h-screen lg:overflow-hidden text-zinc-800">
      
      
      <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 flex-shrink-0 shadow-sm z-10">
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-600 text-white rounded-lg font-black text-lg tracking-wider shadow-sm">🚀</span>
            <div>
              <h1 className="text-lg font-bold text-zinc-800 tracking-tight">Interactive Learning </h1>
              <p className="text-[10px] text-zinc-400 font-medium">Select a topic and start practicing live</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            
            {showPlayground && (
              <button 
                onClick={() => setShowPlayground(false)}
                className="md:hidden text-xs font-bold bg-zinc-800 text-white px-3 py-1.5 rounded-lg shadow-sm"
              >
                ⬅️ Docs
              </button>
            )}
            <button 
              onClick={onAdminLogin}
              className="md:hidden text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg shadow-sm"
            >
              Admin Panel Key
            </button>
          </div>
        </div>

        <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200 w-full md:w-auto justify-center">
          {['html', 'css', 'bootstrap'].map((track) => (
            <button
              key={track}
              onClick={() => setActiveTrack(track)}
              className={`flex-1 md:flex-initial px-5 py-2 rounded-lg text-xs font-bold uppercase transition-all ${activeTrack === track ? 'bg-white text-emerald-600 shadow-sm' : 'text-zinc-500 hover:text-zinc-800'}`}
            >
              {track}
            </button>
          ))}
        </div>

        <button 
          onClick={onAdminLogin} 
          className="hidden md:block text-xs font-bold text-zinc-400 hover:text-indigo-600 border border-dashed border-zinc-300 hover:border-indigo-300 px-4 py-2 rounded-xl transition-all"
        >
          🔐 Admin Access
        </button>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden p-4 md:p-6 gap-6 h-full min-h-0">
        
        <div className="w-full lg:w-72 bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col flex-shrink-0 h-[200px] lg:h-full">
          <div className="border-b pb-2 mb-2.5 flex-shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Topic List</span>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            {loading ? (
              <p className="text-xs text-center text-zinc-400 py-4">Loading topics...</p>
            ) : topics.length === 0 ? (
              <p className="text-xs text-center text-zinc-400 py-4 italic">No topics recorded yet.</p>
            ) : (
              topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => handleTopicSelect(topic)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg border text-xs font-medium transition-all truncate block ${selectedTopic?.id === topic.id ? 'bg-emerald-50 border-emerald-100 text-emerald-700 font-bold' : 'bg-white hover:bg-zinc-50 border-transparent text-zinc-600'}`}
                >
                  📄 {topic.name}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="flex-1 w-full min-h-[550px] lg:min-h-0 lg:h-full flex flex-col min-h-0">
          {selectedTopic ? (
            showPlayground ? (
              
              <div className="flex-1 flex flex-col h-full w-full min-h-0 relative">
                <button 
                  onClick={() => setShowPlayground(false)}
                  className="hidden md:block absolute top-3.5 right-36 z-20 px-3 py-1.5 bg-zinc-800 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-zinc-700 transition-colors shadow-md border border-zinc-950"
                >
                  ⬅️ Return to Docs
                </button>
                <CodeCanvas activeTrack={activeTrack} selectedTopic={selectedTopic} />
              </div>

            ) : (
              
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col flex-1 text-left overflow-y-auto h-full">
                
                <div className="border-b border-gray-100 pb-4 mb-5 flex-shrink-0">
                  <h2 className="text-2xl font-extrabold text-zinc-800 mt-2 tracking-tight">{selectedTopic.name}</h2>
                </div>

                <div className="mb-6 flex-shrink-0">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2.5">Topic Overview</h3>
                  {(selectedTopic.description || selectedTopic.newdescription) ? (
                    <ul className="list-disc pl-5 space-y-2 text-sm text-zinc-600">
                      {(selectedTopic.description || selectedTopic.newdescription)
                        .split('\n')
                        .filter(line => line.trim() !== '')
                        .map((point, index) => (
                          <li key={index} className="leading-relaxed">
                            {point.replace(/^[•\-\*]\s*/, '')}
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-zinc-400 italic">No description notes written for this topic.</p>
                  )}
                </div>

                <div className="mb-6 flex-1 flex flex-col min-h-[180px]">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 flex-shrink-0">Example Template</h3>
                  <div className="w-full flex-1 rounded-xl bg-slate-900 border border-slate-800 p-5 text-emerald-400 font-mono text-xs overflow-auto whitespace-pre leading-relaxed shadow-inner text-left">
                    {selectedTopic.code}
                  </div>
                </div>

                <div className="pt-2 flex-shrink-0">
                  <button
                    onClick={() => setShowPlayground(true)}
                    className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg transform active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    Try it Yourself 🚀
                  </button>
                </div>

              </div>
            )
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-12 text-center text-gray-400 flex-1 flex flex-col items-center justify-center">
              <p className="text-lg font-medium text-zinc-700">Please choose a topic from the curriculum menu.</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

export default StudentPortal;