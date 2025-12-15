/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Eduardo Oliveira                                                     │
│ @file: /app/login/page.tsx                                                   │
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

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { login, getMe, resendVerification } from "@/services/authService";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isEmailNotVerified, setIsEmailNotVerified] = useState(false);
  const [isResendingVerification, setIsResendingVerification] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");
    setIsEmailNotVerified(false);

    try {
      const response = await login({
        email: loginData.email,
        password: loginData.password,
      });

      // Suporta ambos formatos de resposta:
      // Formato evo-ai: { access_token: "..." }
      // Formato backend atual: { status: "success", data: { token: "...", user: {...} } }
      const token = response.data.access_token || response.data.data?.token;
      const user = response.data.data?.user;

      if (token) {
        document.cookie = `access_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`;

        try {
          const meResponse = await getMe();
          const userData = meResponse.data;

          const userDataToStore = {
            ...userData,
            id: userData.id,
            email: userData.email,
            name: userData.name,
            is_admin: userData.is_admin,
            is_active: userData.is_active,
            email_verified: userData.email_verified,
            created_at: userData.created_at,
            client_id: userData.client_id,
          };

          localStorage.setItem("user", JSON.stringify(userDataToStore));
          // Also save user data as cookie for middleware to read
          document.cookie = `user=${encodeURIComponent(JSON.stringify(userDataToStore))}; path=/; max-age=${60 * 60 * 24 * 7}`;

          if (userData.is_admin) {
            router.push("/users");
          } else {
            router.push("/agents");
          }
        } catch (meError) {
          console.error("Error fetching user data:", meError);

          if (user) {
            const fallbackUserData = {
              id: user.id,
              email: user.email,
              name: user.name || "",
              is_admin: user.role === "admin",
              is_active: user.active,
              email_verified: true,
              created_at: user.created_at,
              project_id: user.project_id,
            };
            localStorage.setItem("user", JSON.stringify(fallbackUserData));
            // Also save user data as cookie for middleware to read
            document.cookie = `user=${encodeURIComponent(JSON.stringify(fallbackUserData))}; path=/; max-age=${60 * 60 * 24 * 7}`;
          }

          router.push("/agents");
        }
      } else {
        setLoginError(t("auth.login.token_not_received"));
      }
    } catch (error: any) {
      if (error?.response?.status === 403) {
        setLoginError(t("auth.login.email_not_verified"));
        setIsEmailNotVerified(true);
      } else {
        setLoginError(t("auth.login.check_credentials"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!loginData.email) return;

    setIsResendingVerification(true);
    try {
      await resendVerification({ email: loginData.email });
      toast({
        title: t("auth.login.verification_sent"),
        description: t("auth.login.verification_sent_desc"),
      });
    } catch (error: any) {
      toast({
        title: t("auth.login.error_sending_verification"),
        description:
          error?.response?.data?.detail ||
          t("auth.login.error_sending_verification_desc"),
        variant: "destructive",
      });
    } finally {
      setIsResendingVerification(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 p-4">
      <div className="mb-8">
        <Image
          src="/logo-falai.svg"
          alt="FalAI"
          width={140}
          height={30}
          priority
        />
      </div>

      <Card className="w-full max-w-md bg-[#1a1a1a] border-[#333]">
        <CardHeader>
          <CardTitle className="text-white">{t("auth.login.title")}</CardTitle>
          <CardDescription className="text-neutral-400">
            {t("auth.login.subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-neutral-300">
                  {t("auth.login.email")}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("auth.login.email_placeholder")}
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  required
                  className="bg-[#222] border-[#444] text-white placeholder:text-neutral-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-neutral-300">
                  {t("auth.login.password")}
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  required
                  className="bg-[#222] border-[#444] text-white"
                />
              </div>

              {loginError && (
                <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-red-400">{loginError}</p>
                    {isEmailNotVerified && (
                      <Button
                        type="button"
                        variant="link"
                        className="text-blue-400 p-0 h-auto text-sm mt-1"
                        onClick={handleResendVerification}
                        disabled={isResendingVerification}
                      >
                        {isResendingVerification
                          ? t("auth.login.sending")
                          : t("auth.login.resend_verification")}
                      </Button>
                    )}
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-400 text-black hover:bg-[#00cc7d] font-medium"
                disabled={isLoading}
              >
                {isLoading ? t("auth.login.entering") : t("auth.login.submit")}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-xs text-neutral-500 text-center">
            {t("auth.terms")}{" "}
            <span className="text-blue-400">{t("auth.terms_of_service")}</span>{" "}
            {t("auth.and")}{" "}
            <span className="text-blue-400">{t("auth.privacy_policy")}</span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
