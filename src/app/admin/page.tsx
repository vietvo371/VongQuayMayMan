"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Plus, Trash2, ChevronUp, ChevronDown, Save,
    LogOut, RotateCcw, Shield, Eye, EyeOff, GripVertical
} from "lucide-react";
import {
    getWheelConfig,
    saveWheelConfig,
    WheelConfig,
    WheelItem,
} from "@/lib/wheelConfig";

const ADMIN_PASSWORD = "admin2025";
const AUTH_KEY = "vqmm_admin_authed";

const NEON_COLORS = [
    "#E11D48", "#7C3AED", "#0284C7", "#EA580C",
    "#059669", "#D946EF", "#EAB308", "#06B6D4",
    "#F97316", "#10B981", "#8B5CF6", "#EC4899",
    "#1E293B", "#14532D",
];

const generateId = () => Date.now().toString() + Math.random().toString(36).slice(2, 6);

export default function AdminPage() {
    const router = useRouter();
    const [authed, setAuthed] = useState(false);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [authError, setAuthError] = useState("");

    const [config, setConfig] = useState<WheelConfig | null>(null);
    const [newItemText, setNewItemText] = useState("");
    const [newItemColor, setNewItemColor] = useState(NEON_COLORS[0]);
    const [saved, setSaved] = useState(false);

    // Kiểm tra đã xác thực chưa
    useEffect(() => {
        if (sessionStorage.getItem(AUTH_KEY) === "1") {
            setAuthed(true);
            setConfig(getWheelConfig());
        }
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            sessionStorage.setItem(AUTH_KEY, "1");
            setAuthed(true);
            setConfig(getWheelConfig());
        } else {
            setAuthError("Mật khẩu không đúng. Vui lòng thử lại.");
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem(AUTH_KEY);
        router.push("/");
    };

    // --------- Prize Management ---------
    const addItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemText.trim() || !config) return;
        const newItem: WheelItem = { id: generateId(), text: newItemText.trim(), color: newItemColor };
        setConfig({ ...config, items: [...config.items, newItem] });
        setNewItemText("");
    };

    const removeItem = (id: string) => {
        if (!config) return;
        const updated: WheelConfig = {
            ...config,
            items: config.items.filter((i) => i.id !== id),
            spinSequence: config.spinSequence.filter((sid) => sid !== id),
        };
        setConfig(updated);
    };

    const updateItemText = (id: string, text: string) => {
        if (!config) return;
        setConfig({
            ...config,
            items: config.items.map((i) => (i.id === id ? { ...i, text } : i)),
        });
    };

    const updateItemColor = (id: string, color: string) => {
        if (!config) return;
        setConfig({
            ...config,
            items: config.items.map((i) => (i.id === id ? { ...i, color } : i)),
        });
    };

    // --------- Spin Sequence ---------
    const addToSequence = (itemId: string) => {
        if (!config) return;
        setConfig({ ...config, spinSequence: [...config.spinSequence, itemId] });
    };

    const removeFromSequence = (seqIdx: number) => {
        if (!config) return;
        const updated = [...config.spinSequence];
        updated.splice(seqIdx, 1);
        setConfig({ ...config, spinSequence: updated });
    };

    const moveSequenceItem = (idx: number, dir: -1 | 1) => {
        if (!config) return;
        const updated = [...config.spinSequence];
        const target = idx + dir;
        if (target < 0 || target >= updated.length) return;
        [updated[idx], updated[target]] = [updated[target], updated[idx]];
        setConfig({ ...config, spinSequence: updated });
    };

    const clearSequence = () => {
        if (!config) return;
        setConfig({ ...config, spinSequence: [], spinIndex: 0 });
    };

    const resetSpinPointer = () => {
        if (!config) return;
        setConfig({ ...config, spinIndex: 0 });
    };

    // --------- Save ---------
    const handleSave = () => {
        if (!config) return;
        saveWheelConfig({ ...config, spinIndex: 0 }); // Reset về lần quay 1 khi lưu config mới
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    // --------- Auth screen ---------
    if (!authed) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
                <div className="w-full max-w-md">
                    <div className="glass-card p-8 relative overflow-hidden">
                        <div className="absolute -top-20 -right-20 w-60 h-60 bg-violet-600/20 rounded-full blur-[80px]" />
                        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-600/20 rounded-full blur-[80px]" />
                        <div className="relative z-10">
                            <div className="flex items-center justify-center mb-8">
                                <div className="p-4 bg-violet-600/10 border border-violet-500/30 rounded-2xl">
                                    <Shield className="text-violet-400" size={36} />
                                </div>
                            </div>
                            <h1 className="text-2xl font-black text-white text-center mb-2 font-display">Admin — Quản trị vòng quay</h1>
                            <p className="text-slate-400 text-center text-sm mb-8">Nhập mật khẩu để truy cập cấu hình</p>

                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Mật khẩu admin..."
                                        value={password}
                                        onChange={(e) => { setPassword(e.target.value); setAuthError(""); }}
                                        className="w-full bg-slate-900/80 border border-slate-700/50 rounded-xl px-4 py-3 pr-12 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {authError && <p className="text-red-400 text-sm">{authError}</p>}
                                <button type="submit"
                                    className="w-full py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-violet-500/25">
                                    Đăng nhập
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!config) return null;

    const getItemById = (id: string) => config.items.find((i) => i.id === id);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-20">
            {/* Background glow */}
            <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-violet-700/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
            <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-700/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

            <div className="container mx-auto px-4 lg:px-6 max-w-6xl">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-white font-display">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">Admin</span> — Cấu hình Vòng Quay
                        </h1>
                        <p className="text-slate-400 mt-1 text-sm">Thiết lập phần thưởng và thứ tự kết quả vòng quay</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={resetSpinPointer}
                            title="Reset lại con trỏ quay về lần 1"
                            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl hover:bg-amber-500/20 transition-all text-sm font-semibold">
                            <RotateCcw size={16} /> Reset lần quay
                        </button>
                        <button onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl hover:text-red-400 hover:border-red-500/50 transition-all text-sm font-semibold">
                            <LogOut size={16} /> Đăng xuất
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* ===== Cột 1: Quản lý phần thưởng ===== */}
                    <div className="space-y-6">
                        <div className="glass-card p-6 relative overflow-hidden">
                            <div className="absolute -right-16 -top-16 w-32 h-32 bg-blue-600/15 rounded-full blur-[50px]" />
                            <div className="relative z-10">
                                <h2 className="text-xl font-bold text-white mb-1 font-display">Danh sách phần thưởng</h2>
                                <p className="text-slate-400 text-sm mb-6">Có {config.items.length} phần thưởng</p>

                                {/* Add new item form */}
                                <form onSubmit={addItem} className="mb-6 space-y-3">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Tên phần thưởng mới..."
                                            value={newItemText}
                                            onChange={(e) => setNewItemText(e.target.value)}
                                            className="flex-1 bg-slate-900/60 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                                        />
                                        <button type="submit" disabled={!newItemText.trim()}
                                            className="px-4 py-3 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50">
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                    {/* Color palette */}
                                    <div className="flex flex-wrap gap-2">
                                        {NEON_COLORS.map((c) => (
                                            <button key={c} type="button"
                                                onClick={() => setNewItemColor(c)}
                                                className="w-7 h-7 rounded-full transition-all hover:scale-110"
                                                style={{
                                                    backgroundColor: c,
                                                    boxShadow: newItemColor === c ? `0 0 0 2px #fff, 0 0 12px ${c}` : "none"
                                                }}
                                            />
                                        ))}
                                    </div>
                                </form>

                                {/* Items list */}
                                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
                                    {config.items.map((item) => (
                                        <div key={item.id}
                                            className="group flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-white/5 hover:border-white/10 transition-colors">
                                            {/* Color picker */}
                                            <div className="relative flex-shrink-0">
                                                <div className="w-5 h-5 rounded-full cursor-pointer ring-2 ring-white/20"
                                                    style={{ backgroundColor: item.color }}
                                                    title="Nhấn để đổi màu" />
                                                {/* Mini color palette on hover */}
                                                <div className="absolute left-0 top-7 z-50 hidden group-hover:flex flex-wrap gap-1 p-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-[120px]">
                                                    {NEON_COLORS.map((c) => (
                                                        <button key={c} type="button"
                                                            onClick={() => updateItemColor(item.id, c)}
                                                            className="w-5 h-5 rounded-full hover:scale-110 transition-transform flex-shrink-0"
                                                            style={{ backgroundColor: c }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Editable name */}
                                            <input
                                                value={item.text}
                                                onChange={(e) => updateItemText(item.id, e.target.value)}
                                                className="flex-1 bg-transparent text-slate-300 text-sm font-medium focus:outline-none focus:text-white border-b border-transparent focus:border-slate-500 transition-colors truncate"
                                            />

                                            {/* Delete */}
                                            <button onClick={() => removeItem(item.id)}
                                                className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 p-1 transition-all flex-shrink-0">
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ===== Cột 2: Thứ tự kết quả ===== */}
                    <div className="space-y-6">
                        <div className="glass-card p-6 relative overflow-hidden">
                            <div className="absolute -left-16 -top-16 w-32 h-32 bg-violet-600/15 rounded-full blur-[50px]" />
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-1">
                                    <h2 className="text-xl font-bold text-white font-display">Thứ tự kết quả</h2>
                                    {config.spinSequence.length > 0 && (
                                        <span className="text-xs px-2 py-1 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-full font-medium">
                                            Lần quay hiện tại: #{config.spinIndex + 1}
                                        </span>
                                    )}
                                </div>
                                <p className="text-slate-400 text-sm mb-4">Xếp thứ tự phần thưởng ra kết quả theo từng lần quay</p>

                                {/* Add to sequence */}
                                <div className="mb-4">
                                    <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-medium">Thêm vào danh sách thứ tự:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {config.items.map((item) => (
                                            <button key={item.id}
                                                onClick={() => addToSequence(item.id)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all hover:scale-105"
                                                style={{
                                                    backgroundColor: item.color + "22",
                                                    borderColor: item.color + "55",
                                                    color: "#fff"
                                                }}>
                                                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                                                {item.text.length > 18 ? item.text.slice(0, 18) + "..." : item.text}
                                                <Plus size={12} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Sequence list */}
                                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar mb-4">
                                    {config.spinSequence.length === 0 ? (
                                        <div className="text-center py-12 text-slate-500">
                                            <GripVertical className="mx-auto mb-3 opacity-30" size={28} />
                                            <p className="text-sm">Chưa có thứ tự. Thêm phần thưởng vào danh sách phía trên.</p>
                                            <p className="text-xs text-slate-600 mt-1">Nếu để trống, vòng quay sẽ quay ngẫu nhiên.</p>
                                        </div>
                                    ) : config.spinSequence.map((itemId, idx) => {
                                        const item = getItemById(itemId);
                                        if (!item) return null;
                                        const isPast = idx < config.spinIndex;
                                        const isCurrent = idx === config.spinIndex;
                                        return (
                                            <div key={idx}
                                                className={`flex items-center gap-3 p-3 rounded-xl border transition-all
                          ${isCurrent ? "bg-violet-500/10 border-violet-500/40" : isPast ? "opacity-40 bg-slate-800/20 border-white/5" : "bg-slate-800/40 border-white/5 hover:border-white/10"}`}>
                                                {/* Index badge */}
                                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0
                          ${isCurrent ? "bg-violet-500 text-white" : "bg-slate-700 text-slate-400"}`}>
                                                    {idx + 1}
                                                </span>

                                                <span className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                                                <span className="flex-1 text-slate-300 text-sm font-medium truncate">{item.text}</span>

                                                {/* Move up / down */}
                                                <div className="flex gap-1 flex-shrink-0">
                                                    <button onClick={() => moveSequenceItem(idx, -1)} disabled={idx === 0}
                                                        className="p-1 text-slate-500 hover:text-white disabled:opacity-20 transition-colors">
                                                        <ChevronUp size={15} />
                                                    </button>
                                                    <button onClick={() => moveSequenceItem(idx, 1)} disabled={idx === config.spinSequence.length - 1}
                                                        className="p-1 text-slate-500 hover:text-white disabled:opacity-20 transition-colors">
                                                        <ChevronDown size={15} />
                                                    </button>
                                                    <button onClick={() => removeFromSequence(idx)}
                                                        className="p-1 text-slate-500 hover:text-red-400 transition-colors ml-1">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {config.spinSequence.length > 0 && (
                                    <button onClick={clearSequence}
                                        className="w-full py-2 text-sm text-slate-500 hover:text-red-400 transition-colors border-t border-slate-800 pt-4">
                                        Xóa toàn bộ thứ tự (quay ngẫu nhiên)
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save button */}
                <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-end">
                    <p className="text-slate-500 text-sm text-center">
                        Sau khi lưu, con trỏ lần quay sẽ được reset về lần #1.
                    </p>
                    <button onClick={handleSave}
                        className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg
              ${saved
                                ? "bg-emerald-600 shadow-emerald-500/30"
                                : "bg-gradient-to-r from-violet-600 to-blue-600 hover:opacity-90 shadow-violet-500/25"}`}>
                        <Save size={18} />
                        {saved ? "Đã lưu thành công!" : "Lưu cấu hình"}
                    </button>
                </div>
            </div>
        </div>
    );
}
