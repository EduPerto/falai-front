/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Eduardo Oliveira                                                     │
│ @file: /components/sidebar.tsx                                               │
│ Developed by: Eduardo Oliveira                                                │
│ Creation date: May 13, 2025                                                  │
│ Contact: contato@evolution-api.com                                           │
├──────────────────────────────────────────────────────────────────────────────┤
│ @copyright © FalAI 2025. All rights reserved.                        │
│ Licensed under the Apache License, Version 2.0                               │
│                                                                              │
│ You may not use this file except in compliance with the License.             │
│ You may obtain a copy of the License at                                      │
│                                                                              │
│    http://www.apache.org/licenses/LICENSE-2.0                                │
│                                                                              │
│ Unless required by applicable law or agreed to in writing, software          │
│ distributed under the License is distributed on an "AS IS" BASIS,            │
│ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.     │
│ See the License for the specific language governing permissions and          │
│ limitations under the License.                                               │
├──────────────────────────────────────────────────────────────────────────────┤
│ @important                                                                   │
│ For any future changes to the code in this file, it is recommended to        │
│ include, together with the modification, the information of the developer    │
│ who changed it and the date of modification.                                 │
└──────────────────────────────────────────────────────────────────────────────┘
*/
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  MessageSquare,
  Grid3X3,
  Server,
  Users,
  User,
  Shield,
  LogOut,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  FileText,
  ExternalLink,
  ChevronsLeft,
  ChevronsRight,
  Menu,
  UserCog,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslation } from "@/lib/i18n";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const updateUserRole = () => {
      if (typeof window !== "undefined") {
        const user = localStorage.getItem("user");
        if (user) {
          try {
            const parsed = JSON.parse(user);
            setIsAdmin(!!parsed.is_admin);
          } catch { }
        }
      }
    };

    // Initial load
    updateUserRole();

    if (typeof window !== "undefined") {
      // Get saved sidebar state from localStorage
      const savedCollapsedState = localStorage.getItem("sidebar-collapsed");
      if (savedCollapsedState) {
        setIsCollapsed(savedCollapsedState === "true");
      }

      // Listen for user role changes (e.g., when impersonating a client)
      window.addEventListener('userRoleChanged', updateUserRole);

      // Cleanup
      return () => {
        window.removeEventListener('userRoleChanged', updateUserRole);
      };
    }
  }, []);

  // Save collapsed state to localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebar-collapsed", String(isCollapsed));
    }
  }, [isCollapsed]);

  const menuItems = isAdmin
    ? [
      {
        name: t('nav.users'),
        href: "/users",
        icon: UserCog,
      },
      {
        name: t('nav.clients'),
        href: "/clients",
        icon: Users,
      },
      {
        name: t('nav.mcp_servers'),
        href: "/mcp-servers",
        icon: Server,
      },
      {
        name: t('nav.documentation'),
        href: "/documentation",
        icon: FileText,
      },
    ]
    : [
      {
        name: t('nav.agents'),
        href: "/agents",
        icon: Grid3X3,
      },
      {
        name: t('nav.chat'),
        href: "/chat",
        icon: MessageSquare,
      },
      {
        name: t('nav.documentation'),
        href: "/documentation",
        icon: FileText,
      },
    ];

  const userMenuItems = [
    {
      name: t('nav.profile'),
      href: "/profile",
      icon: User,
      onClick: () => { }
    },
    {
      name: t('nav.security'),
      href: "/security",
      icon: Shield,
      onClick: () => { }
    },
    {
      name: t('nav.logout'),
      href: "#",
      icon: LogOut,
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        setLogoutDialogOpen(true)
        setUserMenuOpen(false)
      }
    },
  ];

  const handleLogout = () => {
    setLogoutDialogOpen(false)
    router.push("/logout")
  }

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={cn(
        "bg-neutral-900 text-white flex flex-col h-full transition-all duration-300 ease-in-out border-r border-neutral-800",
        isCollapsed ? "w-16" : "w-56"
      )}
    >
      <TooltipProvider delayDuration={300}>
        <div className={cn("p-4 mb-6 flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
          <Link href="/">
            {isCollapsed ? (
              <div className="h-10 w-10 flex items-center justify-center bg-neutral-800/50 rounded-full p-1">
                <Image
                  src="/favicon-falai.svg"
                  alt="FalAI"
                  width={40}
                  height={40}
                />
              </div>
            ) : (
              <Image
                src="/logo-falai.svg"
                alt="FalAI"
                width={90}
                height={40}
                className="mt-2"
              />
            )}
          </Link>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleSidebar}
                className="flex items-center justify-center p-1.5 rounded-full bg-neutral-800 text-neutral-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
              >
                {isCollapsed ? (
                  <ChevronsRight className="h-4 w-4" />
                ) : (
                  <ChevronsLeft className="h-4 w-4" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-neutral-800 text-white border-neutral-700">
              {isCollapsed ? t('nav.expand_sidebar') : t('nav.collapse_sidebar')}
            </TooltipContent>
          </Tooltip>
        </div>

        <nav className="space-y-1.5 flex-1 px-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href);

            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all",
                      isCollapsed ? "justify-center" : "",
                      isActive
                        ? isCollapsed
                          ? "bg-blue-500/20 text-blue-400 border-0"
                          : "bg-blue-500/10 text-blue-400 border-l-2 border-blue-500"
                        : "text-neutral-400 hover:text-blue-400 hover:bg-neutral-800"
                    )}
                  >
                    <item.icon className={cn("flex-shrink-0", isActive ? "h-5 w-5 text-blue-400" : "h-5 w-5")} />
                    {!isCollapsed && <span className="font-medium">{item.name}</span>}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right" className="bg-neutral-800 text-white border-neutral-700">
                    {item.name}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </nav>

        <div className={cn("border-t border-neutral-800 pt-4 mt-2 pb-4", isCollapsed ? "px-2" : "px-4")}>
          <div className="mb-4 relative">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => !isCollapsed && setUserMenuOpen(!userMenuOpen)}
                  className={cn(
                    "w-full flex items-center transition-colors rounded-md px-3 py-2.5",
                    isCollapsed ? "justify-center" : "justify-between",
                    userMenuOpen
                      ? "bg-blue-500/10 text-blue-400"
                      : "text-neutral-400 hover:text-blue-400 hover:bg-neutral-800"
                  )}
                >
                  <div className={cn("flex items-center", isCollapsed ? "gap-0" : "gap-3")}>
                    <User className={cn(userMenuOpen ? "text-blue-400" : "text-neutral-400", "h-5 w-5")} />
                    {!isCollapsed && <span className="font-medium">{t('nav.my_account')}</span>}
                  </div>
                  {!isCollapsed && (
                    userMenuOpen ? (
                      <ChevronUp className="h-4 w-4 text-blue-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )
                  )}
                </button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right" className="bg-neutral-800 text-white border-neutral-700">
                  {t('nav.my_account')}
                </TooltipContent>
              )}
            </Tooltip>

            {userMenuOpen && !isCollapsed && (
              <div className="absolute bottom-full left-0 w-full mb-1 bg-neutral-800 rounded-md overflow-hidden border border-neutral-700">
                {userMenuItems.map((item) => {
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={item.onClick}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 transition-colors",
                        isActive
                          ? "bg-blue-500/10 text-blue-400"
                          : "text-neutral-400 hover:text-blue-400 hover:bg-neutral-700"
                      )}
                    >
                      <item.icon className={cn(isActive ? "text-blue-400" : "", "h-5 w-5")} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {!isCollapsed && (
            <>
              <div className="text-sm text-blue-400 font-medium">FalAI</div>
              <div className="text-xs text-neutral-500 mt-1">
                © {new Date().getFullYear()} FalAI
              </div>
            </>
          )}
        </div>
      </TooltipProvider>

      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="bg-neutral-900 border-neutral-800 text-white">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-full bg-orange-500/20">
                <AlertCircle className="h-5 w-5 text-orange-500" />
              </div>
              <DialogTitle>{t('nav.logout_confirmation')}</DialogTitle>
            </div>
            <DialogDescription className="text-neutral-400">
              {t('nav.logout_message')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setLogoutDialogOpen(false)}
              className="bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700 hover:text-white"
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleLogout}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              {t('nav.yes_logout')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
