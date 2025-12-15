/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Eduardo Oliveira                                                     │
│ @file: /app/users/page.tsx                                                   │
│ Developed by: Eduardo Oliveira                                                │
│ Creation date: December 14, 2024                                             │
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Plus, MoreHorizontal, Edit, Trash2, Search, Users as UsersIcon, UserPlus, Key, CheckCircle2, XCircle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  listAllUsers,
  createUser,
  updateUser,
  resetUserPassword,
  deactivateUser,
  User,
} from "@/services/userService"
import { listClients, Client } from "@/services/clientService"
import { useTranslation } from "@/lib/i18n"
import { Switch } from "@/components/ui/switch"

export default function UsersPage() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    client_id: "",
    is_active: true,
  })

  const [passwordData, setPasswordData] = useState({
    new_password: "",
  })

  const [users, setUsers] = useState<User[]>([])
  const [clients, setClients] = useState<Client[]>([])

  useEffect(() => {
    fetchUsers()
    fetchClients()
  }, [])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const res = await listAllUsers(0, 1000)
      setUsers(res.data)
    } catch (error) {
      toast({
        title: t('admin.users.error_loading'),
        description: t('admin.users.error_loading_desc'),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchClients = async () => {
    try {
      const res = await listClients(0, 1000)
      setClients(res.data)
    } catch (error) {
      console.error("Error fetching clients:", error)
    }
  }

  const filteredUsers = Array.isArray(users)
    ? users.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : []

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, {
          name: userData.name,
          email: userData.email,
          client_id: userData.client_id || undefined,
          is_active: userData.is_active,
        })
        toast({
          title: t('admin.users.user_updated'),
          description: t('admin.users.user_updated_desc', { name: userData.name }),
        })
      } else {
        await createUser({
          name: userData.name,
          email: userData.email,
          password: userData.password,
        })
        toast({
          title: t('admin.users.user_added'),
          description: t('admin.users.user_added_desc', { name: userData.name }),
        })
      }
      setIsDialogOpen(false)
      resetForm()
      fetchUsers()
    } catch (error: any) {
      toast({
        title: t('admin.users.error_save'),
        description: error?.response?.data?.detail || t('admin.users.error_save_desc'),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setUserData({
      name: user.name || "",
      email: user.email,
      password: "",
      client_id: user.client_id || "",
      is_active: user.is_active,
    })
    setIsDialogOpen(true)
  }

  const confirmDeleteUser = async () => {
    if (!selectedUser) return
    setIsLoading(true)
    try {
      await deactivateUser(selectedUser.id)
      toast({
        title: t('admin.users.user_deactivated'),
        description: t('admin.users.user_deactivated_desc', { name: selectedUser.name || selectedUser.email }),
      })
      setIsDeleteDialogOpen(false)
      setSelectedUser(null)
      fetchUsers()
    } catch (error: any) {
      toast({
        title: t('admin.users.error_delete'),
        description: error?.response?.data?.detail || t('admin.users.error_delete_desc'),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return
    setIsLoading(true)
    try {
      await resetUserPassword(selectedUser.id, passwordData)
      toast({
        title: t('admin.users.password_reset'),
        description: t('admin.users.password_reset_desc', { name: selectedUser.name || selectedUser.email }),
      })
      setIsPasswordDialogOpen(false)
      setPasswordData({ new_password: "" })
      setSelectedUser(null)
    } catch (error: any) {
      toast({
        title: t('admin.users.error_reset_password'),
        description: error?.response?.data?.detail || t('admin.users.error_reset_password_desc'),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setUserData({
      name: "",
      email: "",
      password: "",
      client_id: "",
      is_active: true,
    })
    setSelectedUser(null)
  }

  const getClientName = (clientId?: string) => {
    if (!clientId) return t('admin.users.no_client')
    const client = clients.find(c => c.id === clientId)
    return client?.name || t('admin.users.unknown_client')
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">{t('admin.users.title')}</h1>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-blue-400 text-black hover:bg-[#00cc7d]">
              <Plus className="mr-2 h-4 w-4" />
              {t('admin.users.new_user')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-[#1a1a1a] border-[#333]">
            <form onSubmit={handleAddUser}>
              <DialogHeader>
                <DialogTitle className="text-white">
                  {selectedUser ? t('admin.users.edit_user') : t('admin.users.new_user')}
                </DialogTitle>
                <DialogDescription className="text-neutral-400">
                  {selectedUser ? t('admin.users.edit_user_info') : t('admin.users.create_user_info')}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-neutral-300">
                    {t('admin.users.name')}
                  </Label>
                  <Input
                    id="name"
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    className="bg-[#222] border-[#444] text-white"
                    placeholder={t('admin.users.name_placeholder')}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-neutral-300">
                    {t('admin.users.email')}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    className="bg-[#222] border-[#444] text-white"
                    placeholder={t('admin.users.email_placeholder')}
                    required
                  />
                </div>

                {!selectedUser && (
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-neutral-300">
                      {t('admin.users.password')}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={userData.password}
                      onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                      className="bg-[#222] border-[#444] text-white"
                      placeholder={t('admin.users.password_placeholder')}
                      required={!selectedUser}
                    />
                  </div>
                )}

                {selectedUser && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="client" className="text-neutral-300">
                        {t('admin.users.client')}
                      </Label>
                      <Select
                        value={userData.client_id || "no-client"}
                        onValueChange={(value) => setUserData({ ...userData, client_id: value === "no-client" ? "" : value })}
                      >
                        <SelectTrigger className="bg-[#222] border-[#444] text-white">
                          <SelectValue placeholder={t('admin.users.select_client')} />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a1a1a] border-[#444]">
                          <SelectItem value="no-client" className="text-white hover:bg-[#333]">
                            {t('admin.users.no_client')}
                          </SelectItem>
                          {clients.map((client) => (
                            <SelectItem
                              key={client.id}
                              value={client.id}
                              className="text-white hover:bg-[#333] focus:bg-[#333]"
                            >
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_active"
                        checked={userData.is_active}
                        onCheckedChange={(checked) => setUserData({ ...userData, is_active: checked })}
                      />
                      <Label htmlFor="is_active" className="text-neutral-300">
                        {t('admin.users.active')}
                      </Label>
                    </div>
                  </>
                )}
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  className="w-full bg-blue-400 text-black hover:bg-[#00cc7d]"
                  disabled={isLoading}
                >
                  {isLoading
                    ? t('admin.users.saving')
                    : selectedUser
                    ? t('admin.users.save_changes')
                    : t('admin.users.add_user')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-[#1a1a1a] border-[#333]">
        <CardHeader>
          <CardTitle className="text-white">{t('admin.users.user_list')}</CardTitle>
          <div className="flex items-center gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 h-4 w-4" />
              <Input
                placeholder={t('admin.users.search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#222] border-[#444] text-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-[#333] hover:bg-[#222]">
                <TableHead className="text-neutral-400">{t('admin.users.name')}</TableHead>
                <TableHead className="text-neutral-400">{t('admin.users.email')}</TableHead>
                <TableHead className="text-neutral-400">{t('admin.users.client')}</TableHead>
                <TableHead className="text-neutral-400">{t('admin.users.role')}</TableHead>
                <TableHead className="text-neutral-400">{t('admin.users.status')}</TableHead>
                <TableHead className="text-neutral-400 text-right">{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-neutral-500 py-8">
                    {t('admin.users.no_users_found')}
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="border-[#333] hover:bg-[#222]">
                    <TableCell className="text-white font-medium">{user.name || "-"}</TableCell>
                    <TableCell className="text-neutral-300">{user.email}</TableCell>
                    <TableCell className="text-neutral-300">{getClientName(user.client_id)}</TableCell>
                    <TableCell className="text-neutral-300">
                      {user.is_admin ? (
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-md text-xs">
                          {t('common.administrator')}
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-md text-xs">
                          {t('common.client')}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-neutral-300">
                      {user.is_active ? (
                        <span className="flex items-center gap-1 text-green-400">
                          <CheckCircle2 className="h-4 w-4" />
                          {t('admin.users.active')}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-400">
                          <XCircle className="h-4 w-4" />
                          {t('admin.users.inactive')}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 text-neutral-400 hover:text-white">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-[#333]">
                          <DropdownMenuLabel className="text-neutral-400">{t('common.actions')}</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-[#333]" />
                          <DropdownMenuItem
                            onClick={() => handleEditUser(user)}
                            className="text-white hover:bg-[#333] cursor-pointer"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            {t('common.edit')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user)
                              setIsPasswordDialogOpen(true)
                            }}
                            className="text-white hover:bg-[#333] cursor-pointer"
                          >
                            <Key className="mr-2 h-4 w-4" />
                            {t('admin.users.reset_password')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user)
                              setIsDeleteDialogOpen(true)
                            }}
                            className="text-red-400 hover:bg-[#333] cursor-pointer"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t('common.delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-[#1a1a1a] border-[#333]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">{t('admin.users.confirm_delete')}</AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-400">
              {t('admin.users.confirm_delete_desc', { name: selectedUser?.name || selectedUser?.email || "" })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#222] border-[#444] text-white hover:bg-[#333]">
              {t('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteUser}
              disabled={isLoading}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              {isLoading ? t('admin.users.deleting') : t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Password Reset Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-[#1a1a1a] border-[#333]">
          <form onSubmit={handleResetPassword}>
            <DialogHeader>
              <DialogTitle className="text-white">{t('admin.users.reset_password')}</DialogTitle>
              <DialogDescription className="text-neutral-400">
                {t('admin.users.reset_password_desc', { name: selectedUser?.name || selectedUser?.email || "" })}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new_password" className="text-neutral-300">
                  {t('admin.users.new_password')}
                </Label>
                <Input
                  id="new_password"
                  type="password"
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({ new_password: e.target.value })}
                  className="bg-[#222] border-[#444] text-white"
                  placeholder={t('admin.users.new_password_placeholder')}
                  required
                  minLength={8}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="w-full bg-blue-400 text-black hover:bg-[#00cc7d]"
                disabled={isLoading}
              >
                {isLoading ? t('admin.users.resetting') : t('admin.users.reset_password')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
