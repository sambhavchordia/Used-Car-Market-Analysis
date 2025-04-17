import Layout from '../components/Layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, FileText, LayoutDashboard, Plus, Settings, User } from "lucide-react";
import { Link } from "react-router-dom";

function Home() {
  // Get current time to customize greeting
  const currentHour = new Date().getHours();
  let greeting;
  
  if (currentHour < 12) {
    greeting = "Good Morning";
  } else if (currentHour < 18) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  // Quick action cards
  const quickActions = [
    {
      title: "Dashboard",
      description: "View your stats and analytics",
      icon: <LayoutDashboard className="h-5 w-5" />,
      link: "/dashboard",
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Add New Data",
      description: "Create a new entry",
      icon: <Plus className="h-5 w-5" />,
      link: "/add-data",
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Manage Data",
      description: "Edit or delete existing data",
      icon: <FileText className="h-5 w-5" />,
      link: "/crud-data",
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Profile Settings",
      description: "Update your account details",
      icon: <User className="h-5 w-5" />,
      link: "#",
      color: "bg-amber-100 text-amber-600",
    },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">{greeting}, User!</h2>
          <p className="text-muted-foreground">Welcome to your Shadbate Dashboard. Here's what you can do.</p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="p-4 pb-0">
                <div className={`rounded-full p-2 w-fit ${action.color}`}>
                  {action.icon}
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-3">
                <CardTitle className="text-base">{action.title}</CardTitle>
                <CardDescription className="text-sm mt-1">{action.description}</CardDescription>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Link to={action.link} className="w-full">
                  <Button variant="ghost" className="w-full justify-between">
                    Go to {action.title} <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-4 py-2 border-b last:border-0">
                    <div className={`rounded-full p-2 ${
                      ["bg-blue-100", "bg-green-100", "bg-amber-100", "bg-red-100", "bg-purple-100"][i % 5]
                    }`}>
                      {[
                        <FileText className="h-4 w-4 text-blue-600" />,
                        <Plus className="h-4 w-4 text-green-600" />,
                        <Settings className="h-4 w-4 text-amber-600" />,
                        <User className="h-4 w-4 text-red-600" />,
                        <LayoutDashboard className="h-4 w-4 text-purple-600" />
                      ][i % 5]}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {["Added new data", "Updated settings", "Viewed dashboard", "Edited profile", "Deleted record"][i % 5]}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {`${i + 1} ${i === 0 ? "hour" : "hours"} ago`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View All Activity</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
