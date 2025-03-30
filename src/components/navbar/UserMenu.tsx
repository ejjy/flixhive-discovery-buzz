
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserButton, SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';

const UserMenu = () => {
  return (
    <>
      <SignedIn>
        <UserButton 
          afterSignOutUrl="/"
          appearance={{
            elements: {
              userButtonAvatarBox: "w-9 h-9"
            }
          }}
        />
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <Button className="bg-flixhive-accent hover:bg-flixhive-accent/90">
            Sign In
          </Button>
        </SignInButton>
      </SignedOut>
    </>
  );
};

export default UserMenu;
