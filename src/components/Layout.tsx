import { Navbar } from "@/components/Navbar";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSessionTimeout } from "@/services/session-manager";
import { BarChart, LayoutDashboard, Users } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const { t, language } = useLanguage();

  // Initialize session timeout tracking
  useSessionTimeout();

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div
        className={`min-h-screen flex w-full bg-background ${
          language === "ar" ? "flex-row-reverse" : ""
        }`}
      >
        <Sidebar side={language === "ar" ? "right" : "left"}>
          <div className="flex flex-col h-full">
            <div
              className={`flex items-center h-16 sm:h-20 px-4 sm:px-6 border-b border-sidebar-border ${
                language === "ar" ? "justify-end" : ""
              }`}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 flex items-center justify-center mr-3">
                  <img
                    src="/lovable-uploads/41067270-5c65-44fb-8d3b-89fc90445214.png"
                    alt="Nura Logo"
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-sidebar-foreground">
                  Nura
                </h1>
              </div>
            </div>

            <SidebarContent className="p-3">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={t("dashboard")}>
                    <Link
                      to="/dashboard"
                      className={
                        language === "ar"
                          ? "flex flex-row-reverse items-center w-full"
                          : ""
                      }
                    >
                      <LayoutDashboard
                        className={
                          language === "ar"
                            ? "ml-3 h-5 w-5 sm:h-6 sm:w-6"
                            : "mr-3 h-5 w-5 sm:h-6 sm:w-6"
                        }
                      />
                      <span className="text-base sm:text-lg">
                        {t("dashboard")}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={t("patients")}>
                    <Link
                      to="/patients"
                      className={
                        language === "ar"
                          ? "flex flex-row-reverse items-center w-full"
                          : ""
                      }
                    >
                      <Users
                        className={
                          language === "ar"
                            ? "ml-3 h-5 w-5 sm:h-6 sm:w-6"
                            : "mr-3 h-5 w-5 sm:h-6 sm:w-6"
                        }
                      />
                      <span className="text-base sm:text-lg">
                        {t("patients")}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={t("analysis")}>
                    <Link
                      to="/analysis"
                      className={
                        language === "ar"
                          ? "flex flex-row-reverse items-center w-full"
                          : ""
                      }
                    >
                      <BarChart
                        className={
                          language === "ar"
                            ? "ml-3 h-5 w-5 sm:h-6 sm:w-6"
                            : "mr-3 h-5 w-5 sm:h-6 sm:w-6"
                        }
                      />
                      <span className="text-base sm:text-lg">
                        {t("analysis")}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {/* <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={t('sessions')}>
                    <Link to="/sessions" className={language === 'ar' ? 'flex flex-row-reverse items-center w-full' : ''}>
                      <Calendar className={language === 'ar' ? 'ml-3 h-5 w-5 sm:h-6 sm:w-6' : 'mr-3 h-5 w-5 sm:h-6 sm:w-6'} />
                      <span className="text-base sm:text-lg">{t('sessions')}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem> */}
              </SidebarMenu>
            </SidebarContent>

            <div className="mt-auto p-4 sm:p-5 border-t border-sidebar-border">
              <div
                className={`flex items-center ${
                  language === "ar" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full bg-emerald-500 ${
                    language === "ar" ? "ml-3" : "mr-3"
                  }`}
                ></div>
                <span className="text-sm sm:text-base text-sidebar-foreground opacity-80">
                  {t("connected")}
                </span>
              </div>
            </div>
          </div>

          {/* Add SidebarRail for desktop collapsing functionality */}
          <SidebarRail />
        </Sidebar>

        <div className="flex flex-col flex-1">
          <Navbar />
          <main
            className={`flex-1 p-3 sm:p-6 overflow-auto ${
              language === "ar" ? "rtl" : "ltr"
            }`}
          >
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
