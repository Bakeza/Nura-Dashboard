
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import AuthService from '@/services/auth';
import { useNavigate } from 'react-router-dom';
import { User, KeyRound, Clock, Shield } from 'lucide-react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const MyAccount = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [activeView, setActiveView] = useState<string>('profile');
  const navigate = useNavigate();
  
  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setEmail(currentUser.email || '');
      setName(currentUser.name || '');
    }
  }, []);
  
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call for profile update
    setTimeout(() => {
      const updatedUser = { ...user, name };
      localStorage.setItem('neurocog_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setLoading(false);
      toast.success("Profile updated successfully");
    }, 500);
  };
  
  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Password update functionality would be implemented here");
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return email ? email[0].toUpperCase() : 'U';
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'profile':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Update your account information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="profile">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">
                  <form onSubmit={handleProfileUpdate} className="space-y-6 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">
                        Email address cannot be changed
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialty">Specialty</Label>
                      <Input
                        id="specialty"
                        placeholder="Your specialty or role (optional)"
                      />
                    </div>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Updating..." : "Save Changes"}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="security">
                  <form onSubmit={handlePasswordUpdate} className="space-y-6 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                      />
                    </div>
                    <Button type="submit">Update Password</Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        );
      case 'security':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="two-factor">
                  <AccordionTrigger>Two-Factor Authentication</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Two-factor authentication adds an extra layer of security to your account. 
                      In addition to your password, you'll need to enter a code from your phone.
                    </p>
                    <Button variant="outline">Enable 2FA</Button>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="trusted-devices">
                  <AccordionTrigger>Trusted Devices</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Currently signed in on the following devices:
                      </p>
                      <div className="rounded-md border p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Current device</p>
                            <p className="text-sm text-muted-foreground">Last active: Just now</p>
                          </div>
                          <Button variant="ghost" size="sm">This device</Button>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="login-activity">
                  <AccordionTrigger>Recent Login Activity</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="rounded-md border p-3">
                        <p className="font-medium">Successful login</p>
                        <p className="text-sm text-muted-foreground">Today, 12:34 PM • Current device</p>
                      </div>
                      <div className="rounded-md border p-3">
                        <p className="font-medium">Successful login</p>
                        <p className="text-sm text-muted-foreground">Yesterday, 9:15 AM • Unknown device</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        );
      case 'session-history':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Session History</CardTitle>
              <CardDescription>
                Review your past sessions and activity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-6">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="flex border-b pb-4">
                    <div className="w-16 h-16 mr-4 bg-primary/10 rounded-full flex items-center justify-center">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Session #{item}</h3>
                      <p className="text-xs text-muted-foreground">
                        {new Date(Date.now() - item * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </p>
                      <p className="text-sm mt-1">
                        Patient assessment completed
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" size="sm">View Details</Button>
                        <Button variant="ghost" size="sm">Download</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      case 'privacy':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control how your data is used and shared
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-base font-medium">Data Collection Preferences</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Control how we collect and use your data for improving our services.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Input type="checkbox" id="analytics" className="w-4 h-4" />
                      <Label htmlFor="analytics">Allow analytics collection</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input type="checkbox" id="personalization" className="w-4 h-4" />
                      <Label htmlFor="personalization">Allow personalized recommendations</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input type="checkbox" id="marketing" className="w-4 h-4" />
                      <Label htmlFor="marketing">Receive marketing emails</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-medium">Data Controls</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Manage or delete your data from our systems.
                  </p>
                  <div className="flex flex-col gap-2">
                    <Button variant="outline">Download my data</Button>
                    <Button variant="outline" className="text-destructive">
                      Delete my account
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Button variant="default">Save Privacy Preferences</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4 mb-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user?.profileImage} />
                  <AvatarFallback className="text-xl bg-primary/10 text-primary">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h2 className="text-xl font-semibold">{name || "User"}</h2>
                  <p className="text-muted-foreground">{email}</p>
                  <p className="text-sm text-muted-foreground capitalize mt-1">
                    {user?.role || "Patient"}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div 
                  className={`flex items-center p-2 rounded-md hover:bg-accent cursor-pointer ${activeView === 'profile' ? 'bg-accent' : ''}`}
                  onClick={() => setActiveView('profile')}
                >
                  <User size={18} className="mr-2 text-muted-foreground" />
                  <span>Profile</span>
                </div>
                <div 
                  className={`flex items-center p-2 rounded-md hover:bg-accent cursor-pointer ${activeView === 'security' ? 'bg-accent' : ''}`}
                  onClick={() => setActiveView('security')}
                >
                  <KeyRound size={18} className="mr-2 text-muted-foreground" />
                  <span>Security</span>
                </div>
                <div 
                  className={`flex items-center p-2 rounded-md hover:bg-accent cursor-pointer ${activeView === 'session-history' ? 'bg-accent' : ''}`}
                  onClick={() => setActiveView('session-history')}
                >
                  <Clock size={18} className="mr-2 text-muted-foreground" />
                  <span>Session History</span>
                </div>
                <div 
                  className={`flex items-center p-2 rounded-md hover:bg-accent cursor-pointer ${activeView === 'privacy' ? 'bg-accent' : ''}`}
                  onClick={() => setActiveView('privacy')}
                >
                  <Shield size={18} className="mr-2 text-muted-foreground" />
                  <span>Privacy</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => AuthService.logout()}
              >
                Sign Out
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          {renderActiveView()}
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
