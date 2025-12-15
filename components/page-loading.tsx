/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Eduardo Oliveira                                                     │
│ @file: /components/page-loading.tsx                                          │
│ Developed by: Eduardo Oliveira                                                │
│ Creation date: December 14, 2025                                              │
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
import { Loader2 } from "lucide-react"

export default function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        <p className="text-sm text-neutral-400">Loading...</p>
      </div>
    </div>
  )
}
