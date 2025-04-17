import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

const CrudData = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isScrolled, setIsScrolled] = useState(false);
  const tableRef = React.useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (tableRef.current) {
        const scrollLeft = tableRef.current.scrollLeft;
        setIsScrolled(scrollLeft > 0);
      }
    };
    
    const tableContainer = tableRef.current;
    if (tableContainer) {
      tableContainer.addEventListener('scroll', handleScroll);
      return () => tableContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useEffect(() => {
    // Fetch data
    const fetchData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Sample data
        const data = [
          { id: 1, title: 'Complete project documentation', category: 'Documentation', priority: 'high', status: 'pending', dueDate: '2023-08-30' },
          { id: 2, title: 'Fix navigation bug', category: 'Bug Fix', priority: 'medium', status: 'in_progress', dueDate: '2023-08-25' },
          { id: 3, title: 'Deploy application to staging', category: 'Deployment', priority: 'high', status: 'pending', dueDate: '2023-09-05' },
          { id: 4, title: 'Weekly team meeting', category: 'Meeting', priority: 'medium', status: 'completed', dueDate: '2023-08-21' },
          { id: 5, title: 'Review pull requests', category: 'Code Review', priority: 'low', status: 'completed', dueDate: '2023-08-20' },
        ];
        
        setEntries(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (entry) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Filter out the deleted entry
        setEntries(entries.filter(entry => entry.id !== id));
      } catch (err) {
        setError('Failed to delete entry. Please try again.');
      }
    }
  };

  const handleSave = async (updatedEntry) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update the entries array
      setEntries(entries.map(entry => 
        entry.id === updatedEntry.id ? updatedEntry : entry
      ));
      
      setIsModalOpen(false);
      setSelectedEntry(null);
    } catch (err) {
      setError('Failed to update entry. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEntry(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  // Filter entries based on search term and status filter
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          entry.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || entry.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-10">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2">Loading data...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Retry
        </button>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Manage Entries</h1>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search entries..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          
          <div className="w-full md:w-1/4">
            <select
              value={filterStatus}
              onChange={handleFilterChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        
        <div className="my-8">
          <h2 className="text-2xl font-bold mb-4">Entries</h2>
          
          <div className="relative shadow-md sm:rounded-lg">
            <div ref={tableRef} className="overflow-x-auto max-w-full rounded-lg">
              <table className="w-full table-fixed text-sm text-left text-gray-500">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEntries.length > 0 ? (
                    filteredEntries.map(entry => (
                      <tr key={entry.id}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 truncate max-w-xs">{entry.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 truncate">{entry.category}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${entry.priority === 'High' 
                              ? 'bg-red-100 text-red-800' 
                              : entry.priority === 'Medium' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-green-100 text-green-800'}`}
                          >
                            {entry.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${entry.status === 'Completed'
                              ? 'bg-green-100 text-green-800'
                              : entry.status === 'In Progress'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'}`}
                          >
                            {entry.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 truncate">{entry.dueDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                          <button 
                            onClick={() => handleEdit(entry)} 
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(entry.id)} 
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        No entries found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className={`absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-transparent via-gray-300 to-transparent transition-opacity duration-200 pointer-events-none ${isScrolled ? 'opacity-100' : 'opacity-0'}`}></div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <a 
            href="/add-data" 
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Add New Entry
          </a>
        </div>
      </div>
      
      {/* Edit Modal */}
      {isModalOpen && selectedEntry && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Edit Entry</h3>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label htmlFor="edit-title" className="block text-gray-700 text-sm font-bold mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="edit-title"
                  value={selectedEntry.title}
                  onChange={(e) => setSelectedEntry({...selectedEntry, title: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="edit-category" className="block text-gray-700 text-sm font-bold mb-2">
                  Category
                </label>
                <input
                  type="text"
                  id="edit-category"
                  value={selectedEntry.category}
                  onChange={(e) => setSelectedEntry({...selectedEntry, category: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="edit-priority" className="block text-gray-700 text-sm font-bold mb-2">
                  Priority
                </label>
                <select
                  id="edit-priority"
                  value={selectedEntry.priority}
                  onChange={(e) => setSelectedEntry({...selectedEntry, priority: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="edit-status" className="block text-gray-700 text-sm font-bold mb-2">
                  Status
                </label>
                <select
                  id="edit-status"
                  value={selectedEntry.status}
                  onChange={(e) => setSelectedEntry({...selectedEntry, status: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="edit-dueDate" className="block text-gray-700 text-sm font-bold mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  id="edit-dueDate"
                  value={selectedEntry.dueDate}
                  onChange={(e) => setSelectedEntry({...selectedEntry, dueDate: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
            
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSave(selectedEntry)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CrudData; 