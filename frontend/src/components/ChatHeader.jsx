import { X, UserPlus, LogOut, Users } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";
import AddMembersModal from "./AddMembersModal";
import GroupMembersModal from "./GroupMembersModal";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, selectedGroup, setSelectedUser, setSelectedGroup, leaveGroup, updateGroupAvatar } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [openAdd, setOpenAdd] = useState(false);
  const [openMembers, setOpenMembers] = useState(false);

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              {selectedGroup ? (
                <label className="cursor-pointer">
                  <img src={selectedGroup.avatar || "/avatar.png"} alt={selectedGroup.name} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        updateGroupAvatar(selectedGroup._id, reader.result);
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>
              ) : (
                <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
              )}
            </div>
          </div>

          {/* User info */}
          <div>
            {selectedGroup ? (
              <h3 className="font-medium">{selectedGroup.name}</h3>
            ) : (
              <>
                <h3 className="font-medium">{selectedUser.fullName}</h3>
                <p className="text-sm text-base-content/70">
                  {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {selectedGroup && (
            <>
              <button title="Xem thành viên" onClick={() => setOpenMembers(true)}>
                <Users />
              </button>
              <button title="Add members" onClick={() => setOpenAdd(true)}>
                <UserPlus />
              </button>
              <button title="Rời nhóm" onClick={() => leaveGroup(selectedGroup._id)}>
                <LogOut />
              </button>
            </>
          )}
          <button onClick={() => { setSelectedUser(null); setSelectedGroup(null); }}>
            <X />
          </button>
        </div>
        {selectedGroup && (
          <>
            <AddMembersModal open={openAdd} onClose={() => setOpenAdd(false)} groupId={selectedGroup._id} />
            <GroupMembersModal open={openMembers} onClose={() => setOpenMembers(false)} groupId={selectedGroup._id} />
          </>
        )}
      </div>
    </div>
  );
};
export default ChatHeader;
