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

// Form validation schema
const formSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  description: z.string().optional(),
  category: z.string().min(1, { message: 'Category is required' }),
  priority: z.string(),
  dueDate: z.date().optional(),
  status: z.string(),
});

const AddData = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [csvFile, setCsvFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState({ text: '', type: '' });

  // Initialize form with react-hook-form and zod validation
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      priority: 'medium',
      dueDate: undefined,
      status: 'pending',
    },
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Form data submitted:', values);
      
      form.reset();
      
      setMessage({ 
        text: 'Data added successfully!', 
        type: 'success' 
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage({ 
        text: 'An error occurred. Please try again.', 
        type: 'error' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setCsvFile(e.target.files[0]);
      setUploadMessage({ text: '', type: '' });
    }
  };

  const handleCsvUpload = async (e) => {
    e.preventDefault();
    
    if (!csvFile) {
      setUploadMessage({ 
        text: 'Please select a CSV file first', 
        type: 'error' 
      });
      return;
    }

    // Validate file type
    if (!csvFile.name.endsWith('.csv')) {
      setUploadMessage({ 
        text: 'Only CSV files are allowed', 
        type: 'error' 
      });
      return;
    }

    setIsUploading(true);
    setUploadMessage({ text: '', type: '' });

    try {
      const formData = new FormData();
      formData.append('file', csvFile);

      // Log the FormData content for debugging
      console.log('Uploading file:', csvFile.name, 'Size:', csvFile.size, 'Type:', csvFile.type);

      // Simple direct upload without dynamic hostname
      const uploadResponse = await axios.post('http://localhost:5000/api/csv/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });

      console.log('Upload response:', uploadResponse.data);
      
      // If basic upload succeeds, now process the file
      setUploadMessage({ 
        text: 'File uploaded successfully! Processing data...', 
        type: 'success' 
      });
      
      try {
        // Process the uploaded file
        const processResponse = await axios.post('http://localhost:5000/api/csv/process', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        });
        
        console.log('Process response:', processResponse.data);
        
        setCsvFile(null);
        // Reset file input
        document.getElementById('csv-file-input').value = '';
        
        setUploadMessage({ 
          text: `CSV file processed successfully! ${processResponse.data.count || ''} records imported.`, 
          type: 'success' 
        });
      } catch (processError) {
        console.error('Error processing CSV:', processError);
        setUploadMessage({ 
          text: 'File uploaded but processing failed: ' + 
                (processError.response?.data?.message || processError.message), 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error uploading CSV:', error);
      // Show more detailed error information
      let errorMessage = 'Failed to upload CSV file. Please try again.';
      
      if (error.response) {
        // The request was made and the server responded with a status code outside 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        
        errorMessage = error.response.data?.message || 
                      `Server error: ${error.response.status} ${error.response.statusText}`;
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        errorMessage = 'No response received from server. Please check your connection and that the backend server is running on port 5000.';
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
        errorMessage = `Error: ${error.message}`;
      }
      
      setUploadMessage({ 
        text: errorMessage, 
        type: 'error' 
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Add New Data</h2>
          <p className="text-muted-foreground mt-2">Create a new entry or upload data from a CSV file.</p>
        </div>

        {/* CSV Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Bulk Import Data</CardTitle>
            <CardDescription>
              Upload a CSV file to import multiple entries at once.
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
                    File should be in CSV format with the following headers:
                  </p>
                  <a 
                    href="/sample_cars.csv" 
                    download 
                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    Download Sample CSV
                  </a>
                </div>
                <div className="text-xs bg-muted p-2 rounded overflow-x-auto">
                  <code>model_name,price,manufacturing_year,engine_capacity,spare_key,transmission,km_driven,ownership,fuel_type,imperfections,repainted_parts</code>
                </div>
              </div>
              <Button 
                type="submit" 
                disabled={isUploading || !csvFile}
                className="w-full"
              >
                {isUploading ? (
                  <span className="flex items-center">
                    <span className="mr-2">Uploading...</span>
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload CSV
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Separator className="my-4" />

        {/* Manual Entry Form */}
        <Card>
          <CardHeader>
            <CardTitle>Manual Entry</CardTitle>
            <CardDescription>
              Fill in the information below to create a new record manually.
            </CardDescription>
          </CardHeader>
          
          {message.text && (
            <CardContent className="pt-0 pb-0">
              <Alert variant={message.type === 'success' ? 'default' : 'destructive'}>
                <AlertTitle>{message.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            </CardContent>
          )}
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter description" 
                          className="resize-none min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter category" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Due Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <CardFooter className="flex justify-between px-0 pb-0">
                  <Button 
                    variant="outline" 
                    type="button" 
                    onClick={() => form.reset()}
                  >
                    Reset
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AddData; 