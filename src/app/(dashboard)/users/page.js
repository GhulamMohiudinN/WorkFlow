"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  FiUsers,
  FiUserPlus,
  FiSearch,
  FiFilter,
  FiMail,
  FiEdit2,
  FiTrash2,
  FiMoreVertical,
  FiCheckCircle,
  FiXCircle,
  FiShield,
  FiEye,
  FiX,
  FiAlertTriangle,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiUser,
  FiClock,
  FiCalendar,
  FiSave,
  FiHash,
  FiToggleLeft,
  FiToggleRight,
  FiStar,
} from "react-icons/fi";
import { userAPI } from "../../api/userAPI";

// ─────────────────────────────────────────────────────────────────────────────
// Constants & Helpers
// ─────────────────────────────────────────────────────────────────────────────

const ROLES   = ["admin", "editor", "viewer"];
const COLORS  = [
  "bg-red-500","bg-blue-500","bg-green-500","bg-purple-500",
  "bg-amber-500","bg-pink-500","bg-indigo-500","bg-teal-500",
  "bg-cyan-500","bg-orange-500",
];

function avatarColor(name = "") {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return COLORS[Math.abs(h) % COLORS.length];
}

function roleBadgeCls(role) {
  switch (role) {
    case "admin":      return "bg-red-100    text-red-800    border border-red-200";
    case "editor":     return "bg-blue-100   text-blue-800   border border-blue-200";
    case "viewer":     return "bg-green-100  text-green-800  border border-green-200";
    case "superadmin": return "bg-purple-100 text-purple-800 border border-purple-200";
    default:           return "bg-gray-100   text-gray-700   border border-gray-200";
  }
}

function statusBadgeCls(status) {
  switch (status) {
    case "active":   return "bg-green-100  text-green-800";
    case "inactive": return "bg-gray-100   text-gray-600";
    case "pending":  return "bg-yellow-100 text-yellow-800";
    default:         return "bg-gray-100   text-gray-600";
  }
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

function timeAgo(iso) {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7)  return `${d}d ago`;
  return formatDate(iso);
}

// ─────────────────────────────────────────────────────────────────────────────
// Atomic UI
// ─────────────────────────────────────────────────────────────────────────────

function Spinner({ size = "h-5 w-5", cls = "border-amber-500" }) {
  return (
    <div className={`${size} animate-spin rounded-full border-2 ${cls} border-t-transparent`} />
  );
}

function Avatar({ name = "", size = "h-10 w-10" }) {
  return (
    <div className={`${size} ${avatarColor(name)} rounded-full flex items-center justify-center flex-shrink-0`}>
      <span className="text-white font-bold text-sm leading-none">
        {name?.charAt(0)?.toUpperCase() || "?"}
      </span>
    </div>
  );
}

function ModalShell({ title, accentFrom, accentTo, onClose, children }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Gradient header */}
        <div
          className={`bg-gradient-to-r ${accentFrom} ${accentTo} px-6 py-4 flex items-center justify-between`}
        >
          <h2 className="text-white font-bold text-base">{title}</h2>
          <button
            onClick={onClose}
            className="text-white/75 hover:text-white p-1.5 rounded-lg hover:bg-white/15 transition-colors"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value, valueColor = "text-gray-900" }) {
  const display = value != null && value !== "" ? value : "—";
  return (
    <div className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0 group">
      <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 flex-shrink-0 group-hover:bg-amber-100 transition-colors">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">{label}</p>
        <p className={`text-sm font-semibold ${valueColor} truncate`}>{display}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// View Modal — all real API fields
// ─────────────────────────────────────────────────────────────────────────────

function ViewUserModal({ user, onClose }) {
  if (!user) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Amber hero header */}
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 px-6 pt-6 pb-10 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/15 transition-colors"
          >
            <FiX className="h-5 w-5" />
          </button>
          <div className="flex flex-col items-center text-center">
            {/* Avatar with white ring */}
            <div className="ring-4 ring-white/30 rounded-full mb-3">
              <Avatar name={user.name} size="h-16 w-16" />
            </div>
            <h3 className="text-xl font-bold text-white">{user.name}</h3>
            {user.username && (
              <p className="text-amber-100 text-sm mt-0.5">@{user.username}</p>
            )}
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              <span className="text-xs px-3 py-1 rounded-full bg-white/20 text-white font-medium border border-white/30">
                {user.role}
              </span>
              {user.invitationStatus && (
                <span className="text-xs px-3 py-1 rounded-full bg-white/20 text-white font-medium border border-white/30">
                  {user.invitationStatus}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Details card — overlaps hero */}
        <div className="-mt-5 mx-4 bg-white rounded-2xl shadow-xl border border-amber-100 px-6 py-5 space-y-1 mb-6 relative z-10">
          <DetailRow icon={<FiMail className="h-4.5 w-4.5" />}       label="Email Address" value={user.email} />
          <DetailRow icon={<FiShield className="h-4.5 w-4.5" />}     label="User Permission" value={user.userType} />
          <DetailRow icon={<FiCheckCircle className="h-4.5 w-4.5" />} label="Verification Status"
            value={user.isEmailVerified != null ? (user.isEmailVerified ? "✓ Verified Account" : "✗ Verification Pending") : null}
            valueColor={user.isEmailVerified ? "text-green-600" : "text-amber-500"}
          />
          <DetailRow icon={<FiToggleLeft className="h-4.5 w-4.5" />} label="Security Status"
            value={user.isBanned != null ? (user.isBanned ? "Account Restricted" : "Active & Healthy") : null}
            valueColor={user.isBanned ? "text-red-500" : "text-green-600"}
          />
          <DetailRow icon={<FiClock className="h-4.5 w-4.5" />}      label="Activity Status" value={timeAgo(user.lastActive || user.lastLoggedIn)} />
          <DetailRow icon={<FiCalendar className="h-4.5 w-4.5" />}   label="Member Since"    value={formatDate(user.createdAt)} />
          {user.rate != null && (
            <DetailRow icon={<FiStar className="h-4.5 w-4.5" />} label="Performance Rate" value={String(user.rate)} />
          )}
        </div>

        <div className="px-4 pb-5">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-colors text-sm shadow-md shadow-amber-500/25"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// Edit Modal — name + role (all editable fields)
// ─────────────────────────────────────────────────────────────────────────────

function EditUserModal({ user, onClose, onSaved }) {
  const [name, setName] = useState(user?.name || "");
  const [role, setRole] = useState(user?.role || "viewer");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState(false);

  const isDirty = name.trim() !== (user?.name || "") || role !== (user?.role || "");

  const ROLE_CONFIG = {
    admin:  { icon: <FiShield className="h-4 w-4" />, active: "border-amber-500 bg-amber-50 text-amber-700", desc: "Full access — manages users, settings & all processes." },
    editor: { icon: <FiEdit2  className="h-4 w-4" />, active: "border-amber-400 bg-amber-50 text-amber-700", desc: "Can create & edit processes but not manage users." },
    viewer: { icon: <FiEye    className="h-4 w-4" />, active: "border-amber-400 bg-amber-50 text-amber-700", desc: "Read-only access to all processes." },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }
    // Close immediately when nothing actually changed
    if (trimmedName === user?.name && role === user?.role) {
      onClose();
      return;
    }
    setError("");
    setLoading(true);
    try {
      // name is ALWAYS required by the API — send it even if unchanged
      const payload = { name: trimmedName, role };
      const res = await userAPI.updateUser(payload);
      const updated = { ...user, name: trimmedName, role, ...(res?.user || {}) };
      setSuccess(true);
      // short flash then propagate + re-fetch
      setTimeout(() => { onSaved(updated); }, 600);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update member. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;
  return (
    <ModalShell
      title="Edit Member"
      accentFrom="from-amber-500"
      accentTo="to-amber-600"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <div className="px-6 py-5 space-y-5">
          {/* User card */}
          <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
            <Avatar name={name || user.name} size="h-12 w-12" />
            <div className="min-w-0">
              <p className="font-bold text-gray-900 text-sm truncate">{name || user.name || "—"}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
              <p className="text-xs text-gray-400 mt-0.5">@{user.username || "—"}</p>
            </div>
            <span className={`ml-auto flex-shrink-0 text-xs px-2.5 py-1 rounded-full font-medium ${roleBadgeCls(role)}`}>
              {role}
            </span>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(""); }}
                className="pl-9 w-full border border-gray-300 rounded-xl py-2.5 pr-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-sm"
                placeholder="Enter full name"
                minLength={2}
                required
                disabled={loading || success}
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Role <span className="text-amber-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map((r) => {
                const cfg = ROLE_CONFIG[r];
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    disabled={loading || success}
                    className={`py-2.5 px-3 rounded-xl border-2 text-sm font-medium capitalize transition-all ${
                      role === r
                        ? cfg.active
                        : "border-gray-200 text-gray-500 hover:border-amber-300 hover:bg-amber-50/50"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <span className="flex flex-col items-center gap-1">
                      {cfg.icon}
                      {r}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-1.5 text-xs text-amber-600 font-medium">
              {ROLE_CONFIG[role]?.desc}
            </p>
          </div>

          {/* Error / Success */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              <FiAlertTriangle className="h-4 w-4 flex-shrink-0" /> {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
              <FiCheckCircle className="h-4 w-4 flex-shrink-0" /> Member updated successfully!
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2 px-6 pb-5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors text-sm disabled:opacity-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || success || !isDirty}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-amber-500/25"
          >
            {loading ? (
              <><Spinner size="h-4 w-4" cls="border-white" /> Saving...</>
            ) : success ? (
              <><FiCheckCircle className="h-4 w-4" /> Saved!</>
            ) : (
              <><FiSave className="h-4 w-4" /> Save Changes</>
            )}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Delete Modal
// ─────────────────────────────────────────────────────────────────────────────

function DeleteUserModal({ user, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      await userAPI.deleteUser(user._id || user.id);
      onDeleted(user._id || user.id);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete member. Please try again.");
      setLoading(false);
    }
  };

  if (!user) return null;
  return (
    <ModalShell
      title="Delete Member"
      accentFrom="from-amber-500"
      accentTo="to-amber-600"
      onClose={onClose}
    >
      <div className="px-6 py-5">
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mb-3 border-2 border-amber-200">
            <FiAlertTriangle className="h-7 w-7 text-amber-500" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1.5">Are you absolutely sure?</h3>
          <p className="text-sm text-gray-500 max-w-xs">
            This permanently deletes{" "}
            <span className="font-semibold text-gray-900">{user.name}</span>{" "}
            from the workspace. This action <span className="text-red-500 font-semibold">cannot</span> be undone.
          </p>
        </div>

        {/* User preview */}
        <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl border border-red-100 mb-4">
          <Avatar name={user.name} size="h-10 w-10" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          <span className={`ml-auto flex-shrink-0 text-xs px-2.5 py-1 rounded-full font-medium ${roleBadgeCls(user.role)}`}>
            {user.role}
          </span>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700">
            <FiAlertTriangle className="h-4 w-4 flex-shrink-0" /> {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors text-sm disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60 shadow-md shadow-red-500/20"
          >
            {loading ? (
              <><Spinner size="h-4 w-4" cls="border-white" /> Deleting...</>
            ) : (
              <><FiTrash2 className="h-4 w-4" /> Delete Member</>
            )}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}



function MenuItem({ icon, label, onClick, cls = "" }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 transition-colors ${cls}`}
    >
      {icon} {label}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function UsersPage() {
  const [users,      setUsers]      = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0, limit: 10 });
  const [roleStats,  setRoleStats]  = useState({ total: 0, admin: 0, editor: 0, viewer: 0 });
  const [search,     setSearch]     = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");

  const [viewUser,   setViewUser]   = useState(null);
  const [editUser,   setEditUser]   = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchTimer = useRef(null);
  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(searchTimer.current);
  }, [search]);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async (page = 1) => {
    setLoading(true);
    setError("");
    try {
      const data = await userAPI.getWorkspaceUsers({
        page,
        limit: pagination.limit,
        role:   filterRole === "all" ? "" : filterRole,
        search: debouncedSearch,
      });

      // Normalise response shape
      const list = data?.users || data?.members || data?.data || [];
      const meta = data?.pagination || data?.meta || {};

      setUsers(list);
      setPagination({
        page:       meta.page       || page,
        totalPages: meta.totalPages || Math.max(1, Math.ceil((meta.total || list.length) / pagination.limit)),
        total:      meta.total      || list.length,
        limit:      meta.limit      || pagination.limit,
      });

      // Role stats — prefer API summary, else compute from list
      if (data?.stats) {
        setRoleStats(data.stats);
      } else {
        const s = { total: meta.total || list.length, admin: 0, editor: 0, viewer: 0 };
        list.forEach((u) => { const r = u.role?.toLowerCase(); if (r in s) s[r]++; });
        setRoleStats(s);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load workspace users.");
    } finally {
      setLoading(false);
    }
  }, [filterRole, debouncedSearch, pagination.limit]); // eslint-disable-line

  useEffect(() => { fetchUsers(1); }, [filterRole, debouncedSearch]); // eslint-disable-line

  const handlePage = (p) => {
    if (p < 1 || p > pagination.totalPages) return;
    fetchUsers(p);
  };

  // ── Callbacks ──────────────────────────────────────────────────────────────
  const handleSaved = (updated) => {
    // Optimistically update the row immediately for perceived speed
    setUsers((prev) =>
      prev.map((u) => (u._id === updated._id || u.id === updated.id) ? updated : u)
    );
    setEditUser(null);
    // Then re-fetch from server to get the true latest state
    fetchUsers(pagination.page);
  };

  const handleDeleted = (id) => {
    const removed = users.find((u) => u._id === id || u.id === id);
    setUsers((prev) => prev.filter((u) => u._id !== id && u.id !== id));
    if (removed) {
      setRoleStats((prev) => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
        ...(removed.role in prev ? { [removed.role]: Math.max(0, (prev[removed.role] ?? 1) - 1) } : {}),
      }));
    }
    setDeleteUser(null);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="py-6">
      {/* Modals */}
      {viewUser   && <ViewUserModal   user={viewUser}   onClose={() => setViewUser(null)} />}
      {editUser   && <EditUserModal   user={editUser}   onClose={() => setEditUser(null)}   onSaved={handleSaved} />}
      {deleteUser && <DeleteUserModal user={deleteUser} onClose={() => setDeleteUser(null)} onDeleted={handleDeleted} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
          <p className="text-gray-500 mt-0.5 text-sm">Manage your team members and their permissions</p>
        </div>
        <Link
          href="/users/add"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 font-medium text-sm shadow-lg shadow-amber-500/25 transition-all"
        >
          <FiUserPlus className="h-4 w-4" /> Add Team Member
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Members" value={roleStats.total}  icon={<FiUsers  className="h-5 w-5 text-amber-600" />} bg="bg-amber-50"  ring="ring-amber-100" />
        <StatCard label="Admins"        value={roleStats.admin}  icon={<FiShield className="h-5 w-5 text-red-500"  />} bg="bg-red-50"    ring="ring-red-100" />
        <StatCard label="Editors"       value={roleStats.editor} icon={<FiEdit2  className="h-5 w-5 text-blue-500" />} bg="bg-blue-50"   ring="ring-blue-100" />
        <StatCard label="Viewers"       value={roleStats.viewer} icon={<FiEye    className="h-5 w-5 text-green-500"/>} bg="bg-green-50"  ring="ring-green-100" />
      </div>

      {/* Search / Filter bar */}
      <div className="bg-white rounded-2xl border border-gray-100 px-5 py-3.5 shadow-sm mb-5 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="pl-9 w-full border border-gray-200 rounded-xl py-2.5 pr-9 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none text-sm transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FiX className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Role filter */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <FiFilter className="h-4 w-4 text-gray-400" />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="border border-gray-200 rounded-xl py-2.5 pl-3 pr-8 outline-none text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all min-w-[130px] bg-white"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>

        {/* Refresh */}
        <button
          onClick={() => fetchUsers(pagination.page)}
          className="p-2.5 border border-gray-200 rounded-xl text-gray-500 hover:border-amber-400 hover:text-amber-600 transition-colors flex-shrink-0"
          title="Refresh"
        >
          <FiRefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">All Team Members</h2>
          {!loading && (
            <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">
              {pagination.total} member{pagination.total !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* States */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Spinner size="h-9 w-9" />
            <p className="text-sm text-gray-400">Loading team members…</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-3">
              <FiAlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <p className="text-sm font-semibold text-gray-900 mb-1">Something went wrong</p>
            <p className="text-xs text-gray-500 mb-4 max-w-xs">{error}</p>
            <button
              onClick={() => fetchUsers(1)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <FiRefreshCw className="h-4 w-4" /> Try Again
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-3">
              <FiUsers className="h-6 w-6 text-amber-500" />
            </div>
            <p className="text-sm font-semibold text-gray-900 mb-1">No members found</p>
            <p className="text-xs text-gray-500 mb-4">
              {search || filterRole !== "all" ? "Try clearing your search or filter." : "Add your first team member to get started."}
            </p>
            <Link
              href="/users/add"
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium"
            >
              <FiUserPlus className="h-4 w-4" /> Add Member
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Member", "Role", "Status", "Last Active", "Verified", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => {
                  const uid = user._id || user.id;
                  return (
                    <tr key={uid} className="hover:bg-amber-50/30 transition-colors group">
                      {/* Member */}
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Avatar name={user.name} />
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              <FiMail className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate max-w-[180px]">{user.email}</span>
                            </p>
                            {user.username && (
                              <p className="text-xs text-gray-400 mt-0.5">@{user.username}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${roleBadgeCls(user.role)}`}>
                          {user.role === "admin"  && <FiShield className="h-3 w-3" />}
                          {user.role === "editor" && <FiEdit2  className="h-3 w-3" />}
                          {user.role === "viewer" && <FiEye    className="h-3 w-3" />}
                          {user.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        {user.isBanned ? (
                          <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-red-100 text-red-700">
                            Banned
                          </span>
                        ) : user.invitationStatus ? (
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusBadgeCls(user.invitationStatus === "accepted" ? "active" : user.invitationStatus)}`}>
                            {user.invitationStatus}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>

                      {/* Last Active */}
                      <td className="px-6 py-3.5 whitespace-nowrap text-xs text-gray-500">
                        {timeAgo(user.lastActive || user.lastLoggedIn)}
                      </td>

                      {/* Email Verified */}
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        {user.isEmailVerified
                          ? <FiCheckCircle className="h-4 w-4 text-green-500" title="Verified" />
                          : <FiXCircle     className="h-4 w-4 text-red-400"   title="Not verified" />
                        }
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setViewUser(user)}
                            title="View details"
                            className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          >
                            <FiEye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setEditUser(user)}
                            title="Edit member"
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <FiEdit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteUser(user)}
                            title="Delete member"
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                          
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-5 px-1">
          <p className="text-xs text-gray-500">
            Page <span className="font-semibold text-gray-700">{pagination.page}</span> of{" "}
            <span className="font-semibold text-gray-700">{pagination.totalPages}</span>
            {" "}· {pagination.total} total
          </p>
          <div className="flex items-center gap-1.5">
            <PagerBtn onClick={() => handlePage(pagination.page - 1)} disabled={pagination.page <= 1}>
              <FiChevronLeft className="h-4 w-4" />
            </PagerBtn>
            {buildPages(pagination.page, pagination.totalPages).map((item, i) =>
              item === "…" ? (
                <span key={`e${i}`} className="px-1 text-gray-400 text-sm">…</span>
              ) : (
                <PagerBtn
                  key={item}
                  onClick={() => handlePage(item)}
                  active={pagination.page === item}
                >
                  {item}
                </PagerBtn>
              )
            )}
            <PagerBtn onClick={() => handlePage(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages}>
              <FiChevronRight className="h-4 w-4" />
            </PagerBtn>
          </div>
        </div>
      )}

      {/* Role description cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
        <RoleCard
          icon={<FiShield className="h-5 w-5 text-red-500"  />}
          iconBg="bg-red-50"
          title="Admin"
          can={["Full system access","Manage users & roles","Company settings","All process operations"]}
          cannot={[]}
        />
        <RoleCard
          icon={<FiEdit2  className="h-5 w-5 text-blue-500" />}
          iconBg="bg-blue-50"
          title="Editor"
          can={["Create & edit processes","Manage assigned tasks"]}
          cannot={["Cannot manage users","Cannot change settings"]}
        />
        <RoleCard
          icon={<FiEye    className="h-5 w-5 text-green-500"/>}
          iconBg="bg-green-50"
          title="Viewer"
          can={["View all processes","Read-only access"]}
          cannot={["Cannot edit content","Cannot create content"]}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Pure helpers
// ─────────────────────────────────────────────────────────────────────────────

function buildPages(current, total) {
  const pages = Array.from({ length: total }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === total || Math.abs(p - current) <= 1);
  return pages.reduce((acc, p, i, arr) => {
    if (i > 0 && p - arr[i - 1] > 1) acc.push("…");
    acc.push(p);
    return acc;
  }, []);
}

function PagerBtn({ onClick, disabled, active, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`min-w-[34px] h-8 rounded-lg text-sm font-medium transition-colors flex items-center justify-center ${
        active
          ? "bg-amber-500 text-white shadow-sm"
          : "border border-gray-200 text-gray-600 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-600 disabled:opacity-40 disabled:cursor-not-allowed"
      }`}
    >
      {children}
    </button>
  );
}

function StatCard({ label, value, icon, bg, ring }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 p-5 shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value ?? "—"}</p>
        </div>
        <div className={`${bg} p-3 rounded-xl ring-4 ${ring}`}>{icon}</div>
      </div>
    </div>
  );
}

function RoleCard({ icon, iconBg, title, can, cannot }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center gap-2.5 mb-3">
        <div className={`${iconBg} p-2 rounded-lg`}>{icon}</div>
        <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
      </div>
      <ul className="space-y-1.5 text-xs text-gray-600">
        {can.map((item) => (
          <li key={item} className="flex items-center gap-1.5">
            <FiCheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0" /> {item}
          </li>
        ))}
        {cannot.map((item) => (
          <li key={item} className="flex items-center gap-1.5">
            <FiXCircle className="h-3.5 w-3.5 text-red-400 flex-shrink-0" /> {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
