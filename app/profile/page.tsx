/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Eduardo Oliveira                                                     │
│ @file: /app/profile/page.tsx                                                 │
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
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Globe } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslation, getLanguageName, getAvailableLanguages, type Language } from '@/lib/i18n'
import { updateProfile } from "@/services/authService"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function ProfilePage() {
  const { toast } = useToast()
  const router = useRouter()
  const { t, language, setLanguage, hasHydrated } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const availableLanguages = getAvailableLanguages()

  const [userData, setUserData] = useState({
    id: "",
    name: "",
    email: "",
    is_admin: false,
    email_verified: false,
    created_at: "",
  })

  useEffect(() => {
    setIsMounted(true)
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user")
      if (user) {
        setUserData(JSON.parse(user))
      }
    }
  }, [])

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  })

  useEffect(() => {
    setProfileData({
      name: userData.name || "",
      email: userData.email || ""
    })
  }, [userData])

  // Track if this is the first render to avoid showing toast on mount
  const [isFirstRender, setIsFirstRender] = useState(true)

  // Show toast when language changes (but not on first render)
  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false)
      return
    }

    if (isMounted && hasHydrated) {
      const languageName = language === 'pt-BR' ? 'Português (Brasil)' : 'English'
      toast({
        title: t('settings.language.changed_title'),
        description: t('settings.language.changed_description', { language: languageName }),
        duration: 2000,
      })
    }
  }, [language]) // Only trigger when language changes

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Call API to update profile
      const response = await updateProfile({
        email: profileData.email,
        name: profileData.name,
        language: language,
      })

      // Update user data
      const updatedUser = {
        ...userData,
        name: response.data.name || profileData.name,
        email: response.data.email,
        language: response.data.language,
      }

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(updatedUser))
      }

      // Update component state
      setUserData(updatedUser)

      toast({
        title: t('success.updated'),
        description: t('settings.profile.updated_success'),
      })
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast({
        title: t('errors.generic'),
        description: error?.response?.data?.detail || t('settings.profile.updated_error'),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state during hydration
  if (!isMounted) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-neutral-400">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <Card className="bg-[#1a1a1a] border-[#333]">
            <CardHeader>
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${userData.name}`} />
                  <AvatarFallback className="text-2xl bg-blue-400 text-black">
                    {(userData.name || "?")
                      .split(" ")
                      .filter(Boolean)
                      .map((n: string) => n[0])
                      .join("") || "?"}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-white text-xl">{userData.name}</CardTitle>
                <CardDescription className="text-neutral-400">{userData.email}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between text-neutral-300">
                  <span>ID:</span>
                  <span className="text-neutral-400 truncate max-w-[180px]">{userData.id}</span>
                </div>
                <div className="flex justify-between text-neutral-300">
                  <span>{t('common.role')}:</span>
                  <span className="text-neutral-400">{userData.is_admin ? t('common.administrator') : t('common.client')}</span>
                </div>
                <div className="flex justify-between text-neutral-300">
                  <span>{t('common.email_verified')}:</span>
                  <span className="text-neutral-400">{userData.email_verified ? t('common.yes') : t('common.no')}</span>
                </div>
                <div className="flex justify-between text-neutral-300">
                  <span>{t('common.created_at')}:</span>
                  <span className="text-neutral-400">{new Date(userData.created_at).toLocaleDateString(language === 'pt-BR' ? 'pt-BR' : 'en-US')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:w-2/3">
          <Card className="bg-[#1a1a1a] border-[#333]">
            <form onSubmit={handleProfileUpdate}>
              <CardHeader>
                <CardTitle className="text-white">{t('settings.profile.title')}</CardTitle>
                <CardDescription className="text-neutral-400">{t('settings.subtitle')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-neutral-300">
                    {t('settings.profile.name')}
                  </Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="bg-[#222] border-[#444] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-neutral-300">
                    {t('settings.profile.email')}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="bg-[#222] border-[#444] text-white"
                  />
                </div>

                {/* Language Preference */}
                <div className="space-y-2">
                  <Label htmlFor="language" className="text-neutral-300 flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    {t('settings.language.title')}
                  </Label>
                  <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
                    <SelectTrigger id="language" className="bg-[#222] border-[#444] text-white">
                      <SelectValue placeholder={t('settings.language.select')} />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-[#444]">
                      {availableLanguages.map((lang) => (
                        <SelectItem
                          key={lang}
                          value={lang}
                          className="text-white hover:bg-[#333] focus:bg-[#333]"
                        >
                          {getLanguageName(lang)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-neutral-500">
                    {t('settings.language.subtitle')}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-blue-400 text-black hover:bg-[#00cc7d]"
                  disabled={isLoading}
                >
                  {isLoading ? t('common.loading') : t('settings.profile.save')}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
