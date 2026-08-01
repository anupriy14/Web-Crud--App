import React, { useState, useEffect } from 'react';
import API from '../Api/Service.js'; 
import TopicForm from '../components/TopicForm'

function AdminDashboard() {
  const [adminTrack, setAdminTrack] = useState('html'); 
  const [topics, setTopics] = useState([]);
  
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);

  const loadTrackData = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/${adminTrack}_track`);
      setTopics(response.data);
    } catch (err) {
      console.error("API Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTrackData(); }, [adminTrack]);

  const resetFormFields = () => {
    setIsEditing(false);
    setEditingTopic(null);
  };

  const handleFormSubmit = async ({ track, payload }) => {
    if (isEditing) {
      try {
        const response = await API.patch(`/${adminTrack}_track/${editingTopic.id}`, payload);
        setTopics(topics.map(t => t.id === editingTopic.id ? response.data : t));
        resetFormFields();
      } catch (err) { 
        alert('Update operation aborted'); 
      }
    } else {
      try {
        const response = await API.post(`/${track}_track`, payload);
        if (track === adminTrack) {
          setTopics([...topics, response.data]);
        } else {
          alert(`Successfully added to ${track.toUpperCase()} database track!`);
        }
        resetFormFields();
      } catch (err) { 
        alert('Error writing new topic to database'); 
      }
    }
  };

  const startEditingTopic = (topic) => {
    setIsEditing(true);
    setEditingTopic(topic);
  };

  const handleDeleteTopic = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record permanently?")) return;
    try {
      await API.delete(`/${adminTrack}_track/${id}`);
      setTopics(topics.filter(t => t.id !== id));
      if (editingTopic?.id === id) resetFormFields();
    } catch (err) { 
      alert('Delete operation failure'); 
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col lg:h-screen lg:overflow-hidden">
      
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col md:flex-row items-center 
      justify-between gap-4 shadow-sm flex-shrink-0 z-10">
        <div className="flex items-center gap-3">
          <span className="p-2 bg-indigo-600 text-white rounded-lg font-bold text-xl shadow-md">CMS</span>
          <div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">Central Database Manager</h1>
          </div>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 w-full md:w-auto justify-center">
          {['html', 'css', 'bootstrap'].map((track) => (
            <button 
              key={track} 
              onClick={() => { setAdminTrack(track); resetFormFields(); }} 
              className={`flex-1 md:flex-initial px-5 py-2 rounded-lg text-xs font-bold uppercase transition-all
              ${adminTrack === track ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
            >
              {track}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row p-4 md:p-6 gap-6 overflow-y-auto lg:overflow-hidden h-full min-h-0">
        
        <div className="w-full lg:w-[30%] bg-white border border-gray-200 rounded-xl 
        shadow-sm p-4 flex flex-col flex-shrink-0 h-[350px] lg:h-full min-h-0">
          <div className="border-b pb-3 mb-4 flex-shrink-0">
            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Topics List</span>
            <h2 className="text-md font-bold text-gray-700 capitalize">{adminTrack} Topics ({topics.length})</h2>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-left">
            {loading ? (
              <p className="text-xs text-center text-gray-400 py-6">Syncing database entries...</p>
            ) : topics.length === 0 ? (
              <p className="text-xs text-center text-gray-400 py-6 italic">No curriculum units stored.</p>
            ) : (
              topics.map((topic) => (
                <div 
                  key={topic.id} 
                  className={`p-3 border rounded-xl transition-all flex items-center justify-between gap-3
                  ${editingTopic?.id === topic.id ? 'bg-indigo-50 border-indigo-200 text-indigo-900 shadow-sm' : 'bg-gray-50/50 border-gray-200 hover:bg-gray-50'}`}
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-gray-800 text-xs truncate">{topic.name}</h3>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button 
                      onClick={() => startEditingTopic(topic)}
                      className="px-2 py-1 bg-white border border-gray-300 text-gray-600 text-[11px] font-bold rounded-md hover:border-indigo-300 hover:text-indigo-600 transition-colors shadow-2xs"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteTopic(topic.id)}
                      className="px-2 py-1 bg-white border border-red-200 text-red-600 text-[11px] font-bold rounded-md hover:bg-red-50 transition-all shadow-2xs"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex-1 w-full lg:w-[70%] h-full min-h-0">
          <TopicForm 
            isEditing={isEditing}
            initialData={editingTopic}
            currentTrack={adminTrack}
            onCancel={resetFormFields}
            onSubmit={handleFormSubmit}
          />
        </div>

      </main>
    </div>
  );
}

export default AdminDashboard;