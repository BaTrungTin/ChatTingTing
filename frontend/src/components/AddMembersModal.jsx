import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useChatStore } from "../store/useChatStore";

const AddMembersModal = ({ open, onClose, groupId }) => {
  const { users, isUsersLoading, getUsers, addMembersToGroup } = useChatStore();
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    if (open) getUsers();
  }, [open, getUsers]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => (u.fullName || "").toLowerCase().includes(q));
  }, [users, query]);

  const toggle = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAdd = async () => {
    if (!groupId || selectedIds.length === 0) return;
    await addMembersToGroup(groupId, selectedIds);
    setSelectedIds([]);
    setQuery("");
    onClose?.();
  };

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 z-[99999] flex items-center justify-center" onClick={onClose}>
      <div className="bg-base-100 border border-base-300 rounded-lg w-11/12 max-w-lg p-4" onClick={(e) => e.stopPropagation()}>
        <div className="text-lg font-semibold mb-3">Thêm thành viên</div>
        <input
          className="input input-bordered w-full mb-3"
          placeholder="Tìm theo tên..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="max-h-64 overflow-y-auto border rounded-md p-2">
          {isUsersLoading && <div className="py-6 text-center text-sm opacity-70">Đang tải...</div>}
          {!isUsersLoading && filtered.length === 0 && (
            <div className="py-6 text-center text-sm opacity-70">Không tìm thấy người dùng</div>
          )}
          {!isUsersLoading && filtered.map((u) => (
            <label key={u._id} className="flex items-center gap-3 p-2 hover:bg-base-200 rounded-md cursor-pointer">
              <input type="checkbox" className="checkbox" checked={selectedIds.includes(u._id)} onChange={() => toggle(u._id)} />
              <img src={u.profilePic || "/avatar.png"} className="w-8 h-8 rounded-full" />
              <span className="truncate">{u.fullName}</span>
            </label>
          ))}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button className="btn btn-ghost" onClick={onClose}>Hủy</button>
          <button className="btn btn-primary" onClick={handleAdd}>Thêm</button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AddMembersModal;


