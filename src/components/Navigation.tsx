"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ChefHat, 
  Package, 
  Lightbulb, 
  TrendingUp,
  CookingPot
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarFooter
} from '@/components/ui/sidebar';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Recipes', href: '/recipes', icon: CookingPot },
  { name: 'Cost Insights', href: '/insights', icon: Lightbulb },
  { name: 'Market Updates', href: '/market', icon: TrendingUp },
];

export function AppNavigation() {
  const pathname = usePathname();

  return (
    <Sidebar variant="sidebar" className="bg-sidebar border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
            <ChefHat size={24} />
          </div>
          <div>
            <h1 className="font-headline font-bold text-lg text-primary leading-none">EkoPlateCost</h1>
            <p className="text-xs text-muted-foreground mt-1">Restaurant cost control</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="px-2">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton 
                asChild 
                isActive={pathname === item.href}
                className={cn(
                  "flex items-center gap-3 py-6 px-4 rounded-xl transition-all duration-200",
                  pathname === item.href 
                    ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90" 
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Link href={item.href}>
                  <item.icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 text-[10px] text-muted-foreground text-center">
        &copy; {new Date().getFullYear()} EkoPlateCost Lagos
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}