import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Plus } from "lucide-react";
import { useState } from "react";
import GroupCreateModal from "./GroupCreateModal";

const Sidebar = () => {
  const { getUsers, getGroups, users, groups, selectedUser, selectedGroup, setSelectedUser, setSelectedGroup, isUsersLoading, isGroupsLoading } =
    useChatStore();
  const { onlineUsers } = useAuthStore();
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    getUsers();
    getGroups();
  }, [getUsers, getGroups]);

  if ((isUsersLoading || isGroupsLoading) && !openModal) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      {/* Header */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6" />
            <span className="font-medium hidden lg:block">Contacts</span>
          </div>
          <button
            className="btn btn-sm btn-ghost"
            title="New group"
            onClick={() => {
              console.log("Sidebar: open group modal click");
              setOpenModal(true);
            }}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden lg:inline">New</span>
          </button>
        </div>
      </div>

      {/* Groups list */}
      <div className="overflow-y-auto w-full py-3">
        {groups.length > 0 && (
          <div className="px-3 pb-2 text-xs uppercase text-zinc-500">Groups</div>
        )}
        {groups.map((group) => (
          <button
            key={group._id}
            onClick={() => setSelectedGroup(group)}
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
              selectedGroup?._id === group._id ? "bg-base-300 ring-1 ring-base-300" : ""
            }`}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={group.avatar || "/avatar.png"}
                alt={group.name}
                className="w-12 h-12 object-cover rounded-full"
              />
            </div>
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{group.name}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Users list */}
      <div className="overflow-y-auto w-full py-3">
        {users.length > 0 ? (
          users.map((user) => {
            const isOnline = onlineUsers.includes(user._id);

            return (
              <button
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
                  selectedUser?._id === user._id
                    ? "bg-base-300 ring-1 ring-base-300"
                    : ""
                }`}
              >
                <div className="relative mx-auto lg:mx-0">
                  <img
                    src={user.profilePic || "/avatar.png"}
                    alt={user.fullName}
                    className="w-12 h-12 object-cover rounded-full"
                  />
                  {/* Chấm xanh online */}
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 block w-3 h-3 rounded-full bg-green-500 ring-2 ring-white"></span>
                  )}
                </div>

                <div className="hidden lg:block text-left min-w-0">
                  <div className="font-medium truncate">{user.fullName}</div>
                </div>
              </button>
            );
          })
        ) : (
          <div className="text-center text-zinc-500 py-4">No users</div>
        )}
      </div>
      <GroupCreateModal open={openModal} onClose={() => setOpenModal(false)} />
    </aside>
  );
};

export default Sidebar;
