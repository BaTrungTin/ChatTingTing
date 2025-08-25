import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { axiosInstance } from "../lib/axios";

const GroupMembersModal = ({ open, onClose, groupId }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!open || !groupId) return;
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/groups/${groupId}`);
        setMembers(res.data?.members || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [open, groupId]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 z-[99999] flex items-center justify-center" onClick={onClose}>
      <div className="bg-base-100 border border-base-300 rounded-lg w-11/12 max-w-md p-4" onClick={(e) => e.stopPropagation()}>
        <div className="text-lg font-semibold mb-3">Thành viên nhóm</div>
        <div className="max-h-72 overflow-y-auto">
          {loading && <div className="py-6 text-center text-sm opacity-70">Đang tải...</div>}
          {!loading && members.length === 0 && (
            <div className="py-6 text-center text-sm opacity-70">Chưa có thành viên</div>
          )}
          {!loading && members.map((m) => (
            <div key={m._id} className="flex items-center gap-3 p-2">
              <img src={m.profilePic || "/avatar.png"} className="w-8 h-8 rounded-full" />
              <span className="truncate">{m.fullName}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 text-right">
          <button className="btn btn-ghost" onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default GroupMembersModal;


