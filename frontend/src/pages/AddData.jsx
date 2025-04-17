import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon, Check, ChevronDown, Upload } from 'lucide-react';
import { format } from 'date-fns';
import axios from 'axios';

import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

// --- Car Form Validation Schema ---
const carFormSchema = z.object({
  model_name: z.string().min(2, { message: 'Model name must be at least 2 characters' }),
  price: z.coerce.number().positive({ message: 'Price must be a positive number' }),
  manufacturing_year: z.coerce.number()
    .min(1900, { message: 'Year must be 1900 or later' })
    .max(new Date().getFullYear() + 1, { message: `Year cannot be in the future` }),
  engine_capacity: z.string().optional(),
  spare_key: z.enum(['Yes', 'No'], { required_error: 'Spare key information is required' }),
  transmission: z.enum(['Automatic', 'Manual'], { required_error: 'Transmission type is required' }),
  km_driven: z.coerce.number().nonnegative({ message: 'KM driven must be 0 or more' }),
  ownership: z.string().min(1, { message: 'Ownership status is required' }), // Can be more specific if needed
  fuel_type: z.string().min(1, { message: 'Fuel type is required' }),
  imperfections: z.string().optional(),
  repainted_parts: z.string().optional(),
  region: z.string().min(2, { message: 'Region is required' }),
});
// --- End Car Form Schema ---


const AddData = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [csvFile, setCsvFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState({ text: '', type: '' });

  // --- Initialize form with Car Schema ---
  const form = useForm({
    resolver: zodResolver(carFormSchema),
    defaultValues: {
      model_name: '',
      price: '', // Keep as string initially for input field
      manufacturing_year: '', // Keep as string initially for input field
      engine_capacity: '',
      spare_key: undefined,
      transmission: undefined,
      km_driven: '', // Keep as string initially for input field
      ownership: '',
      fuel_type: '',
      imperfections: '',
      repainted_parts: '',
      region: '',
    },
  });
  // --- End Form Initialization ---

  // --- Handle Manual Car Entry Submission ---
  const handleCarSubmit = async (values) => {
    setIsSubmitting(true);
    setMessage({ text: '', type: '' });
    console.log('Submitting car data:', values);

    try {
      // POST data to the backend API endpoint for adding a single car
      const response = await axios.post('http://localhost:5000/api/csv/cars', values, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('API Response:', response.data);

      form.reset();
      setMessage({ text: 'Car added successfully!', type: 'success' });

    } catch (error) {
      console.error('Error submitting car form:', error);
      let errorMessage = 'An error occurred while adding the car. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setMessage({ text: errorMessage, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };
  // --- End Manual Car Entry Submission ---

  // --- Handle CSV Upload (Existing Logic) ---
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setCsvFile(e.target.files[0]);
      setUploadMessage({ text: '', type: '' });
    }
  };

  const handleCsvUpload = async (e) => {
    e.preventDefault();

    if (!csvFile) {
      setUploadMessage({ text: 'Please select a CSV file first', type: 'error' });
      return;
    }
    if (!csvFile.name.endsWith('.csv')) {
      setUploadMessage({ text: 'Only CSV files are allowed', type: 'error' });
      return;
    }

    setIsUploading(true);
    setUploadMessage({ text: '', type: '' });

    try {
      const formData = new FormData();
      formData.append('file', csvFile);

      // Use the combined upload/process endpoint
      const response = await axios.post('http://localhost:5000/api/csv/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Upload and process response:', response.data);
      setCsvFile(null);
      document.getElementById('csv-file-input').value = '';
      setUploadMessage({ text: `CSV processed: ${response.data.message || 'Success'}`, type: 'success' });

    } catch (error) {
      console.error('Error uploading/processing CSV:', error);
      let errorMessage = 'Failed to upload or process CSV file. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setUploadMessage({ text: errorMessage, type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };
  // --- End CSV Upload Logic ---

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Add Car Data</h2>
          <p className="text-muted-foreground mt-2">Manually add a new car entry or upload data from a CSV file.</p>
        </div>

        {/* --- Manual Car Entry Form --- */}
        <Card>
          <CardHeader>
            <CardTitle>Add Single Car Entry</CardTitle>
            <CardDescription>Fill in the details for the new car.</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCarSubmit)} className="space-y-6">
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="model_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model Name <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Toyota Camry" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (₹) <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 2500000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="manufacturing_year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manufacturing Year <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 2020" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="engine_capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Engine Capacity</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 2.5L" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="spare_key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Spare Key <span className="text-red-500">*</span></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="transmission"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transmission <span className="text-red-500">*</span></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select transmission type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Automatic">Automatic</SelectItem>
                          <SelectItem value="Manual">Manual</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="km_driven"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kilometers Driven <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 15000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ownership"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ownership <span className="text-red-500">*</span></FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select ownership status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="First Owner">First Owner</SelectItem>
                          <SelectItem value="Second Owner">Second Owner</SelectItem>
                          <SelectItem value="Third Owner">Third Owner</SelectItem>
                          <SelectItem value="Fourth Owner or More">Fourth Owner or More</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fuel_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fuel Type <span className="text-red-500">*</span></FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select fuel type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {/* Should ideally fetch these from a constant or API */}
                          <SelectItem value="Petrol">Petrol</SelectItem>
                          <SelectItem value="Diesel">Diesel</SelectItem>
                          <SelectItem value="Electric">Electric</SelectItem>
                          <SelectItem value="CNG">CNG</SelectItem>
                          <SelectItem value="LPG">LPG</SelectItem>
                          <SelectItem value="Hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="imperfections"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imperfections</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Minor scratches, Dent on bumper" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="repainted_parts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Repainted Parts</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Front bumper, Left door" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Region <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., delhi, mumbai" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-end">
        {message.text && (
                  <div className={`mr-4 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message.text}
          </div>
        )}
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Adding Car...' : 'Add Car Entry'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
        {/* --- End Manual Car Entry Form --- */}

        <Separator />

        {/* --- CSV Upload Section (Existing) --- */}
        <Card>
          <CardHeader>
            <CardTitle>Bulk Import Cars via CSV</CardTitle>
            <CardDescription>
              Upload a CSV file to import multiple car entries at once.
            </CardDescription>
          </CardHeader>

          {uploadMessage.text && (
             <CardContent className="pt-0 pb-0">
               <Alert variant={uploadMessage.type === 'success' ? 'default' : 'destructive'}>
                 <AlertTitle>{uploadMessage.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
                 <AlertDescription>{uploadMessage.text}</AlertDescription>
               </Alert>
             </CardContent>
           )}

          <CardContent>
            <form onSubmit={handleCsvUpload} className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="csv-file-input" className="text-sm font-medium">
                  Select CSV File
            </label>
                <Input
                  id="csv-file-input"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                 <div className="flex justify-between items-center">
                   <p className="text-sm text-muted-foreground">
                     File should be in CSV format with headers matching the manual form fields.
                   </p>
                   <a
                     href="/sample_cars.csv" // Make sure this sample file exists in public/
                     download
                     className="text-xs text-blue-600 hover:text-blue-800 underline"
                   >
                     Download Sample CSV
            </a>
          </div>
                 {/* Optional: Display headers if needed */}
                 {/* <div className="text-xs bg-muted p-2 rounded overflow-x-auto"> */}
                 {/*   <code>model_name,price,manufacturing_year,...</code> */}
                 {/* </div> */}
              </div>
              <Button
                type="submit"
                disabled={isUploading || !csvFile}
                className="w-full"
              >
                {isUploading ? (
                  'Uploading & Processing...'
                ) : (
                  <><Upload className="mr-2 h-4 w-4" /> Upload and Process CSV</>
                )}
              </Button>
        </form>
          </CardContent>
        </Card>
        {/* --- End CSV Upload Section --- */}

      </div>
    </Layout>
  );
};

export default AddData; 