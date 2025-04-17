import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, DollarSign, ArrowUp, ArrowDown, ShoppingCart, Car, Calendar, BarChart, Filter, PieChart } from "lucide-react";
import Layout from '../components/Layout';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

// Add sample data as fallback
const sampleCarData = [
  { model_name: "Toyota Camry", price: 2500000, manufacturing_year: 2020, engine_capacity: "2.5L", spare_key: "Yes", transmission: "Automatic", km_driven: 15000, ownership: "First Owner", fuel_type: "Petrol", imperfections: "Minor Scratches", repainted_parts: "None" },
  { model_name: "Honda Accord", price: 2200000, manufacturing_year: 2019, engine_capacity: "2.0L", spare_key: "Yes", transmission: "Automatic", km_driven: 20000, ownership: "Second Owner", fuel_type: "Petrol", imperfections: "None", repainted_parts: "Front Bumper" },
  { model_name: "Ford Mustang", price: 4500000, manufacturing_year: 2021, engine_capacity: "5.0L", spare_key: "Yes", transmission: "Manual", km_driven: 5000, ownership: "First Owner", fuel_type: "Petrol", imperfections: "None", repainted_parts: "None" },
  { model_name: "Tesla Model 3", price: 4800000, manufacturing_year: 2022, engine_capacity: "Electric", spare_key: "Yes", transmission: "Automatic", km_driven: 8000, ownership: "First Owner", fuel_type: "Electric", imperfections: "None", repainted_parts: "None" },
  { model_name: "BMW 3 Series", price: 3800000, manufacturing_year: 2020, engine_capacity: "2.0L", spare_key: "Yes", transmission: "Automatic", km_driven: 18000, ownership: "First Owner", fuel_type: "Diesel", imperfections: "Minor Scratches", repainted_parts: "Front Door" }
];

const Dashboard = () => {
  const [carData, setCarData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [yearRange, setYearRange] = useState([1990, 2024]);
  const [selectedFuelType, setSelectedFuelType] = useState("all");
  const [selectedTransmission, setSelectedTransmission] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  
  // Stats
  const [maxPrice, setMaxPrice] = useState(10000000);
  const [minPrice, setMinPrice] = useState(0);
  const [maxYear, setMaxYear] = useState(2024);
  const [minYear, setMinYear] = useState(1990);
  
  useEffect(() => {
    const fetchCarData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/csv/cars');
        
        // Use sample data if no data is returned
        const data = response.data && response.data.length > 0 ? response.data : sampleCarData;
        
        setCarData(data);
        
        // Set initial stats
        if (data.length > 0) {
          const prices = data.map(car => car.price);
          const years = data.map(car => car.manufacturing_year);
          
          setMaxPrice(Math.max(...prices, 1000000));
          setMinPrice(Math.min(...prices, 0));
          setPriceRange([Math.min(...prices, 0), Math.max(...prices, 1000000)]);
          
          setMaxYear(Math.max(...years, new Date().getFullYear()));
          setMinYear(Math.min(...years, 1990));
          setYearRange([Math.min(...years, 1990), Math.max(...years, new Date().getFullYear())]);
        }
        
        setFilteredData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching car data:', err);
        // Fall back to sample data on error
        setCarData(sampleCarData);
        setFilteredData(sampleCarData);
        setError('Using sample data. Server error: ' + (err.response?.data?.message || err.message));
        setLoading(false);
        
        // Set initial stats with sample data
        const prices = sampleCarData.map(car => car.price);
        const years = sampleCarData.map(car => car.manufacturing_year);
        
        setMaxPrice(Math.max(...prices, 1000000));
        setMinPrice(Math.min(...prices, 0));
        setPriceRange([Math.min(...prices, 0), Math.max(...prices, 1000000)]);
        
        setMaxYear(Math.max(...years, new Date().getFullYear()));
        setMinYear(Math.min(...years, 1990));
        setYearRange([Math.min(...years, 1990), Math.max(...years, new Date().getFullYear())]);
      }
    };
    
    fetchCarData();
  }, []);
  
  // Apply filters
  useEffect(() => {
    if (!carData.length) return;
    
    let result = [...carData];
    
    // Apply price filter
    result = result.filter(car => car.price >= priceRange[0] && car.price <= priceRange[1]);
    
    // Apply year filter
    result = result.filter(car => car.manufacturing_year >= yearRange[0] && car.manufacturing_year <= yearRange[1]);
    
    // Apply fuel type filter
    if (selectedFuelType !== "all") {
      result = result.filter(car => car.fuel_type === selectedFuelType);
    }
    
    // Apply transmission filter
    if (selectedTransmission !== "all") {
      result = result.filter(car => car.transmission === selectedTransmission);
    }
    
    // Apply time filter (if we had timestamp data, we would filter by that)
    // This is a placeholder since we don't have actual date added timestamps
    
    setFilteredData(result);
  }, [carData, priceRange, yearRange, selectedFuelType, selectedTransmission, timeFilter]);
  
  // Calculate stats from car data
  const getTotalValue = () => {
    if (!filteredData.length) return 0;
    return filteredData.reduce((sum, car) => sum + car.price, 0);
  };
  
  const getAveragePrice = () => {
    if (!filteredData.length) return 0;
    const avg = getTotalValue() / filteredData.length;
    return avg.toFixed(0);
  };
  
  const getAverageAge = () => {
    if (!filteredData.length) return 0;
    const currentYear = new Date().getFullYear();
    const totalAge = filteredData.reduce((sum, car) => sum + (currentYear - car.manufacturing_year), 0);
    return (totalAge / filteredData.length).toFixed(1);
  };
  
  const getFuelTypeCounts = () => {
    if (!filteredData.length) return {};
    return filteredData.reduce((acc, car) => {
      const fuelType = car.fuel_type || 'Unknown';
      acc[fuelType] = (acc[fuelType] || 0) + 1;
      return acc;
    }, {});
  };
  
  const getTransmissionCounts = () => {
    if (!filteredData.length) return {};
    return filteredData.reduce((acc, car) => {
      const transmission = car.transmission || 'Unknown';
      acc[transmission] = (acc[transmission] || 0) + 1;
      return acc;
    }, {});
  };
  
  const getYearDistribution = () => {
    if (!filteredData.length) return {};
    
    // Create buckets of years (groups of 5 years)
    const yearBuckets = {};
    
    filteredData.forEach(car => {
      const year = car.manufacturing_year;
      const bucketKey = Math.floor(year / 5) * 5;
      const bucketLabel = `${bucketKey}-${bucketKey + 4}`;
      
      yearBuckets[bucketLabel] = (yearBuckets[bucketLabel] || 0) + 1;
    });
    
    return yearBuckets;
  };
  
  const getPriceDistribution = () => {
    if (!filteredData.length) return {};
    
    // Create buckets of price ranges
    const priceBuckets = {};
    const bucketSize = Math.max(100000, Math.ceil((maxPrice - minPrice) / 8));
    
    filteredData.forEach(car => {
      const price = car.price;
      const bucketKey = Math.floor(price / bucketSize) * bucketSize;
      const bucketLabel = `${(bucketKey / 100000).toFixed(1)}-${((bucketKey + bucketSize) / 100000).toFixed(1)}L`;
      
      priceBuckets[bucketLabel] = (priceBuckets[bucketLabel] || 0) + 1;
    });
    
    return priceBuckets;
  };
  
  const getTopModels = () => {
    if (!filteredData.length) return [];
    
    const modelCounts = filteredData.reduce((acc, car) => {
      acc[car.model_name] = (acc[car.model_name] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(modelCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([model, count]) => ({ model, count }));
  };
  
  // Get unique fuel types for filter
  const getUniqueFuelTypes = () => {
    if (!carData.length) return [];
    const types = new Set(carData.map(car => car.fuel_type).filter(Boolean));
    return Array.from(types);
  };
  
  // Get unique transmission types for filter
  const getUniqueTransmissions = () => {
    if (!carData.length) return [];
    const types = new Set(carData.map(car => car.transmission).filter(Boolean));
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

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Car Inventory Dashboard</h2>
          <div className="flex items-center gap-2">
            <Select
              value={timeFilter}
              onValueChange={setTimeFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="last_month">Last Month</SelectItem>
                <SelectItem value="last_week">Last Week</SelectItem>
                <SelectItem value="last_year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Filters */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Filter className="mr-2 h-5 w-5" /> Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="price-range">Price Range (₹)</Label>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
                <Slider
                  id="price-range"
                  defaultValue={priceRange}
                  min={minPrice}
                  max={maxPrice}
                  step={10000}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="py-4"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="year-range">Year Range</Label>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{yearRange[0]}</span>
                  <span>{yearRange[1]}</span>
                </div>
                <Slider
                  id="year-range"
                  defaultValue={yearRange}
                  min={minYear}
                  max={maxYear}
                  step={1}
                  value={yearRange}
                  onValueChange={setYearRange}
                  className="py-4"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fuel-type">Fuel Type</Label>
                <Select
                  id="fuel-type"
                  value={selectedFuelType}
                  onValueChange={setSelectedFuelType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Fuel Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Fuel Types</SelectItem>
                    {getUniqueFuelTypes().map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="transmission">Transmission</Label>
                <Select
                  id="transmission"
                  value={selectedTransmission}
                  onValueChange={setSelectedTransmission}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Transmissions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Transmissions</SelectItem>
                    {getUniqueTransmissions().map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button 
                variant="outline" 
                className="mr-2"
                onClick={() => {
                  setPriceRange([minPrice, maxPrice]);
                  setYearRange([minYear, maxYear]);
                  setSelectedFuelType("all");
                  setSelectedTransmission("all");
                  setTimeFilter("all");
                }}
              >
                Reset Filters
              </Button>
              <Button>Apply Filters</Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Cars
              </CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : filteredData.length}</div>
              <div className="text-xs text-muted-foreground flex items-center">
                {filteredData.length < carData.length && (
                  <>
                    <span className="text-amber-500">
                      {((filteredData.length / carData.length) * 100).toFixed(0)}% of total inventory
                    </span>
                  </>
                )}
                {filteredData.length === carData.length && (
                  <span>Total cars in inventory</span>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Value
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : formatPrice(getTotalValue())}
              </div>
              <div className="text-xs text-muted-foreground">
                Total value of all cars
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Price
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : formatPrice(getAveragePrice())}
              </div>
              <div className="text-xs text-muted-foreground">
                Average car price
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Age
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : getAverageAge()} years
              </div>
              <div className="text-xs text-muted-foreground">
                Average car age
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {/* Distribution by Fuel Type */}
          <Card className="col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <PieChart className="mr-2 h-5 w-5" /> Fuel Type Distribution
              </CardTitle>
              <CardDescription>
                Cars by fuel type
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-[350px]">
              {loading ? (
                <div className="h-[250px] flex items-center justify-center">
                  <p className="text-muted-foreground">Loading data...</p>
                </div>
              ) : error && !filteredData.length ? (
                <div className="h-[250px] flex items-center justify-center">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : Object.keys(getFuelTypeCounts()).length === 0 ? (
                <div className="h-[250px] flex items-center justify-center">
                  <p className="text-muted-foreground">No data available</p>
                </div>
              ) : (
                <div className="space-y-6 p-2">
                  {Object.entries(getFuelTypeCounts()).map(([fuelType, count]) => {
                    const percentage = (count / filteredData.length) * 100;
                    return (
                      <div key={fuelType} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">{fuelType}</span>
                          <span className="text-sm text-muted-foreground">{count} cars ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div 
                            className="bg-blue-600 h-4 rounded-full transition-all duration-500 flex items-center justify-end px-2"
                            style={{ width: `${Math.max(percentage, 5)}%` }}
                          >
                            {percentage > 15 && (
                              <span className="text-xs text-white font-medium">{percentage.toFixed(0)}%</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Distribution by Transmission */}
          <Card className="col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <PieChart className="mr-2 h-5 w-5" /> Transmission Distribution
              </CardTitle>
              <CardDescription>
                Cars by transmission type
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-[350px]">
              {loading ? (
                <div className="h-[250px] flex items-center justify-center">
                  <p className="text-muted-foreground">Loading data...</p>
                </div>
              ) : error && !filteredData.length ? (
                <div className="h-[250px] flex items-center justify-center">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : Object.keys(getTransmissionCounts()).length === 0 ? (
                <div className="h-[250px] flex items-center justify-center">
                  <p className="text-muted-foreground">No data available</p>
                </div>
              ) : (
                <div className="space-y-6 p-2">
                  {Object.entries(getTransmissionCounts()).map(([transmission, count]) => {
                    const percentage = (count / filteredData.length) * 100;
                    return (
                      <div key={transmission} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">{transmission}</span>
                          <span className="text-sm text-muted-foreground">{count} cars ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div 
                            className="bg-green-600 h-4 rounded-full transition-all duration-500 flex items-center justify-end px-2"
                            style={{ width: `${Math.max(percentage, 5)}%` }}
                          >
                            {percentage > 15 && (
                              <span className="text-xs text-white font-medium">{percentage.toFixed(0)}%</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Recent Cars */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recent Cars</CardTitle>
              <CardDescription>
                {loading ? 'Loading...' : `Showing ${filteredData.length} of ${carData.length} cars`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-center py-8 text-muted-foreground">Loading cars...</p>
              ) : error ? (
                <p className="text-center py-8 text-red-500">{error}</p>
              ) : (
                <div className="space-y-4">
                  {filteredData.slice(0, 5).map((car, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <Car className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{car.model_name}</p>
                        <p className="text-sm text-muted-foreground">{car.manufacturing_year} • {car.fuel_type}</p>
                      </div>
                      <div className="font-medium">{formatPrice(car.price)}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Advanced Charts */}
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
          {/* Year Distribution */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <BarChart className="mr-2 h-5 w-5" /> Year Distribution
              </CardTitle>
              <CardDescription>
                Cars by manufacturing year range
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              {loading ? (
                <div className="h-[250px] flex items-center justify-center">
                  <p className="text-muted-foreground">Loading data...</p>
                </div>
              ) : error && !filteredData.length ? (
                <div className="h-[250px] flex items-center justify-center">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : Object.keys(getYearDistribution()).length === 0 ? (
                <div className="h-[250px] flex items-center justify-center">
                  <p className="text-muted-foreground">No data available</p>
                </div>
              ) : (
                <div className="h-[250px] flex items-end justify-between gap-2 pt-4 mt-4 min-w-[500px]">
                  {Object.entries(getYearDistribution()).map(([yearRange, count]) => {
                    const percentage = (count / filteredData.length) * 100;
                    return (
                      <div key={yearRange} className="flex flex-col items-center">
                        <div 
                          className="bg-blue-500 w-14 rounded-t-md hover:bg-blue-600 transition-colors"
                          style={{ height: `${Math.max(percentage * 2.5, 10)}%` }}
                        >
                          <div className="invisible">.</div>
                        </div>
                        <div className="text-xs mt-2 text-center">
                          <div className="font-medium">{yearRange}</div>
                          <div className="text-muted-foreground">{count} cars</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Price Distribution */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <BarChart className="mr-2 h-5 w-5" /> Price Distribution
              </CardTitle>
              <CardDescription>
                Cars by price range (in lakhs)
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              {loading ? (
                <div className="h-[250px] flex items-center justify-center">
                  <p className="text-muted-foreground">Loading data...</p>
                </div>
              ) : error && !filteredData.length ? (
                <div className="h-[250px] flex items-center justify-center">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : Object.keys(getPriceDistribution()).length === 0 ? (
                <div className="h-[250px] flex items-center justify-center">
                  <p className="text-muted-foreground">No data available</p>
                </div>
              ) : (
                <div className="h-[250px] flex items-end justify-between gap-2 pt-4 mt-4 min-w-[500px]">
                  {Object.entries(getPriceDistribution()).map(([priceRange, count]) => {
                    const percentage = (count / filteredData.length) * 100;
                    return (
                      <div key={priceRange} className="flex flex-col items-center">
                        <div 
                          className="bg-green-500 w-14 rounded-t-md hover:bg-green-600 transition-colors"
                          style={{ height: `${Math.max(percentage * 2.5, 10)}%` }}
                        >
                          <div className="invisible">.</div>
                        </div>
                        <div className="text-xs mt-2 text-center">
                          <div className="font-medium">{priceRange}</div>
                          <div className="text-muted-foreground">{count} cars</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Top Models */}
        <Card>
          <CardHeader>
            <CardTitle>Top Car Models</CardTitle>
            <CardDescription>
              Most common car models in the inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-8 text-muted-foreground">Loading models...</p>
            ) : error ? (
              <p className="text-center py-8 text-red-500">{error}</p>
            ) : (
              <div className="space-y-6 p-2">
                {getTopModels().map((item, i) => {
                  const percentage = (item.count / filteredData.length) * 100;
                  return (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm">{item.model}</span>
                        <span className="text-sm text-muted-foreground">{item.count} cars ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                          className="bg-purple-600 h-4 rounded-full transition-all duration-500 flex items-center justify-end px-2"
                          style={{ width: `${Math.max(percentage, 5)}%` }}
                        >
                          {percentage > 15 && (
                            <span className="text-xs text-white font-medium">{percentage.toFixed(0)}%</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard; 