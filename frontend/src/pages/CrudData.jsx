import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { cn } from '../lib/utils';
import { Button } from "@/components/ui/button";

// Sample car data as fallback (same as Dashboard)
const sampleCarData = [
  { id: 1, model_name: "Toyota Camry", price: 2500000, manufacturing_year: 2020, engine_capacity: "2.5L", spare_key: "Yes", transmission: "Automatic", km_driven: 15000, ownership: "First Owner", fuel_type: "Petrol", imperfections: "Minor Scratches", repainted_parts: "None", region: "delhi" },
  { id: 2, model_name: "Honda Accord", price: 2200000, manufacturing_year: 2019, engine_capacity: "2.0L", spare_key: "Yes", transmission: "Automatic", km_driven: 20000, ownership: "Second Owner", fuel_type: "Petrol", imperfections: "None", repainted_parts: "Front Bumper", region: "mumbai" },
  { id: 3, model_name: "Ford Mustang", price: 4500000, manufacturing_year: 2021, engine_capacity: "5.0L", spare_key: "Yes", transmission: "Manual", km_driven: 5000, ownership: "First Owner", fuel_type: "Petrol", imperfections: "None", repainted_parts: "None", region: "bangalore" },
  { id: 4, model_name: "Tesla Model 3", price: 4800000, manufacturing_year: 2022, engine_capacity: "Electric", spare_key: "Yes", transmission: "Automatic", km_driven: 8000, ownership: "First Owner", fuel_type: "Electric", imperfections: "None", repainted_parts: "None", region: "pune" },
  { id: 5, model_name: "BMW 3 Series", price: 3800000, manufacturing_year: 2020, engine_capacity: "2.0L", spare_key: "Yes", transmission: "Automatic", km_driven: 18000, ownership: "First Owner", fuel_type: "Diesel", imperfections: "Minor Scratches", repainted_parts: "Front Door", region: "chennai" },
];

const CrudData = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFuelType, setFilterFuelType] = useState('all');
  const [isScrolled, setIsScrolled] = useState(false);
  const tableRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const handleScroll = () => {
      const tableElement = tableRef.current;
      if (tableElement) {
        const hasHorizontalScroll = tableElement.scrollLeft > 0;
        setIsScrolled(hasHorizontalScroll);
      }
    };

    const tableElement = tableRef.current;
    if (tableElement) {
      tableElement.addEventListener('scroll', handleScroll);
      // Initial check
      handleScroll();
    }

    return () => {
      if (tableElement) {
        tableElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    // Fetch car data from API
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/csv/cars');
        
        // Use sample data if no data is returned
        const data = response.data && response.data.length > 0 
          ? response.data.map((car, index) => ({ ...car, id: index + 1 }))
          : sampleCarData;
        
        setEntries(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching car data:', err);
        // Fall back to sample data on error
        setEntries(sampleCarData);
        setError('Using sample data. Server error: ' + (err.response?.data?.message || err.message));
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
    if (window.confirm('Are you sure you want to delete this car entry?')) {
      try {
        // In a real application, we would call the API to delete the entry
        // await axios.delete(`http://localhost:5000/api/csv/cars/${id}`);
        
        // For now, we'll just update the UI
        setEntries(entries.filter(entry => entry.id !== id));
      } catch (err) {
        setError('Failed to delete entry. Please try again.');
      }
    }
  };

  const handleSave = async (updatedEntry) => {
    try {
      // In a real application, we would call the API to update the entry
      // await axios.put(`http://localhost:5000/api/csv/cars/${updatedEntry.id}`, updatedEntry);
      
      // For now, we'll just update the UI
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
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setFilterFuelType(e.target.value);
    setCurrentPage(1);
  };

  // Get unique fuel types for filter
  const getUniqueFuelTypes = () => {
    if (!entries.length) return [];
    const types = new Set(entries.map(car => car.fuel_type).filter(Boolean));
    return Array.from(types);
  };

  // Format price in rupees with lakh/crore format
  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    } else if (price >= 1000) {
      return `₹${(price / 1000).toFixed(2)} K`;
    } else {
      return `₹${price}`;
    }
  };

  // Filter entries based on search term and fuel type filter
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = 
      (entry.model_name && entry.model_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (entry.region && entry.region.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterFuelType === 'all' || entry.fuel_type === filterFuelType;
    return matchesSearch && matchesFilter;
  });

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  const indexOfLastEntry = currentPage * itemsPerPage;
  const indexOfFirstEntry = indexOfLastEntry - itemsPerPage;
  const currentEntries = filteredEntries.slice(indexOfFirstEntry, indexOfLastEntry);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  // --- End Pagination Logic ---

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-10">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2">Loading car data...</p>
        </div>
      </Layout>
    );
  }

  if (error && !entries.length) {
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
        <h1 className="text-3xl font-bold">Manage Car Inventory</h1>
        
        {error && (
          <div className="bg-yellow-100 text-yellow-700 p-4 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="w-full md:w-1/3">
          <input
            type="text"
              placeholder="Search by model name or region..."
            value={searchTerm}
            onChange={handleSearchChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-background text-foreground leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        
        <div className="w-full md:w-1/4">
          <select
              value={filterFuelType}
            onChange={handleFilterChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-background text-foreground leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="all">All Fuel Types</option>
              {getUniqueFuelTypes().map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
          </select>
        </div>
      </div>
      
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Car Entries ({filteredEntries.length} found)</h2>
          <div className="rounded-lg border bg-card relative">
            <div
              ref={tableRef}
              className="overflow-x-auto max-w-full"
            >
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Model Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Year
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fuel Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transmission
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      KM Driven
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ownership
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Region
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
                  {currentEntries.length > 0 ? (
                    currentEntries.map(entry => (
                      <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 truncate max-w-xs">{entry.model_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 truncate">{formatPrice(entry.price)}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{entry.manufacturing_year}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${entry.fuel_type === 'Petrol' 
                              ? 'bg-green-100 text-green-800' 
                              : entry.fuel_type === 'Diesel' 
                                ? 'bg-blue-100 text-blue-800' 
                                : entry.fuel_type === 'Electric'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-gray-100 text-gray-800'}`}
                          >
                            {entry.fuel_type}
                    </span>
                  </td>
                        <td className="px-6 py-4 text-sm text-gray-500 truncate">{entry.transmission}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 truncate">{entry.km_driven.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 truncate">{entry.ownership}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 truncate">{entry.region}</td>
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
                      <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500">
                        No car entries found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
            </div>
            <div className={cn(
              "absolute left-0 top-0 bottom-0 w-4 pointer-events-none",
              "bg-gradient-to-r from-gray-200 to-transparent",
              isScrolled ? "opacity-100" : "opacity-0"
            )}></div>
            <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-gray-200 to-transparent pointer-events-none"></div>
            <div className={cn(
              "absolute bottom-0 left-0 right-0 h-4 pointer-events-none",
              "bg-gradient-to-t from-white/80 to-transparent dark:from-gray-900/80",
              isScrolled ? "opacity-100" : "opacity-0"
            )}></div>
          </div>

          {/* --- Pagination Controls --- */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-700">
                Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, filteredEntries.length)} of {filteredEntries.length} entries
              </span>
              <div className="flex space-x-2">
                <Button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                >
                  Previous
                </Button>
                <span className="text-sm px-2 py-1">Page {currentPage} of {totalPages}</span>
                <Button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
          {/* --- End Pagination Controls --- */}

      </div>
      
        <div className="flex justify-end">
        <a 
            href="/add-car" 
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
            Add New Car
        </a>
        </div>
      </div>
      
      {/* Edit Modal */}
      {isModalOpen && selectedEntry && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-y-auto max-h-[90vh]">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Edit Car Entry</h3>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                  <label htmlFor="edit-model" className="block text-gray-700 text-sm font-bold mb-2">
                    Model Name
                </label>
                <input
                  type="text"
                    id="edit-model"
                    value={selectedEntry.model_name}
                    onChange={(e) => setSelectedEntry({...selectedEntry, model_name: e.target.value})}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="edit-price" className="block text-gray-700 text-sm font-bold mb-2">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    id="edit-price"
                    value={selectedEntry.price}
                    onChange={(e) => setSelectedEntry({...selectedEntry, price: parseInt(e.target.value)})}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="edit-year" className="block text-gray-700 text-sm font-bold mb-2">
                    Manufacturing Year
                  </label>
                  <input
                    type="number"
                    id="edit-year"
                    value={selectedEntry.manufacturing_year}
                    onChange={(e) => setSelectedEntry({...selectedEntry, manufacturing_year: parseInt(e.target.value)})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              
              <div className="mb-4">
                  <label htmlFor="edit-fuel" className="block text-gray-700 text-sm font-bold mb-2">
                    Fuel Type
                  </label>
                  <select
                    id="edit-fuel"
                    value={selectedEntry.fuel_type}
                    onChange={(e) => setSelectedEntry({...selectedEntry, fuel_type: e.target.value})}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    {getUniqueFuelTypes().map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="edit-transmission" className="block text-gray-700 text-sm font-bold mb-2">
                    Transmission
                  </label>
                  <select
                    id="edit-transmission"
                    value={selectedEntry.transmission}
                    onChange={(e) => setSelectedEntry({...selectedEntry, transmission: e.target.value})}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="edit-km" className="block text-gray-700 text-sm font-bold mb-2">
                    KM Driven
                </label>
                <input
                    type="number"
                    id="edit-km"
                    value={selectedEntry.km_driven}
                    onChange={(e) => setSelectedEntry({...selectedEntry, km_driven: parseInt(e.target.value)})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              
              <div className="mb-4">
                  <label htmlFor="edit-ownership" className="block text-gray-700 text-sm font-bold mb-2">
                    Ownership
                </label>
                <select
                    id="edit-ownership"
                    value={selectedEntry.ownership}
                    onChange={(e) => setSelectedEntry({...selectedEntry, ownership: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option value="First Owner">First Owner</option>
                    <option value="Second Owner">Second Owner</option>
                    <option value="Third Owner">Third Owner</option>
                    <option value="Fourth Owner or More">Fourth Owner or More</option>
                </select>
              </div>
              
              <div className="mb-4">
                  <label htmlFor="edit-region" className="block text-gray-700 text-sm font-bold mb-2">
                    Region
                  </label>
                  <input
                    type="text"
                    id="edit-region"
                    value={selectedEntry.region}
                    onChange={(e) => setSelectedEntry({...selectedEntry, region: e.target.value})}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="edit-engine" className="block text-gray-700 text-sm font-bold mb-2">
                    Engine Capacity
                  </label>
                  <input
                    type="text"
                    id="edit-engine"
                    value={selectedEntry.engine_capacity}
                    onChange={(e) => setSelectedEntry({...selectedEntry, engine_capacity: e.target.value})}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="edit-spare-key" className="block text-gray-700 text-sm font-bold mb-2">
                    Spare Key
                </label>
                <select
                    id="edit-spare-key"
                    value={selectedEntry.spare_key}
                    onChange={(e) => setSelectedEntry({...selectedEntry, spare_key: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
              </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="mb-4">
                  <label htmlFor="edit-imperfections" className="block text-gray-700 text-sm font-bold mb-2">
                    Imperfections
                  </label>
                  <input
                    type="text"
                    id="edit-imperfections"
                    value={selectedEntry.imperfections}
                    onChange={(e) => setSelectedEntry({...selectedEntry, imperfections: e.target.value})}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
              </div>
              
              <div className="mb-4">
                  <label htmlFor="edit-repainted" className="block text-gray-700 text-sm font-bold mb-2">
                    Repainted Parts
                </label>
                <input
                    type="text"
                    id="edit-repainted"
                    value={selectedEntry.repainted_parts}
                    onChange={(e) => setSelectedEntry({...selectedEntry, repainted_parts: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                </div>
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