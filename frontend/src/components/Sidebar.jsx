import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    listenOnlineUsers,
    notListenOnlineUsers,
    getUnreadCount,
  } = useChatStore();

  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getUsers();
    listenOnlineUsers();

    return () => {
      notListenOnlineUsers();
    };
  }, [getUsers, listenOnlineUsers, notListenOnlineUsers]);

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      {/* Header */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
      </div>

      {/* Users list */}
      <div className="overflow-y-auto w-full py-3">
        {users.length > 0 ? (
          users.map((user) => {
            // Ép cả 2 về string để so sánh chắc chắn
            const isOnline = onlineUsers.includes(user._id?.toString());
            const unreadCount = getUnreadCount(user._id);

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

                <div className="hidden lg:block text-left min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium truncate">{user.fullName}</div>
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center ml-2">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        ) : (
          <div className="text-center text-zinc-500 py-4">No users</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
