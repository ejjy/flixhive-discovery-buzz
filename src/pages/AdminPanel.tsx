
import React from 'react';
import Navbar from '@/components/navbar';
import { 
  Shield, 
  Users, 
  Film, 
  MessageSquare,
  AlertCircle,
  Activity,
  BarChart,
  Search,
  Settings
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';

const AdminPanel = () => {
  // Mock data - in a real app, these would come from your API
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "User", status: "Active", joined: "2024-04-12" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Admin", status: "Active", joined: "2024-03-22" },
    { id: 3, name: "Robert Johnson", email: "robert@example.com", role: "User", status: "Suspended", joined: "2024-05-01" },
  ];
  
  const recentContent = [
    { id: 1, type: "Movie", title: "The Matrix Resurrections", status: "Published", author: "System", date: "2024-05-15" },
    { id: 2, type: "Review", title: "Review for Inception", status: "Flagged", author: "John Doe", date: "2024-05-14" },
    { id: 3, type: "Movie", title: "Dune: Part Two", status: "Pending", author: "System", date: "2024-05-13" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-flixhive-accent" />
          <h1 className="text-3xl font-bold">Admin Panel</h1>
        </div>
        
        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 flex flex-col items-center">
              <Users className="h-8 w-8 text-blue-500 mb-2" />
              <p className="text-2xl font-bold">1,243</p>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center">
              <Film className="h-8 w-8 text-purple-500 mb-2" />
              <p className="text-2xl font-bold">867</p>
              <p className="text-sm text-muted-foreground">Movies</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center">
              <MessageSquare className="h-8 w-8 text-green-500 mb-2" />
              <p className="text-2xl font-bold">3,752</p>
              <p className="text-sm text-muted-foreground">Reviews</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center">
              <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-muted-foreground">Issues</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="mb-8">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>View and manage users of the FlixHive platform.</CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search users..." 
                        className="pl-8 w-[250px]" 
                      />
                    </div>
                    <Button>Add User</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            user.role === "Admin" 
                              ? "bg-purple-500/20 text-purple-500" 
                              : "bg-blue-500/20 text-blue-500"
                          }`}>
                            {user.role}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            user.status === "Active" 
                              ? "bg-green-500/20 text-green-500" 
                              : "bg-red-500/20 text-red-500"
                          }`}>
                            {user.status}
                          </span>
                        </TableCell>
                        <TableCell>{user.joined}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Content Tab */}
          <TabsContent value="content">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Content Management</CardTitle>
                    <CardDescription>Manage movies, reviews, and other content.</CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search content..." 
                        className="pl-8 w-[250px]" 
                      />
                    </div>
                    <Button>Add Content</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentContent.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <span className="flex items-center gap-1">
                            {item.type === "Movie" ? <Film className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                            {item.type}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            item.status === "Published" 
                              ? "bg-green-500/20 text-green-500" 
                              : item.status === "Flagged"
                              ? "bg-red-500/20 text-red-500"
                              : "bg-orange-500/20 text-orange-500"
                          }`}>
                            {item.status}
                          </span>
                        </TableCell>
                        <TableCell>{item.author}</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Analytics & Reports</CardTitle>
                <CardDescription>Platform statistics and data insights.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12">
                  <BarChart className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Analytics Dashboard Coming Soon</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    We're building a comprehensive analytics dashboard to help you understand user behavior
                    and platform performance.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Admin Settings</CardTitle>
                <CardDescription>Configure platform behavior and settings.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12">
                  <Settings className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Settings Panel Coming Soon</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    Platform configuration options will be available here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Activity Log */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-flixhive-accent" />
              <CardTitle>Recent Activity</CardTitle>
            </div>
            <CardDescription>Recent admin actions and system events.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 pb-3 border-b border-flixhive-gray/30">
                <span className="bg-blue-500/20 p-2 rounded-full">
                  <Users className="h-4 w-4 text-blue-500" />
                </span>
                <div>
                  <p className="text-sm"><span className="font-medium">Jane Smith</span> updated user role for <span className="font-medium">Tom Wilson</span></p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 pb-3 border-b border-flixhive-gray/30">
                <span className="bg-purple-500/20 p-2 rounded-full">
                  <Film className="h-4 w-4 text-purple-500" />
                </span>
                <div>
                  <p className="text-sm"><span className="font-medium">System</span> added new movie <span className="font-medium">Dune: Part Two</span></p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 pb-3 border-b border-flixhive-gray/30">
                <span className="bg-red-500/20 p-2 rounded-full">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                </span>
                <div>
                  <p className="text-sm"><span className="font-medium">John Doe</span> flagged review for moderation</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <footer className="bg-flixhive-dark py-8 text-center text-white/60">
        <div className="container mx-auto px-4">
          <p>© 2024 FlixHive - AI-Powered Movie Reviews and Recommendations</p>
        </div>
      </footer>
    </div>
  );
};

export default AdminPanel;
