/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Eduardo Oliveira                                                     │
│ @file: /app/agents/page.tsx                                                  │
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

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Key, Plus, Folder, Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { exportAsJson } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Agent, AgentCreate } from "@/types/agent";
import { Folder as AgentFolder } from "@/services/agentService";
import {
  listAgents,
  createAgent,
  updateAgent,
  deleteAgent,
  listFolders,
  createFolder,
  updateFolder,
  deleteFolder,
  assignAgentToFolder,
  ApiKey,
  listApiKeys,
  createApiKey,
  updateApiKey,
  deleteApiKey,
  shareAgent,
  importAgentFromJson,
} from "@/services/agentService";
import { listMCPServers } from "@/services/mcpServerService";
import { AgentSidebar } from "./AgentSidebar";
import { SearchInput } from "./SearchInput";
import { AgentList } from "./AgentList";
import { EmptyState } from "./EmptyState";
import { AgentForm } from "./forms/AgentForm";
import { FolderDialog } from "./dialogs/FolderDialog";
import { MoveAgentDialog } from "./dialogs/MoveAgentDialog";
import { ConfirmationDialog } from "./dialogs/ConfirmationDialog";
import { ApiKeysDialog } from "./dialogs/ApiKeysDialog";
import { ShareAgentDialog } from "./dialogs/ShareAgentDialog";
import { MCPServer } from "@/types/mcpServer";
import { availableModels } from "@/types/aiModels";
import { ImportAgentDialog } from "./dialogs/ImportAgentDialog";

export default function AgentsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useTranslation();

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};
  const clientId = user?.client_id || "";

  const [agents, setAgents] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [folders, setFolders] = useState<AgentFolder[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [availableMCPs, setAvailableMCPs] = useState<MCPServer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAgentType, setSelectedAgentType] = useState<string | null>(null);
  const [agentTypes, setAgentTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
  const [isMovingDialogOpen, setIsMovingDialogOpen] = useState(false);
  const [isDeleteAgentDialogOpen, setIsDeleteAgentDialogOpen] = useState(false);
  const [isDeleteFolderDialogOpen, setIsDeleteFolderDialogOpen] =
    useState(false);
  const [isApiKeysDialogOpen, setIsApiKeysDialogOpen] = useState(false);
  const [isMCPDialogOpen, setIsMCPDialogOpen] = useState(false);
  const [isCustomMCPDialogOpen, setIsCustomMCPDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [editingFolder, setEditingFolder] = useState<AgentFolder | null>(null);
  const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null);
  const [agentToMove, setAgentToMove] = useState<Agent | null>(null);
  const [agentToShare, setAgentToShare] = useState<Agent | null>(null);
  const [sharedApiKey, setSharedApiKey] = useState<string>("");
  const [folderToDelete, setFolderToDelete] = useState<AgentFolder | null>(null);

  const [newAgent, setNewAgent] = useState<Partial<Agent>>({
    client_id: clientId || "",
    name: "",
    description: "",
    type: "llm",
    model: "openai/gpt-4.1-nano",
    instruction: "",
    api_key_id: "",
    config: {
      tools: [],
      mcp_servers: [],
      custom_mcp_servers: [],
      custom_tools: {
        http_tools: [],
      },
      sub_agents: [],
      agent_tools: [],
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  useEffect(() => {
    if (!clientId) return;
    loadAgents();
    loadFolders();
    loadApiKeys();
  }, [clientId, selectedFolderId]);

  useEffect(() => {
    const loadMCPs = async () => {
      try {
        const res = await listMCPServers();
        setAvailableMCPs(res.data);
      } catch (error) {
        toast({
          title: t('agents.error_loading_mcp'),
          variant: "destructive",
        });
      }
    };

    loadMCPs();
  }, []);

  const loadAgents = async () => {
    setIsLoading(true);
    try {
      const res = await listAgents(
        clientId,
        0,
        100,
        selectedFolderId || undefined
      );
      setAgents(res.data);
      setFilteredAgents(res.data);

      // Extract unique agent types
      const types = [...new Set(res.data.map(agent => agent.type))].filter(Boolean);
      setAgentTypes(types);
    } catch (error) {
      toast({ title: t('agents.error_loading'), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const loadFolders = async () => {
    setIsLoading(true);
    try {
      const res = await listFolders(clientId);
      setFolders(res.data);
    } catch (error) {
      toast({ title: t('agents.error_loading_folders'), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const loadApiKeys = async () => {
    try {
      const res = await listApiKeys(clientId);
      setApiKeys(res.data);
    } catch (error) {
      toast({ title: t('agents.error_loading_keys'), variant: "destructive" });
    }
  };

  useEffect(() => {
    // Apply both search term and type filters
    let filtered = [...agents];

    // Apply search term filter
    if (searchTerm.trim() !== "") {
      const lowercaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (agent) =>
          agent.name.toLowerCase().includes(lowercaseSearch) ||
          agent.description?.toLowerCase().includes(lowercaseSearch)
      );
    }

    // Apply agent type filter
    if (selectedAgentType) {
      filtered = filtered.filter(agent => agent.type === selectedAgentType);
    }

    setFilteredAgents(filtered);
  }, [searchTerm, selectedAgentType, agents]);

  const handleAddAgent = async (agentData: Partial<Agent>) => {
    try {
      setIsLoading(true);
      if (editingAgent) {
        await updateAgent(editingAgent.id, {
          ...agentData,
          client_id: clientId,
        });
        toast({
          title: t('agents.agent_updated'),
          description: t('agents.agent_updated_desc', { name: agentData.name ?? 'Agent' }),
        });
      } else {
        const createdAgent = await createAgent({
          ...(agentData as AgentCreate),
          client_id: clientId,
        });

        if (selectedFolderId && createdAgent.data.id) {
          await assignAgentToFolder(
            createdAgent.data.id,
            selectedFolderId,
            clientId
          );
        }

        toast({
          title: t('agents.agent_added'),
          description: t('agents.agent_added_desc', { name: agentData.name ?? 'Agent' }),
        });
      }
      loadAgents();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: t('errors.generic'),
        description: t('agents.error_save'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAgent = async () => {
    if (!agentToDelete) return;
    try {
      setIsLoading(true);
      await deleteAgent(agentToDelete.id);
      toast({
        title: t('agents.agent_deleted'),
        description: t('agents.agent_deleted_desc'),
      });
      loadAgents();
      setAgentToDelete(null);
      setIsDeleteAgentDialogOpen(false);
    } catch {
      toast({
        title: t('errors.generic'),
        description: t('agents.error_delete'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAgent = (agent: Agent) => {
    setEditingAgent(agent);
    setNewAgent({ ...agent });
    setIsDialogOpen(true);
  };

  const handleMoveAgent = async (targetFolderId: string | null) => {
    if (!agentToMove) return;
    try {
      setIsLoading(true);
      await assignAgentToFolder(agentToMove.id, targetFolderId, clientId);
      toast({
        title: t('agents.agent_moved'),
        description: targetFolderId
          ? t('agents.agent_moved_to_folder')
          : t('agents.agent_removed_from_folder'),
      });
      setIsMovingDialogOpen(false);
      loadAgents();
    } catch (error) {
      toast({
        title: t('errors.generic'),
        description: t('agents.error_move'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setAgentToMove(null);
    }
  };

  const handleAddFolder = async (folderData: {
    name: string;
    description: string;
  }) => {
    try {
      setIsLoading(true);
      if (editingFolder) {
        await updateFolder(editingFolder.id, folderData, clientId);
        toast({
          title: t('agents.folder_updated'),
          description: t('agents.folder_updated_desc', { name: folderData.name }),
        });
      } else {
        await createFolder({
          ...folderData,
          client_id: clientId,
        });
        toast({
          title: t('agents.folder_created'),
          description: t('agents.folder_created_desc', { name: folderData.name }),
        });
      }
      loadFolders();
      setIsFolderDialogOpen(false);
      setEditingFolder(null);
    } catch (error) {
      toast({
        title: t('errors.generic'),
        description: t('agents.error_save_folder'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFolder = async () => {
    if (!folderToDelete) return;
    try {
      setIsLoading(true);
      await deleteFolder(folderToDelete.id, clientId);
      toast({
        title: t('agents.folder_deleted'),
        description: t('agents.folder_deleted_desc'),
      });
      loadFolders();
      if (selectedFolderId === folderToDelete.id) {
        setSelectedFolderId(null);
      }
      setFolderToDelete(null);
      setIsDeleteFolderDialogOpen(false);
    } catch (error) {
      toast({
        title: t('errors.generic'),
        description: t('agents.error_delete_folder'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareAgent = async (agent: Agent) => {
    try {
      setIsLoading(true);
      setAgentToShare(agent);
      const response = await shareAgent(agent.id, clientId);

      if (response.data && response.data.api_key) {
        setSharedApiKey(response.data.api_key);
        setIsShareDialogOpen(true);

        toast({
          title: t('agents.agent_shared'),
          description: t('agents.api_key_generated'),
        });
      }
    } catch (error) {
      toast({
        title: t('errors.generic'),
        description: t('agents.error_share'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setNewAgent({
      client_id: clientId || "",
      name: "",
      description: "",
      type: "llm",
      model: "openai/gpt-4.1-nano",
      instruction: "",
      api_key_id: "",
      config: {
        tools: [],
        mcp_servers: [],
        custom_mcp_servers: [],
        custom_tools: {
          http_tools: [],
        },
        sub_agents: [],
        agent_tools: [],
      },
    });
    setEditingAgent(null);
  };

  // Function to export all agents as JSON
  const handleExportAllAgents = () => {
    try {
      // Create file name with current date
      const date = new Date();
      const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      const filename = `agents-export-${formattedDate}`;

      // Use the utility function to export
      // Pass agents both as the data and as allAgents parameter to properly resolve references
      const result = exportAsJson({ agents: filteredAgents }, filename, true, agents);

      if (result) {
        toast({
          title: t('agents.export_complete'),
          description: t('agents.export_complete_desc', { count: filteredAgents.length }),
        });
      } else {
        throw new Error("Export failed");
      }
    } catch (error) {
      console.error("Error exporting agents:", error);

      toast({
        title: t('agents.export_failed'),
        description: t('agents.export_failed_desc'),
        variant: "destructive",
      });
    }
  };

  const handleImportAgentJSON = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !clientId) return;

    try {
      setIsImporting(true);

      await importAgentFromJson(file, clientId);

      toast({
        title: t('agents.import_success'),
        description: t('agents.import_success_desc'),
      });

      // Refresh the agent list
      loadAgents();

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error("Error importing agent:", error);
      toast({
        title: t('agents.import_failed'),
        description: t('agents.import_failed_desc'),
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-[#121212] min-h-screen flex relative">
      <AgentSidebar
        visible={isSidebarVisible}
        folders={folders}
        selectedFolderId={selectedFolderId}
        onSelectFolder={setSelectedFolderId}
        onAddFolder={() => {
          setEditingFolder(null);
          setIsFolderDialogOpen(true);
        }}
        onEditFolder={(folder) => {
          setEditingFolder(folder as AgentFolder);
          setIsFolderDialogOpen(true);
        }}
        onDeleteFolder={(folder) => {
          setFolderToDelete(folder as AgentFolder);
          setIsDeleteFolderDialogOpen(true);
        }}
        onClose={() => setIsSidebarVisible(!isSidebarVisible)}
      />

      <div
        className={`w-full transition-all duration-300 ease-in-out ${isSidebarVisible ? "pl-64" : "pl-0"
          }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            {!isSidebarVisible && (
              <button
                onClick={() => setIsSidebarVisible(true)}
                className="mr-2 bg-[#222] p-2 rounded-md text-blue-400 hover:bg-[#333] hover:text-blue-400 shadow-md transition-all"
                aria-label="Show folders"
              >
                <Folder className="h-5 w-5" />
              </button>
            )}
            <h1 className="text-3xl font-bold text-white flex items-center ml-2">
              {selectedFolderId
                ? folders.find((f) => f.id === selectedFolderId)?.name
                : t('nav.agents')}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder={t('agents.search_placeholder')}
              selectedAgentType={selectedAgentType}
              onAgentTypeChange={setSelectedAgentType}
              agentTypes={agentTypes}
            />

            <Button
              onClick={() => setIsApiKeysDialogOpen(true)}
              className="bg-[#222] text-white hover:bg-[#333] border border-[#444]"
            >
              <Key className="mr-2 h-4 w-4 text-blue-400" />
              {t('agents.api_keys')}
            </Button>

            <Button
              onClick={handleExportAllAgents}
              className="bg-[#222] text-white hover:bg-[#333] border border-[#444]"
              title={t('agents.export_all')}
            >
              <Download className="mr-2 h-4 w-4 text-purple-400" />
              {t('agents.export_all')}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-blue-400 text-black hover:bg-[#00cc7d]">
                  <Plus className="mr-2 h-4 w-4" />
                  {t('agents.new_agent')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-900 border-zinc-700">
                <DropdownMenuItem
                  className="text-white hover:bg-zinc-800 cursor-pointer"
                  onClick={() => {
                    resetForm();
                    setIsDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2 text-blue-400" />
                  {t('agents.new_agent')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-white hover:bg-zinc-800 cursor-pointer"
                  onClick={() => setIsImportDialogOpen(true)}
                >
                  <Upload className="h-4 w-4 mr-2 text-indigo-400" />
                  {t('agents.import_agent')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
          </div>
        ) : filteredAgents.length > 0 ? (
          <AgentList
            agents={filteredAgents}
            isLoading={isLoading}
            searchTerm={searchTerm}
            selectedFolderId={selectedFolderId}
            availableMCPs={availableMCPs}
            getApiKeyNameById={(id) =>
              apiKeys.find((k) => k.id === id)?.name || null
            }
            getAgentNameById={(id) =>
              agents.find((a) => a.id === id)?.name || id
            }
            onEdit={handleEditAgent}
            onDelete={(agent) => {
              setAgentToDelete(agent);
              setIsDeleteAgentDialogOpen(true);
            }}
            onMove={(agent) => {
              setAgentToMove(agent);
              setIsMovingDialogOpen(true);
            }}
            onShare={handleShareAgent}
            onClearSearch={() => {
              setSearchTerm("");
              setSelectedAgentType(null);
            }}
            onCreateAgent={() => {
              resetForm();
              setIsDialogOpen(true);
            }}
            onWorkflow={(agentId) => {
              router.push(`/agents/workflows?agentId=${agentId}`);
            }}
            apiKeys={apiKeys}
            folders={folders}
          />
        ) : (
          <EmptyState
            type={
              searchTerm || selectedAgentType
                ? "search-no-results"
                : selectedFolderId
                  ? "empty-folder"
                  : "no-agents"
            }
            searchTerm={searchTerm}
            onAction={() => {
              searchTerm || selectedAgentType
                ? (setSearchTerm(""), setSelectedAgentType(null))
                : (resetForm(), setIsDialogOpen(true));
            }}
            actionLabel={searchTerm || selectedAgentType ? "Clear filters" : "Create Agent"}
          />
        )}
      </div>

      <AgentForm
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialValues={newAgent}
        apiKeys={apiKeys}
        availableModels={availableModels}
        availableMCPs={availableMCPs}
        agents={agents}
        onOpenApiKeysDialog={() => setIsApiKeysDialogOpen(true)}
        onOpenMCPDialog={() => setIsMCPDialogOpen(true)}
        onOpenCustomMCPDialog={() => setIsCustomMCPDialogOpen(true)}
        onSave={handleAddAgent}
        getAgentNameById={(id) => agents.find((a) => a.id === id)?.name || id}
        clientId={clientId}
      />

      <FolderDialog
        open={isFolderDialogOpen}
        onOpenChange={setIsFolderDialogOpen}
        editingFolder={editingFolder}
        onSave={handleAddFolder}
      />

      <MoveAgentDialog
        open={isMovingDialogOpen}
        onOpenChange={setIsMovingDialogOpen}
        agent={agentToMove}
        folders={folders}
        onMove={handleMoveAgent}
      />

      <ConfirmationDialog
        open={isDeleteAgentDialogOpen}
        onOpenChange={setIsDeleteAgentDialogOpen}
        title="Confirm deletion"
        description={`Are you sure you want to delete the agent "${agentToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteAgent}
      />

      <ConfirmationDialog
        open={isDeleteFolderDialogOpen}
        onOpenChange={setIsDeleteFolderDialogOpen}
        title="Confirm deletion"
        description={`Are you sure you want to delete the folder "${folderToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="destructive"
        onConfirm={handleDeleteFolder}
      />

      <ApiKeysDialog
        open={isApiKeysDialogOpen}
        onOpenChange={setIsApiKeysDialogOpen}
        apiKeys={apiKeys}
        isLoading={isLoading}
        onAddApiKey={async (keyData) => {
          await createApiKey({ ...keyData, client_id: clientId });
          loadApiKeys();
        }}
        onUpdateApiKey={async (id, keyData) => {
          await updateApiKey(id, keyData, clientId);
          loadApiKeys();
        }}
        onDeleteApiKey={async (id) => {
          await deleteApiKey(id, clientId);
          loadApiKeys();
        }}
      />

      <ShareAgentDialog
        open={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        agent={agentToShare || ({} as Agent)}
        apiKey={sharedApiKey}
      />

      <ImportAgentDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        onSuccess={loadAgents}
        clientId={clientId}
        folderId={selectedFolderId}
      />
    </div>
  );
}
