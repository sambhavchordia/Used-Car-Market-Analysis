import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, DollarSign, ArrowUp, ArrowDown, ShoppingCart, Car, Calendar, BarChart, Filter, PieChart as PieChartIcon, MapPin } from "lucide-react";
import Layout from '../components/Layout';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart } from "@/components/ui/pie-chart";
import { MapChart } from "@/components/ui/map-chart";
import { StackedBar } from "@/components/ui/stacked-bar";
import { SimpleBar } from "@/components/ui/simple-bar";
import CircularProgress from "@/components/ui/circular-progress";

// Colors for charts
const COLORS = [
  '#4299E1', // blue-500
  '#48BB78', // green-500
  '#F6AD55', // orange-400
  '#9F7AEA', // purple-500
  '#F56565', // red-500
  '#ED8936', // orange-500
  '#38B2AC', // teal-500
  '#667EEA', // indigo-500
  '#FC8181', // red-400
  '#68D391', // green-400
  '#4FD1C5', // teal-400
  '#A3BFFA', // indigo-300
  '#FBD38D', // yellow-400
  '#F687B3', // pink-400
  '#B794F4', // purple-400
];

// Add sample data as fallback
const sampleCarData = [
  { model_name: "Toyota Camry", price: 2500000, manufacturing_year: 2020, engine_capacity: "2.5L", spare_key: "Yes", transmission: "Automatic", km_driven: 15000, ownership: "First Owner", fuel_type: "Petrol", imperfections: "Minor Scratches", repainted_parts: "None", region: "delhi" },
  { model_name: "Honda Accord", price: 2200000, manufacturing_year: 2019, engine_capacity: "2.0L", spare_key: "Yes", transmission: "Automatic", km_driven: 20000, ownership: "Second Owner", fuel_type: "Petrol", imperfections: "None", repainted_parts: "Front Bumper", region: "mumbai" },
  { model_name: "Ford Mustang", price: 4500000, manufacturing_year: 2021, engine_capacity: "5.0L", spare_key: "Yes", transmission: "Manual", km_driven: 5000, ownership: "First Owner", fuel_type: "Petrol", imperfections: "None", repainted_parts: "None", region: "bangalore" },
  { model_name: "Tesla Model 3", price: 4800000, manufacturing_year: 2022, engine_capacity: "Electric", spare_key: "Yes", transmission: "Automatic", km_driven: 8000, ownership: "First Owner", fuel_type: "Electric", imperfections: "None", repainted_parts: "None", region: "pune" },
  { model_name: "BMW 3 Series", price: 3800000, manufacturing_year: 2020, engine_capacity: "2.0L", spare_key: "Yes", transmission: "Automatic", km_driven: 18000, ownership: "First Owner", fuel_type: "Diesel", imperfections: "Minor Scratches", repainted_parts: "Front Door", region: "chennai" },
  { model_name: "Audi A4", price: 3500000, manufacturing_year: 2021, engine_capacity: "2.0L", spare_key: "Yes", transmission: "Automatic", km_driven: 12000, ownership: "First Owner", fuel_type: "Petrol", imperfections: "None", repainted_parts: "None", region: "delhi" },
  { model_name: "Hyundai Tucson", price: 2800000, manufacturing_year: 2022, engine_capacity: "2.0L", spare_key: "Yes", transmission: "Automatic", km_driven: 9000, ownership: "First Owner", fuel_type: "Diesel", imperfections: "None", repainted_parts: "None", region: "hyderabad" },
  { model_name: "Mahindra XUV700", price: 2200000, manufacturing_year: 2022, engine_capacity: "2.2L", spare_key: "Yes", transmission: "Manual", km_driven: 7500, ownership: "First Owner", fuel_type: "Diesel", imperfections: "None", repainted_parts: "None", region: "lucknow" },
  { model_name: "Kia Seltos", price: 1800000, manufacturing_year: 2021, engine_capacity: "1.5L", spare_key: "Yes", transmission: "Manual", km_driven: 10000, ownership: "First Owner", fuel_type: "Petrol", imperfections: "Minor Scratches", repainted_parts: "None", region: "jaipur" },
  { model_name: "Tata Nexon", price: 1500000, manufacturing_year: 2022, engine_capacity: "1.5L", spare_key: "Yes", transmission: "Manual", km_driven: 5000, ownership: "First Owner", fuel_type: "Diesel", imperfections: "None", repainted_parts: "None", region: "kolkata" },
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
  
  // Add state for chart tabs
  const [analysisTab, setAnalysisTab] = useState("distribution");
  
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

  // Additional utility functions for new chart data
  const getRegionDistribution = (data) => {
    if (!data.length) return [];
    
    const regions = {};
    data.forEach(car => {
      if (car.region) {
        regions[car.region] = (regions[car.region] || 0) + 1;
      }
    });
    
    return Object.entries(regions).map(([region, count]) => ({
      region,
      value: count
    }));
  };

  const getPriceByFuelType = (data) => {
    if (!data.length) return [];
    
    // Group cars by model and calculate stats
    const modelStats = {};
    data.forEach(car => {
      if (!modelStats[car.model_name]) {
        modelStats[car.model_name] = {
          name: car.model_name,
          Petrol: 0,
          Diesel: 0,
          Electric: 0,
          Hybrid: 0,
          CNG: 0,
          Other: 0,
          totalPrice: 0,
          count: 0
        };
      }
      
      // Add price to appropriate fuel type
      const fuelType = car.fuel_type || 'Other';
      if (['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'].includes(fuelType)) {
        modelStats[car.model_name][fuelType] += 1;
      } else {
        modelStats[car.model_name].Other += 1;
      }
      
      modelStats[car.model_name].totalPrice += car.price;
      modelStats[car.model_name].count += 1;
    });
    
    // Convert to array and sort by total price
    return Object.values(modelStats)
      .map(stat => ({
        ...stat,
        averagePrice: stat.totalPrice / stat.count
      }))
      .sort((a, b) => b.totalPrice - a.totalPrice)
      .slice(0, 5); // Top 5 models by total value
  };

  const getOwnershipData = (data) => {
    if (!data.length) return [];
    
    const ownershipCounts = {};
    data.forEach(car => {
      const ownership = car.ownership || 'Unknown';
      ownershipCounts[ownership] = (ownershipCounts[ownership] || 0) + 1;
    });
    
    return Object.entries(ownershipCounts).map(([name, value]) => ({ name, value }));
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
        
        {/* Chart Analysis Tabs */}
        <Tabs defaultValue="distribution" value={analysisTab} onValueChange={setAnalysisTab} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="regional">Regional Analysis</TabsTrigger>
            <TabsTrigger value="comparison">Model Comparison</TabsTrigger>
            <TabsTrigger value="ownership">Ownership</TabsTrigger>
          </TabsList>
          
          {/* Distribution Tab */}
          <TabsContent value="distribution" className="mt-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {/* Fuel Type Distribution as Pie Chart */}
              <Card className="col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <PieChartIcon className="mr-2 h-5 w-5" /> Fuel Type Distribution
                  </CardTitle>
                  <CardDescription>
                    Cars by fuel type (Pie Chart)
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {loading ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-muted-foreground">Loading data...</p>
                    </div>
                  ) : error && !filteredData.length ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-red-500">{error}</p>
                    </div>
                  ) : (
                    <div className="w-full h-full relative">
                      <PieChart 
                        data={Object.entries(getFuelTypeCounts()).map(([name, value]) => ({ name, value }))}
                        nameKey="name"
                        valueKey="value"
                        showLabels={true}
                        tooltip="chart-tooltip"
                      />
                      <div className="absolute bottom-4 right-4 bg-white/80 p-2 rounded text-xs shadow">
                        {Object.entries(getFuelTypeCounts()).map(([name, value], index) => (
                          <div key={name} className="flex items-center gap-1 mb-1">
                            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                            <span>{name} ({value})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Transmission as Donut Chart */}
              <Card className="col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <PieChartIcon className="mr-2 h-5 w-5" /> Transmission Distribution
                  </CardTitle>
                  <CardDescription>
                    Cars by transmission type (Donut Chart)
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {loading ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-muted-foreground">Loading data...</p>
                    </div>
                  ) : error && !filteredData.length ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-red-500">{error}</p>
                    </div>
                  ) : (
                    <div className="w-full h-full relative">
                      <PieChart 
                        data={Object.entries(getTransmissionCounts()).map(([name, value]) => ({ name, value }))}
                        nameKey="name"
                        valueKey="value"
                        innerRadius={25}
                        showLabels={true}
                        tooltip="chart-tooltip"
                      />
                      <div className="absolute bottom-4 right-4 bg-white/80 p-2 rounded text-xs shadow">
                        {Object.entries(getTransmissionCounts()).map(([name, value], index) => (
                          <div key={name} className="flex items-center gap-1 mb-1">
                            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                            <span>{name} ({value})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Price Distribution */}
              <Card className="col-span-1 lg:col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <BarChart className="mr-2 h-5 w-5" /> Price Distribution
                  </CardTitle>
                  <CardDescription>
                    Cars by price range (in lakhs)
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
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
                    <div className="h-[250px] overflow-x-auto overflow-y-hidden max-w-full">
                      <div className="flex items-end justify-center gap-1 pt-4 mt-4 min-w-[500px] h-[220px]">
                        {(() => {
                          // Find the maximum count to calculate relative heights
                          const counts = Object.values(getPriceDistribution());
                          const maxCount = Math.max(...counts);
                          const maxHeight = 200; // Maximum height in pixels
                          
                          return Object.entries(getPriceDistribution()).map(([priceRange, count]) => {
                            // Calculate relative height
                            const relativeHeight = Math.max((count / maxCount) * maxHeight, 20);
                            
                            return (
                              <div key={priceRange} className="flex flex-col items-center">
                                <div 
                                  className="bg-green-500 w-8 rounded-t-md hover:bg-green-600 transition-colors"
                                  style={{ height: `${relativeHeight}px` }}
                                >
                                  <div className="invisible">.</div>
                                </div>
                                <div className="text-xs mt-2 text-center">
                                  <div className="font-medium">{priceRange}</div>
                                  <div className="text-muted-foreground">{count} cars</div>
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Regional Analysis Tab */}
          <TabsContent value="regional" className="mt-4">
            <div className="grid gap-4 grid-cols-1">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <MapPin className="mr-2 h-5 w-5" /> Regional Distribution
                  </CardTitle>
                  <CardDescription>
                    Car distribution by region (Map Chart)
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  {loading ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-muted-foreground">Loading data...</p>
                    </div>
                  ) : error && !filteredData.length ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-red-500">{error}</p>
                    </div>
                  ) : (
                    <div className="w-full h-full overflow-auto relative">
                      <div className="min-w-[320px] min-h-[350px] w-full h-full">
                        <MapChart 
                          data={getRegionDistribution(filteredData)}
                          idKey="region"
                          valueKey="value"
                          tooltip="chart-tooltip"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Model Comparison Tab */}
          <TabsContent value="comparison" className="mt-4">
            <div className="grid gap-4 grid-cols-1">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <BarChart3 className="mr-2 h-5 w-5" /> Model Comparison by Fuel Type
                  </CardTitle>
                  <CardDescription>
                    Top car models by fuel type distribution (Stacked Bar Chart)
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  {loading ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-muted-foreground">Loading data...</p>
                    </div>
                  ) : error && !filteredData.length ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-red-500">{error}</p>
                    </div>
                  ) : (
                    <div className="relative w-full h-full">
                      <div className="w-full h-full overflow-x-auto">
                        <div className="min-w-[500px] min-h-[350px] w-full h-full">
                          <StackedBar 
                            data={getPriceByFuelType(filteredData)}
                            keys={['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG', 'Other']}
                            indexBy="name"
                            layout="horizontal"
                            tooltip="chart-tooltip"
                          />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-6 pointer-events-none bg-gradient-to-r from-transparent via-transparent to-background/80"></div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Ownership Tab */}
          <TabsContent value="ownership" className="mt-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Users className="mr-2 h-5 w-5" /> Ownership Distribution
                  </CardTitle>
                  <CardDescription>
                    Cars by ownership status (Donut Chart)
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {loading ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-muted-foreground">Loading data...</p>
                    </div>
                  ) : error && !filteredData.length ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-red-500">{error}</p>
                    </div>
                  ) : (
                    <div className="w-full h-full relative">
                      <PieChart 
                        data={getOwnershipData(filteredData)}
                        innerRadius={30}
                        showLabels={true}
                        tooltip="chart-tooltip"
                      />
                      <div className="absolute bottom-4 right-4 bg-white/80 p-2 rounded text-xs shadow">
                        {getOwnershipData(filteredData).map((item, index) => (
                          <div key={item.name} className="flex items-center gap-1 mb-1">
                            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                            <span>{item.name} ({item.value})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="col-span-12 md:col-span-6">
                <CardHeader>
                  <CardTitle>Top Models</CardTitle>
                  <CardDescription>Most common car models in inventory</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <CircularProgress />
                    </div>
                  ) : error ? (
                    <div className="flex items-center justify-center h-full text-red-500">
                      Error loading data
                    </div>
                  ) : getTopModels().length === 0 ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No model data available
                    </div>
                  ) : (
                    <SimpleBar
                      data={getTopModels().slice(0, 8)}
                      valueKey="count"
                      labelKey="model"
                      colors={['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE', '#EFF6FF']}
                      layout="horizontal"
                      tooltip="chart-tooltip"
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
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
            <CardContent>
              <div className="relative">
                <div className="overflow-x-auto max-w-full pb-2">
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
                    <div className="h-[250px] overflow-x-auto overflow-y-hidden max-w-full">
                      <div className="flex items-end justify-center gap-1 pt-4 mt-4 min-w-[500px] h-[220px]">
                        {(() => {
                          // Find the maximum count to calculate relative heights
                          const counts = Object.values(getYearDistribution());
                          const maxCount = Math.max(...counts);
                          const maxHeight = 200; // Maximum height in pixels
                          
                          return Object.entries(getYearDistribution()).map(([yearRange, count]) => {
                            // Calculate relative height
                            const relativeHeight = Math.max((count / maxCount) * maxHeight, 20);
                            
                            return (
                              <div key={yearRange} className="flex flex-col items-center">
                                <div 
                                  className="bg-blue-500 w-8 rounded-t-md hover:bg-blue-600 transition-colors"
                                  style={{ height: `${relativeHeight}px` }}
                                >
                                  <div className="invisible">.</div>
                                </div>
                                <div className="text-xs mt-2 text-center">
                                  <div className="font-medium">{yearRange}</div>
                                  <div className="text-muted-foreground">{count} cars</div>
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-6 pointer-events-none bg-gradient-to-r from-transparent via-transparent to-background/80"></div>
              </div>
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
            <CardContent>
              <div className="relative">
                <div className="overflow-x-auto max-w-full pb-2">
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
                    <div className="h-[250px] overflow-x-auto overflow-y-hidden max-w-full">
                      <div className="flex items-end justify-center gap-1 pt-4 mt-4 min-w-[500px] h-[220px]">
                        {(() => {
                          // Find the maximum count to calculate relative heights
                          const counts = Object.values(getPriceDistribution());
                          const maxCount = Math.max(...counts);
                          const maxHeight = 200; // Maximum height in pixels
                          
                          return Object.entries(getPriceDistribution()).map(([priceRange, count]) => {
                            // Calculate relative height
                            const relativeHeight = Math.max((count / maxCount) * maxHeight, 20);
                            
                            return (
                              <div key={priceRange} className="flex flex-col items-center">
                                <div 
                                  className="bg-green-500 w-8 rounded-t-md hover:bg-green-600 transition-colors"
                                  style={{ height: `${relativeHeight}px` }}
                                >
                                  <div className="invisible">.</div>
                                </div>
                                <div className="text-xs mt-2 text-center">
                                  <div className="font-medium">{priceRange}</div>
                                  <div className="text-muted-foreground">{count} cars</div>
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-6 pointer-events-none bg-gradient-to-r from-transparent via-transparent to-background/80"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard; 