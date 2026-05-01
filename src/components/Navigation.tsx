"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ChefHat, 
  PackageSearch, 
  Calculator, 
  TrendingUp,
  Settings,
  ShieldCheck,
  CookingPot,
  Store,
  Info,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter
} from '@/components/ui/sidebar';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Stock Taking', href: '/stock', icon: PackageSearch },
  { name: 'Recipe Composer', href: '/recipes', icon: CookingPot },
  { name: 'Cost Percentage', href: '/costing', icon: Calculator },
  { name: 'Profit Calculator', href: '/profit', icon: TrendingUp },
  { name: 'Market Updates', href: '/market', icon: Store },
  { name: 'Manager Tools', href: '/manager', icon: ShieldCheck },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const secondaryNav = [
  { name: 'About App', href: '/about', icon: Info },
  { name: 'Terms & Rules', href: '/terms', icon: FileText },
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
            <h1 className="font-headline font-bold text-lg text-primary leading-none">Kitchen Prof</h1>
            <p className="text-xs text-muted-foreground mt-1">food cost control/Analysis</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="px-2">
          <div className="px-3 mb-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Main Operations</p>
          </div>
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

          <div className="px-3 mt-6 mb-2 border-t pt-4">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Legal & Info</p>
          </div>
          {secondaryNav.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton 
                asChild 
                isActive={pathname === item.href}
                className={cn(
                  "flex items-center gap-3 py-5 px-4 rounded-xl transition-all duration-200",
                  pathname === item.href 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                )}
              >
                <Link href={item.href}>
                  <item.icon size={18} />
                  <span className="text-sm">{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 text-[10px] text-muted-foreground text-center">
        &copy; {new Date().getFullYear()} Kitchen Prof Lagos
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
