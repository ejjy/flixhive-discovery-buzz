
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MovieDatabaseSection } from "@/components/admin/MovieDatabaseSection";
import Navbar from "@/components/navbar";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const AdminPanel = () => {
  const { currentUser, isSignedIn } = useAuth();
  
  // Check if user is admin (simplified for demo)
  // In a real application, you'd check for admin roles in your database
  const isAdmin = isSignedIn && currentUser?.email === "admin@flixhive.com";
  
  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-10 max-w-6xl">
        <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
        
        <Tabs defaultValue="database" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="database">Movie Database</TabsTrigger>
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="database">
            <MovieDatabaseSection />
          </TabsContent>
          
          <TabsContent value="api-keys">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Manage your API keys for different services</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  API keys are managed through Netlify environment variables.
                  Visit the Netlify dashboard to configure your API keys.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Configure application settings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Application settings can be managed here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
