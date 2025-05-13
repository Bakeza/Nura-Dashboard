
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe, Moon, Sun, Bell, User, Lock, PanelLeft } from "lucide-react";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  
  const handleSettingsSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>
            Customize your application experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="appearance">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="appearance">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  <span className="hidden sm:inline">Appearance</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="language">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">Language</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span className="hidden sm:inline">Notifications</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="interface">
                <div className="flex items-center gap-2">
                  <PanelLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Interface</span>
                </div>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="appearance" className="py-4 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="theme" className="text-base font-medium">Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    Choose between light and dark mode
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant={theme === 'light' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setTheme('light')}
                  >
                    <Sun className="h-4 w-4 mr-1" /> Light
                  </Button>
                  <Button 
                    variant={theme === 'dark' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setTheme('dark')}
                  >
                    <Moon className="h-4 w-4 mr-1" /> Dark
                  </Button>
                  <Button 
                    variant={theme === 'system' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setTheme('system')}
                  >
                    System
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="language" className="py-4 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="language" className="text-base font-medium">Interface Language</Label>
                  <p className="text-sm text-muted-foreground">
                    Select your preferred language
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant={language === 'en' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setLanguage('en')}
                  >
                    English
                  </Button>
                  <Button 
                    variant={language === 'ar' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setLanguage('ar')}
                  >
                    العربية
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="py-4 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications" className="text-base font-medium">Enable Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications for important events
                    </p>
                  </div>
                  <Switch 
                    id="notifications"
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications" className="text-base font-medium">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch 
                    id="emailNotifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                    disabled={!notificationsEnabled}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="interface" className="py-4 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoSave" className="text-base font-medium">Auto Save</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically save changes
                    </p>
                  </div>
                  <Switch 
                    id="autoSave"
                    checked={autoSave}
                    onCheckedChange={setAutoSave}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="compactMode" className="text-base font-medium">Compact Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Use a more compact interface layout
                    </p>
                  </div>
                  <Switch 
                    id="compactMode"
                    checked={compactMode}
                    onCheckedChange={setCompactMode}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSettingsSave}>Save Settings</Button>
        </CardFooter>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Privacy & Security</CardTitle>
          <CardDescription>
            Manage your account security and privacy settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Button variant="outline" size="sm">Setup 2FA</Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-medium">Data Privacy</h3>
                <p className="text-sm text-muted-foreground">
                  Manage how your data is collected and used
                </p>
              </div>
              <Button variant="outline" size="sm">Privacy Settings</Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-medium">Activity Log</h3>
                <p className="text-sm text-muted-foreground">
                  View your account activity history
                </p>
              </div>
              <Button variant="outline" size="sm">View Log</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
