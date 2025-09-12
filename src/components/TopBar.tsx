import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Settings, BarChart3 } from 'lucide-react';
import logoImage from '@/assets/logo.jpg';

interface TopBarProps {
  onDashboardOpen: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onDashboardOpen }) => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <header className="h-16 bg-neutral-surface border-b border-border shadow-sm flex items-center justify-between px-4 z-50">
      {/* Left side - Sidebar trigger and Logo */}
      <div className="flex items-center gap-4">
        <SidebarTrigger className="hover:bg-muted p-2 rounded-lg transition-colors" />
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-forest-primary/10 flex items-center justify-center">
            <img 
              src={logoImage} 
              alt="Harita Hive" 
              className="w-6 h-6 object-cover"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-charcoal-primary">
              Harita Hive
            </h1>
            <span className="text-xs text-muted-foreground hidden sm:block">
              GeoAI Platform
            </span>
          </div>
        </div>
      </div>

      {/* Right side - Actions and User Menu */}
      <div className="flex items-center gap-3">
        {/* Dashboard Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onDashboardOpen}
          className="hidden md:flex items-center gap-2 hover:bg-forest-primary/10 hover:border-forest-primary/20"
        >
          <BarChart3 className="h-4 w-4" />
          Dashboard
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
              <Avatar className="h-8 w-8 border-2 border-forest-primary/20">
                <AvatarFallback className="bg-forest-primary text-white text-sm font-medium">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="text-sm font-medium text-charcoal-primary">
                  {user?.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  GeoAI Platform User
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={onDashboardOpen}
              className="cursor-pointer hover:bg-forest-primary/10"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-forest-primary/10">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleSignOut}
              className="cursor-pointer hover:bg-destructive/10 text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopBar;