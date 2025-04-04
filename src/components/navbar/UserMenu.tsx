
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserButton, SignedIn, SignedOut, SignInButton, useClerk } from '@clerk/clerk-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Settings } from 'lucide-react';

const UserMenu = () => {
  const { signOut } = useClerk();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <>
      <SignedIn>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="cursor-pointer">
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-9 h-9"
                  }
                }}
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-flixhive-dark border-flixhive-gray/30">
            <DropdownMenuLabel className="text-white/90">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-flixhive-gray/30" />
            <DropdownMenuItem asChild className="hover:bg-flixhive-gray/30 cursor-pointer">
              <Link to="/profile" className="flex items-center gap-2 text-white/80 hover:text-white">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="hover:bg-flixhive-gray/30 cursor-pointer">
              <Link to="/profile?tab=preferences" className="flex items-center gap-2 text-white/80 hover:text-white">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-flixhive-gray/30" />
            <DropdownMenuItem 
              onClick={handleSignOut}
              className="text-red-400 hover:text-red-300 hover:bg-red-900/20 cursor-pointer flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <Button className="bg-transparent border border-white/30 text-amber-400 hover:bg-white/10 hover:text-amber-300">
            Sign In
          </Button>
        </SignInButton>
      </SignedOut>
    </>
  );
};

export default UserMenu;
