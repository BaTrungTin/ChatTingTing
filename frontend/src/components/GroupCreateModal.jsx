import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useChatStore } from "../store/useChatStore";

const GroupCreateModal = ({ open, onClose }) => {
  const { users, isUsersLoading, getUsers, createGroup, getGroups } = useChatStore();
  const [name, setName] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchedRef = useRef(false);
  useEffect(() => {
    if (!open) {
      fetchedRef.current = false;
      return;
    }
    if (open && !fetchedRef.current) {
      console.log("GroupCreateModal mounted: open=true");
      fetchedRef.current = true;
      getUsers();
    }
  }, [open]);

  const toggleId = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    await createGroup({ name: name.trim(), memberIds: selectedIds });
    await getGroups();
    setName("");
    setSelectedIds([]);
    onClose?.();
  };

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[99999]"
      onClick={onClose}
    >
      <div
        className="bg-base-100 rounded-lg w-11/12 max-w-lg p-4 shadow-xl border border-base-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-lg font-semibold mb-3">Tạo nhóm mới</div>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Tên nhóm"
            className="input input-bordered w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="max-h-64 overflow-y-auto border rounded-md p-2">
            {isUsersLoading && (
              <div className="py-6 text-center text-sm opacity-70">Đang tải danh bạ...</div>
            )}
            {!isUsersLoading && users.length === 0 && (
              <div className="py-6 text-center text-sm opacity-70">Không có người dùng để thêm</div>
            )}
            {!isUsersLoading && users.map((u) => (
              <label
                key={u._id}
                className="flex items-center gap-3 p-2 hover:bg-base-200 rounded-md cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={selectedIds.includes(u._id)}
                  onChange={() => toggleId(u._id)}
                />
                <img
                  src={u.profilePic || "/avatar.png"}
                  className="w-8 h-8 rounded-full"
                />
                <span className="truncate">{u.fullName}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button className="btn btn-ghost" onClick={onClose}>
            Hủy
          </button>
          <button className="btn btn-primary" onClick={handleCreate}>
            Tạo nhóm
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default GroupCreateModal;
