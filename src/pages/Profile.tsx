import React from 'react';
import Navbar from '@/components/navbar';
import { UserProfile } from '@clerk/clerk-react';
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
                <Tabs defaultValue="account" className="w-full" orientation="vertical">
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
                <Button variant="destructive" className="w-full justify-start">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </Card>
          </div>
          
          {/* Main Content */}
          <div>
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
