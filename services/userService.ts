/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Eduardo Oliveira                                                     │
│ @file: /services/userService.ts                                              │
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
import api from "./api";

export interface User {
  id: string;
  email: string;
  name?: string;
  is_active: boolean;
  is_admin: boolean;
  client_id?: string;
  email_verified: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  client_id?: string;
  is_active?: boolean;
}

export interface ResetPasswordData {
  new_password: string;
}

export const listAllUsers = (skip: number = 0, limit: number = 100, clientId?: string) => {
  const params: any = { skip, limit };
  if (clientId) {
    params.client_id = clientId;
  }
  return api.get("/api/v1/admin/users/all", { params });
};

export const createUser = (data: CreateUserData) =>
  api.post("/api/v1/admin/users", data);

export const updateUser = (userId: string, data: UpdateUserData) =>
  api.put(`/api/v1/admin/users/${userId}`, data);

export const resetUserPassword = (userId: string, data: ResetPasswordData) =>
  api.put(`/api/v1/admin/users/${userId}/password`, data);

export const deactivateUser = (userId: string) =>
  api.delete(`/api/v1/admin/users/${userId}`);
