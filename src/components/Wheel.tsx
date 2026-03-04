"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, X, Trash2 } from "lucide-react";
import {
    getWheelConfig,
    saveWheelConfig,
    getNextSequenceItem,
    advanceSpinIndex,
    WheelConfig,
    WheelItem,
} from "@/lib/wheelConfig";

const getRandomColor = () => {
    const colors = ["#E11D48", "#7C3AED", "#0284C7", "#EA580C", "#059669", "#D946EF", "#06B6D4", "#EAB308"];
    return colors[Math.floor(Math.random() * colors.length)];
};

export default function Wheel() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Config được load từ localStorage
    const [config, setConfig] = useState<WheelConfig | null>(null);
    const [items, setItems] = useState<WheelItem[]>([]);

    const [isSpinning, setIsSpinning] = useState(false);
    const [result, setResult] = useState<WheelItem | null>(null);
    const [newItemText, setNewItemText] = useState("");

    const rotationRef = useRef(0);
    const spinningRef = useRef(false);

    // Load config từ localStorage sau khi mount (client-side only)
    useEffect(() => {
        const cfg = getWheelConfig();
        setConfig(cfg);
        setItems(cfg.items);
    }, []);

    // Khi items thay đổi (do user thêm/xóa trực tiếp trên page chính), sync vào config.
    // Đồng thời lọc sạch các stale IDs trong spinSequence (IDs không còn tồn tại).
    const syncItems = (newItems: WheelItem[]) => {
        setItems(newItems);
        if (config) {
            const newIds = new Set(newItems.map(i => i.id));
            const cleanedSequence = config.spinSequence.filter(id => newIds.has(id));
            const updated: WheelConfig = {
                ...config,
                items: newItems,
                spinSequence: cleanedSequence,
                // Nếu con trỏ vượt quá sequence mới, reset về 0
                spinIndex: Math.min(config.spinIndex, Math.max(0, cleanedSequence.length - 1)),
            };
            setConfig(updated);
            saveWheelConfig(updated);
        }
    };

    // ---- Vẽ vòng quay ----
    const drawWheel = (currentItems: WheelItem[], rotation: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 20;
        const sliceAngle = (2 * Math.PI) / Math.max(currentItems.length, 1);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (currentItems.length === 0) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.fillStyle = "#1e293b";
            ctx.fill();
            ctx.fillStyle = "#94a3b8";
            ctx.font = "italic 22px 'Inter', sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("Chưa có dữ liệu", centerX, centerY + 8);
            return;
        }

        // Glow outline
        ctx.shadowBlur = 30;
        ctx.shadowColor = "rgba(0, 229, 255, 0.5)";
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 6;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Slices
        for (let i = 0; i < currentItems.length; i++) {
            const startAngle = rotation + i * sliceAngle;
            const endAngle = startAngle + sliceAngle;

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = currentItems[i].color;
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
            ctx.stroke();

            // Text
            ctx.save();
            ctx.translate(centerX, centerY);
            const angle = startAngle + sliceAngle / 2;
            ctx.rotate(angle);
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 20px 'Inter', 'Segoe UI', sans-serif";
            ctx.shadowBlur = 4;
            ctx.shadowColor = "rgba(0,0,0,0.8)";

            const textToDraw = currentItems[i].text.length > 20 ? currentItems[i].text.slice(0, 20) + "..." : currentItems[i].text;
            const normAngle = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

            if (normAngle > Math.PI / 2 && normAngle < (3 * Math.PI) / 2) {
                ctx.rotate(Math.PI);
                ctx.textAlign = "left";
                ctx.fillText(textToDraw, -radius + 35, 7);
            } else {
                ctx.textAlign = "right";
                ctx.fillText(textToDraw, radius - 35, 7);
            }
            ctx.restore();
        }

        // Center circle + text
        ctx.beginPath();
        ctx.arc(centerX, centerY, 55, 0, 2 * Math.PI);
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 55);
        gradient.addColorStop(0, "#ffffff");
        gradient.addColorStop(0.85, "#f1f5f9");
        gradient.addColorStop(1, "#e2e8f0");
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.lineWidth = 6;
        ctx.strokeStyle = "rgba(0, 229, 255, 0.8)";
        ctx.shadowBlur = 0;
        ctx.stroke();

        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 13px 'Inter', 'Segoe UI', sans-serif";
        ctx.textAlign = "center";
        ctx.shadowBlur = 0;
        ctx.fillText("QUAY", centerX, centerY - 4);
        ctx.fillText("NGAY", centerX, centerY + 13);
    };

    useEffect(() => {
        if (items.length === 0) return;
        if (document.fonts) {
            document.fonts.ready.then(() => drawWheel(items, rotationRef.current));
        } else {
            drawWheel(items, rotationRef.current);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items]);

    // ---- Tính góc quay để dừng đúng slice target ----
    // startRotation PHẢI được truyền vào để tính đúng delta rotation cần thiết.
    // Công thức: startRotation + finalRotation + sliceMidAngle ≡ pointerAngle (mod 2π)
    // => finalRotation ≡ pointerAngle - sliceMidAngle - startRotation (mod 2π)
    const calcTargetRotation = (targetIdx: number, currentItems: WheelItem[], startRot: number): number => {
        const sliceAngle = (2 * Math.PI) / currentItems.length;
        const pointerAngle = (3 * Math.PI) / 2; // 12 giờ

        const sliceMidAngle = targetIdx * sliceAngle + sliceAngle / 2;

        // Số vòng quay tối thiểu 8-12 vòng (thêm vào để tạo cảm giác quay đủ lâu)
        const extraSpins = (Math.floor(Math.random() * 5) + 8) * 2 * Math.PI;

        // baseAngle: góc delta cần quay (chưa tính extra spins) để kim đúng giữa slice target
        const baseAngle = ((pointerAngle - sliceMidAngle - startRot) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);

        return extraSpins + baseAngle;
    };

    const spin = () => {
        if (spinningRef.current || items.length === 0 || !config) return;

        setIsSpinning(true);
        spinningRef.current = true;
        setResult(null);

        const spinDuration = 5500;
        const targetFrames = 60 * (spinDuration / 1000);
        let currentFrame = 0;

        // Lấy startRotation TRƯỚC khi tính finalRotation
        const startRotation = rotationRef.current;

        // Kiểm tra có sequence không, lấy giải tiếp theo
        const nextItem = getNextSequenceItem(config);
        let finalRotation: number;
        let determinedResult: WheelItem;
        // Track whether we need to advance the pointer (after animation ends)
        const shouldAdvance = !!nextItem;

        if (nextItem) {
            // Có config: quay đến đúng giải đã định
            const targetIdx = items.findIndex((item) => item.id === nextItem.id);
            if (targetIdx === -1) {
                // Giải bị xóa, random
                const randomIdx = Math.floor(Math.random() * items.length);
                finalRotation = calcTargetRotation(randomIdx, items, startRotation);
                determinedResult = items[randomIdx];
            } else {
                finalRotation = calcTargetRotation(targetIdx, items, startRotation);
                determinedResult = nextItem;
            }
        } else {
            // Ngẫu nhiên
            const randomIdx = Math.floor(Math.random() * items.length);
            finalRotation = calcTargetRotation(randomIdx, items, startRotation);
            determinedResult = items[randomIdx];
        }

        const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

        const animate = () => {
            currentFrame++;
            const progress = currentFrame / targetFrames;
            const easedProgress = easeOutCubic(progress);

            rotationRef.current = startRotation + easedProgress * finalRotation;
            drawWheel(items, rotationRef.current);

            if (currentFrame < targetFrames) {
                requestAnimationFrame(animate);
            } else {
                spinningRef.current = false;
                setIsSpinning(false);
                // Advance pointer AFTER animation ends (not at spin start)
                if (shouldAdvance) {
                    setConfig((prev) => {
                        if (!prev) return prev;
                        const updated = advanceSpinIndex(prev);
                        return updated;
                    });
                }
                setResult(determinedResult);
            }
        };

        requestAnimationFrame(animate);
    };

    // ---- Quản lý items trực tiếp trên page ----
    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemText.trim()) return;
        const newItem: WheelItem = { id: Date.now().toString(), text: newItemText.trim(), color: getRandomColor() };
        syncItems([...items, newItem]);
        setNewItemText("");
    };

    const removeItem = (id: string) => syncItems(items.filter((item) => item.id !== id));

    const removeResultItem = () => {
        if (!result || !config) return;

        const removedId = result.id;
        // Tìm vị trí của item trong sequence
        const posInSequence = config.spinSequence.indexOf(removedId);

        const newItems = items.filter(item => item.id !== removedId);
        const newIds = new Set(newItems.map(i => i.id));
        const cleanedSequence = config.spinSequence.filter(id => newIds.has(id));

        // Nếu item bị xoá nằm trước con trỏ hiện tại trong sequence
        // (tức là vừa được quay ra), cần giảm spinIndex để không bị bỏ qua lần tiếp theo
        let newSpinIndex = config.spinIndex;
        if (posInSequence >= 0 && posInSequence < config.spinIndex) {
            newSpinIndex = Math.max(0, config.spinIndex - 1);
        }
        newSpinIndex = Math.min(newSpinIndex, cleanedSequence.length);

        const updated: WheelConfig = {
            ...config,
            items: newItems,
            spinSequence: cleanedSequence,
            spinIndex: newSpinIndex,
        };

        setItems(newItems);
        setConfig(updated);
        saveWheelConfig(updated);
        setResult(null);
    };

    return (
        <div className="py-8 relative">
            <div className="container mx-auto px-4 lg:px-6">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-16 items-start">

                    {/* Bánh Xe May Mắn */}
                    <div className="xl:col-span-8 flex flex-col items-center justify-center">
                        <div className="relative w-full max-w-[550px] mx-auto mb-6 aspect-square">
                            {/* Kim chỉ */}
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-40 drop-shadow-[0_4px_10px_rgba(255,255,255,0.4)]">
                                <svg width="56" height="74" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 32L0 8C0 3.58172 3.58172 0 8 0H16C20.4183 0 24 3.58172 24 8L12 32Z" fill="url(#ptr_grad)" />
                                    <defs>
                                        <linearGradient id="ptr_grad" x1="12" y1="0" x2="12" y2="32" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#00E5FF" />
                                            <stop offset="1" stopColor="#6100FF" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>

                            {/* Glow nền */}
                            <div className="absolute inset-4 bg-gradient-to-tr from-fuchsia-600 to-blue-600 rounded-full blur-[60px] opacity-20 z-0" />

                            {/* Canvas */}
                            <canvas
                                ref={canvasRef}
                                width={600}
                                height={600}
                                className="absolute top-0 left-0 w-full h-full z-10 object-contain"
                            />

                            {/* Transparent click overlay */}
                            <button
                                onClick={spin}
                                disabled={isSpinning || items.length === 0}
                                aria-label="Quay ngay"
                                className="absolute z-30 rounded-full bg-transparent border-0 cursor-pointer disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-transform duration-200"
                                style={{
                                    width: "18.33%",
                                    height: "18.33%",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    animation: isSpinning ? "none" : "buttonPulseRing 2s infinite ease-in-out",
                                }}
                            />
                        </div>

                        {/* Sequence status indicator — chỉ hiện khi có sequence hợp lệ */}
                        {config && (() => {
                            const validSeq = config.spinSequence.filter(id => items.some(it => it.id === id));
                            if (validSeq.length === 0) return null;
                            const remaining = validSeq.length - config.spinIndex;
                            if (remaining <= 0) return null;
                            return (
                                <div className="flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-300 text-sm">
                                    <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
                                    Lần quay {config.spinIndex + 1}
                                    {/* {validSeq.length} */}
                                </div>
                            );
                        })()}
                    </div>

                    {/* Danh sách và Nhập phần thưởng */}
                    <div className="xl:col-span-4 w-full">
                        <div className="glass-card p-6 h-full min-h-[500px] flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute -right-20 -top-20 w-40 h-40 bg-fuchsia-600/20 blur-[60px] rounded-full" />

                            <div className="relative z-10 w-full flex flex-col h-full">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold text-white mb-2 font-display">Danh sách vòng quay</h3>
                                    <p className="text-sm text-slate-400">Có {items.length} phần thưởng đang được thiết lập</p>
                                </div>

                                <form onSubmit={handleAddItem} className="flex gap-2 mb-6">
                                    <input
                                        type="text"
                                        placeholder="Thêm giải thưởng mới..."
                                        value={newItemText}
                                        onChange={(e) => setNewItemText(e.target.value)}
                                        className="flex-1 bg-slate-900/60 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                    <button type="submit" disabled={!newItemText.trim() || isSpinning}
                                        className="px-4 py-3 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50">
                                        <Plus size={20} />
                                    </button>
                                </form>

                                <div className="flex-1 overflow-y-auto pr-2 space-y-2 max-h-[350px] custom-scrollbar mb-4">
                                    {items.map((item) => (
                                        <div key={item.id} className="group flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-white/5 hover:border-white/10 transition-colors">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <span className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                                                <span className="text-slate-300 font-medium truncate">{item.text}</span>
                                            </div>
                                            <button onClick={() => removeItem(item.id)} disabled={isSpinning}
                                                className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 p-1.5 transition-all disabled:opacity-0">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    {items.length === 0 && (
                                        <div className="text-center py-10 text-slate-500">Danh sách trống. Vui lòng thêm mục mới phía trên.</div>
                                    )}
                                </div>

                                <div className="pt-4 mt-auto border-t border-slate-800">
                                    <button onClick={() => syncItems([])} disabled={isSpinning || items.length === 0}
                                        className="w-full py-2.5 text-sm font-semibold text-slate-400 hover:text-red-400 transition-colors disabled:opacity-50">
                                        Xóa tất cả danh sách
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Kết Quả */}
                {result && !isSpinning && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" />
                        <div className="relative bg-slate-900 border border-slate-700 p-8 md:p-12 rounded-3xl shadow-[0_0_80px_rgba(59,130,246,0.3)] max-w-lg w-full text-center animate-in zoom-in-95 duration-500">
                            <div className="absolute -inset-10 bg-gradient-to-tr from-fuchsia-600/30 to-blue-600/30 rounded-3xl blur-[80px] -z-10" />
                            <button onClick={() => setResult(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-2">
                                <X size={24} />
                            </button>
                            <div className="mb-8">
                                <span className="inline-block py-1.5 px-4 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold tracking-widest uppercase mb-6">Kết quả vòng quay</span>
                                <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500 font-display break-words">
                                    {result.text}
                                </h2>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button onClick={() => setResult(null)}
                                    className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-colors shadow-lg shadow-white/10">
                                    Tuyệt vời! Quay lại
                                </button>
                                <button onClick={removeResultItem}
                                    className="px-6 py-3 bg-slate-800 text-slate-300 rounded-xl font-medium hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 border border-slate-700 transition-all">
                                    Xoá khỏi danh sách
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
