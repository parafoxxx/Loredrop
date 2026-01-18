import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import { useAuth } from "@/hooks/use-auth.ts";
import { Authenticated, Unauthenticated } from "convex/react";
import { Zap, Search, Bell, Menu } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet.tsx";

export default function FeedHeader() {
  const { user } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/feed" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span
              className="text-xl font-bold tracking-tight hidden sm:block"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Loredrop
            </span>
          </Link>

          {/* Search - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search events, organizations..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-muted/50 border border-border/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Search */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="w-5 h-5" />
            </Button>

            <Authenticated>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
              </Button>

              <div className="hidden sm:flex items-center gap-3 pl-2 border-l border-border/50 ml-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-medium text-sm">
                  {user?.profile.name?.charAt(0) || "U"}
                </div>
              </div>
            </Authenticated>

            <Unauthenticated>
              <SignInButton>
                <Button size="sm">Sign In</Button>
              </SignInButton>
            </Unauthenticated>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="sm:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col gap-4 mt-8">
                  <Authenticated>
                    <div className="flex items-center gap-3 pb-4 border-b border-border">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-medium">
                        {user?.profile.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="font-medium">{user?.profile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user?.profile.email}
                        </p>
                      </div>
                    </div>
                  </Authenticated>
                  <Link
                    to="/feed"
                    className="py-2 text-sm font-medium hover:text-primary transition-colors"
                  >
                    For You
                  </Link>
                  <Link
                    to="/feed?filter=upcoming"
                    className="py-2 text-sm font-medium hover:text-primary transition-colors"
                  >
                    Upcoming Events
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <div className="md:hidden pb-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search events, organizations..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-muted/50 border border-border/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
