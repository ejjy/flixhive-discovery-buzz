
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useClerk, UserProfile } from '@clerk/clerk-react';
import Navbar from '@/components/navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Film,
  LogOut
} from 'lucide-react';

const Profile = () => {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState('account');
  const { signOut } = useClerk();

  // Set the active tab based on URL parameter if it exists
  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
          {/* Sidebar Navigation */}
          <div className="space-y-4">
            <Card>
              <div className="p-6">
                <Tabs 
                  value={activeTab} 
                  onValueChange={setActiveTab} 
                  className="w-full" 
                  orientation="vertical"
                >
                  <TabsList className="flex flex-col h-auto bg-transparent space-y-1">
                    <TabsTrigger 
                      value="account" 
                      className="justify-start w-full"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Account
                    </TabsTrigger>
                    <TabsTrigger 
                      value="preferences" 
                      className="justify-start w-full"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Preferences
                    </TabsTrigger>
                    <TabsTrigger 
                      value="notifications" 
                      className="justify-start w-full"
                    >
                      <Bell className="mr-2 h-4 w-4" />
                      Notifications
                    </TabsTrigger>
                    <TabsTrigger 
                      value="privacy" 
                      className="justify-start w-full"
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Privacy
                    </TabsTrigger>
                    <TabsTrigger 
                      value="activity" 
                      className="justify-start w-full"
                    >
                      <Film className="mr-2 h-4 w-4" />
                      Activity
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="p-4 pt-0 border-t border-flixhive-gray/30">
                <Button 
                  variant="destructive" 
                  className="w-full justify-start"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </Card>
          </div>
          
          {/* Main Content */}
          <div>
            <Tabs value={activeTab} className="w-full">
              <TabsContent value="account">
                <Card>
                  <CardContent className="p-6">
                    <UserProfile 
                      appearance={{
                        elements: {
                          rootBox: "w-full",
                          card: "bg-transparent border-0 shadow-none",
                          pageScrollBox: "p-0"
                        }
                      }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="preferences">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Preferences</h2>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Theme Preferences</h3>
                        <p className="text-muted-foreground mb-4">Customize your viewing experience</p>
                        <div className="grid grid-cols-1 gap-4">
                          <div className="flex items-center justify-between">
                            <span>Dark Mode</span>
                            <span className="text-flixhive-accent">Enabled</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-flixhive-gray/30">
                        <h3 className="text-lg font-medium mb-2">Content Preferences</h3>
                        <p className="text-muted-foreground mb-4">Customize recommendation settings</p>
                        <div className="grid grid-cols-1 gap-4">
                          <div className="flex items-center justify-between">
                            <span>Show Adult Content</span>
                            <span className="text-destructive">Disabled</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Notifications</h2>
                    <p className="text-muted-foreground mb-6">Manage your notification preferences</p>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Email Notifications</span>
                        <span className="text-flixhive-accent">Enabled</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>New Reviews</span>
                        <span className="text-flixhive-accent">Enabled</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>New Recommendations</span>
                        <span className="text-flixhive-accent">Enabled</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="privacy">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Privacy Settings</h2>
                    <p className="text-muted-foreground mb-6">Manage your privacy and data settings</p>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Public Profile</span>
                        <span className="text-flixhive-accent">Enabled</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Show Activity History</span>
                        <span className="text-flixhive-accent">Enabled</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Data Collection</span>
                        <span className="text-destructive">Disabled</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Activity History</h2>
                    <p className="text-muted-foreground mb-6">Your recent activity on FlixHive</p>
                    <div className="space-y-4">
                      <div className="p-4 rounded-md bg-flixhive-gray/10">
                        <p className="text-sm text-muted-foreground">No recent activity to display.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <footer className="bg-flixhive-dark py-8 text-center text-white/60">
        <div className="container mx-auto px-4">
          <p>© 2024 FlixHive - AI-Powered Movie Reviews and Recommendations</p>
        </div>
      </footer>
    </div>
  );
};

export default Profile;
