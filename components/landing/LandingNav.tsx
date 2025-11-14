'use client'

import Link from "next/link";
import { Target, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

export function LandingNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="border-b border-background-500 bg-background-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Target className="h-6 w-6 text-foreground-800" />
          <span className="text-xl font-bold text-foreground-800">HabitTracker</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-foreground-700">
              Se connecter
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-foreground-800 text-background-100 hover:bg-foreground-700">
              S&apos;inscrire
            </Button>
          </Link>
        </div>

        {/* Mobile Navigation - Burger Menu */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground-800">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Ouvrir le menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background-200">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-foreground-800">
                  <Target className="h-5 w-5" />
                  HabitTracker
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-8 mx-5">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-foreground-700 text-lg"
                  >
                    Se connecter
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)}>
                  <Button 
                    className="w-full bg-foreground-800 cursor-pointer text-background-100 hover:bg-foreground-700 text-lg"
                  >
                    S&apos;inscrire
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
