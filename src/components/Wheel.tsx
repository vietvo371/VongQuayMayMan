"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, X, Trash2 } from "lucide-react";

const defaultItems = [
    { id: "1", text: "Thẻ cào 10k", color: "#E11D48" }, // Rose 600
    { id: "2", text: "Chúc may mắn lần sau", color: "#1E293B" }, // Slate 800
    { id: "3", text: "Voucher 50k", color: "#7C3AED" }, // Violet 600
    { id: "4", text: "Quay lại miễn phí", color: "#0284C7" }, // Sky 600
    { id: "5", text: "Thẻ cào 20k", color: "#EA580C" }, // Orange 600
    { id: "6", text: "Bộ gift độc quyền", color: "#059669" }  // Emerald 600
];

const getRandomColor = () => {
    const colors = ["#E11D48", "#7C3AED", "#0284C7", "#EA580C", "#059669", "#D946EF", "#06B6D4", "#EAB308"];
    return colors[Math.floor(Math.random() * colors.length)];
};

export default function Wheel() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [items, setItems] = useState(defaultItems);
    const [isSpinning, setIsSpinning] = useState(false);
    const [result, setResult] = useState<{ id: string, text: string } | null>(null);

    const [newItemText, setNewItemText] = useState("");

    const rotationRef = useRef(0);
    const spinningRef = useRef(false);

    const drawWheel = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 20;
        const sliceAngle = (2 * Math.PI) / Math.max(items.length, 1);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (items.length === 0) {
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

        // Draw shadow glow
        ctx.shadowBlur = 30;
        ctx.shadowColor = "rgba(0, 229, 255, 0.5)";
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 6;
        ctx.stroke();
        ctx.shadowBlur = 0;

        for (let i = 0; i < items.length; i++) {
            const startAngle = rotationRef.current + i * sliceAngle;
            const endAngle = startAngle + sliceAngle;

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();

            ctx.fillStyle = items[i].color;
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
            ctx.stroke();

            // Text rendering
            ctx.save();
            ctx.translate(centerX, centerY);

            const angle = startAngle + sliceAngle / 2;
            let normAngle = angle % (2 * Math.PI);
            if (normAngle < 0) normAngle += 2 * Math.PI;

            ctx.rotate(angle);
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 20px 'Inter', 'Segoe UI', sans-serif";
            ctx.shadowBlur = 4;
            ctx.shadowColor = "rgba(0,0,0,0.8)";

            const textToDraw = items[i].text.length > 20 ? items[i].text.substring(0, 20) + "..." : items[i].text;

            // Flip text if on the left side of the wheel
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

        // Center circle with button text
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
        ctx.stroke();

        // Draw "QUAY NGAY" text on center button
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 13px 'Inter', 'Segoe UI', sans-serif";
        ctx.textAlign = "center";
        ctx.shadowBlur = 0;
        ctx.fillText("QUAY", centerX, centerY - 4);
        ctx.fillText("NGAY", centerX, centerY + 13);
    };

    useEffect(() => {
        // Handle hydration safely with fonts loading
        if (document.fonts) {
            document.fonts.ready.then(() => {
                drawWheel();
            });
        } else {
            drawWheel();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items]);

    const spin = () => {
        if (spinningRef.current || items.length === 0) return;

        setIsSpinning(true);
        spinningRef.current = true;
        setResult(null);

        const spinDuration = 5500;
        const targetFrames = 60 * (spinDuration / 1000);
        let currentFrame = 0;

        const randomSpins = Math.floor(Math.random() * 8 + 8);
        const targetAngle = Math.random() * Math.PI * 2;
        const finalRotation = (randomSpins * Math.PI * 2) + targetAngle;

        const easeOutCubic = (x: number): number => {
            return 1 - Math.pow(1 - x, 3);
        };

        const animate = () => {
            currentFrame++;
            const progress = currentFrame / targetFrames;
            const easedProgress = easeOutCubic(progress);

            rotationRef.current = easedProgress * finalRotation;
            drawWheel();

            if (currentFrame < targetFrames) {
                requestAnimationFrame(animate);
            } else {
                spinningRef.current = false;
                setIsSpinning(false);
                calculateResult();
            }
        };

        requestAnimationFrame(animate);
    };

    const calculateResult = () => {
        if (items.length === 0) return;

        // Kim chỉ cố định ở 12 giờ = 270° = 3π/2
        const pointerAngle = (3 * Math.PI) / 2;
        const sliceAngle = (2 * Math.PI) / items.length;

        // Góc tương đối giữa kim và vòng quay — normalize về [0, 2π)
        // Công thức chuẩn: không cần đảo chiều vì canvas vẽ slice theo chiều kim đồng hồ
        const rotation = rotationRef.current;
        const relativeAngle = ((pointerAngle - rotation) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);

        const hitIndex = Math.floor(relativeAngle / sliceAngle) % items.length;

        setResult(items[hitIndex]);
    };

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemText.trim()) return;

        setItems([
            ...items,
            {
                id: Date.now().toString(),
                text: newItemText.trim(),
                color: getRandomColor()
            }
        ]);
        setNewItemText("");
    };

    const removeItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

    const removeResultItem = () => {
        if (result) {
            removeItem(result.id);
            setResult(null);
        }
    }

    return (
        <div className="py-8 relative">
            <div className="container mx-auto px-4 lg:px-6">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-16 items-start">

                    {/* Bánh Xe May Mắn */}
                    <div className="xl:col-span-8 flex flex-col items-center justify-center">
                        {/* Container relative wrap khít canvas */}
                        <div className="relative w-full max-w-[550px] mx-auto mb-6 aspect-square">

                            {/* Pointer (Kim chỉ) */}
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-40 drop-shadow-[0_4px_10px_rgba(255,255,255,0.4)] transition-transform duration-100 ease-in-out">
                                <svg width="56" height="74" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 32L0 8C0 3.58172 3.58172 0 8 0H16C20.4183 0 24 3.58172 24 8L12 32Z" fill="url(#paint0_linear)" />
                                    <defs>
                                        <linearGradient id="paint0_linear" x1="12" y1="0" x2="12" y2="32" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#00E5FF" />
                                            <stop offset="1" stopColor="#6100FF" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>

                            {/* Glow nền */}
                            <div className="absolute inset-4 bg-gradient-to-tr from-fuchsia-600 to-blue-600 rounded-full blur-[60px] opacity-20 -z-10"></div>

                            {/* Canvas */}
                            <canvas
                                ref={canvasRef}
                                width={600}
                                height={600}
                                className="absolute top-0 left-0 w-full h-full z-10 object-contain drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                            />

                            {/* Nút quay trong suốt — chồng đúng tâm canvas.
                                Kích thước 110px = bán kính tâm vòng quay (55*2).
                                Căn giữa: top/left = 50% của container, margin = -55px (nửa kích thước).
                              */}
                            <button
                                onClick={spin}
                                disabled={isSpinning || items.length === 0}
                                aria-label="Quay ngay"
                                className="absolute z-30 rounded-full bg-transparent border-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 hover:scale-105 active:scale-95 transition-transform duration-200"
                                style={{
                                    width: '18.33%',       /* 110px / 600px canvas width */
                                    height: '18.33%',      /* 110px / 600px canvas height */
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    animation: isSpinning ? 'none' : 'buttonPulseRing 2s infinite ease-in-out'
                                }}
                            />
                        </div>
                    </div>

                    {/* Danh sách và Nút Nhập phần thưởng */}
                    <div className="xl:col-span-4 w-full">
                        <div className="glass-card p-6 h-full min-h-[500px] flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute -right-20 -top-20 w-40 h-40 bg-fuchsia-600/20 blur-[60px] rounded-full"></div>

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
                                        className="flex-1 bg-slate-900/60 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newItemText.trim() || isSpinning}
                                        className="px-4 py-3 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </form>

                                <div className="flex-1 overflow-y-auto pr-2 space-y-2 max-h-[350px] custom-scrollbar mb-4">
                                    {items.map((item) => (
                                        <div key={item.id} className="group flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-white/5 hover:border-white/10 transition-colors">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <span className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm" style={{ backgroundColor: item.color }}></span>
                                                <span className="text-slate-300 font-medium truncate">{item.text}</span>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                disabled={isSpinning}
                                                className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 p-1.5 transition-all disabled:opacity-0"
                                                title="Xóa phần thưởng"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    {items.length === 0 && (
                                        <div className="text-center py-10 text-slate-500">
                                            Danh sách trống. Vui lòng thêm mục mới phía trên.
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4 mt-auto border-t border-slate-800">
                                    <button
                                        onClick={() => setItems([])}
                                        disabled={isSpinning || items.length === 0}
                                        className="w-full py-2.5 text-sm font-semibold text-slate-400 hover:text-red-400 transition-colors disabled:opacity-50"
                                    >
                                        Xóa tất cả danh sách
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Kết Quả Lơ lửng màn hình */}
                {result && !isSpinning && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"></div>
                        <div className="relative bg-slate-900 border border-slate-700 p-8 md:p-12 rounded-3xl shadow-[0_0_80px_rgba(59,130,246,0.3)] max-w-lg w-full text-center animate-in zoom-in-95 duration-500">
                            <div className="absolute -inset-10 bg-gradient-to-tr from-fuchsia-600/30 to-blue-600/30 rounded-3xl blur-[80px] -z-10"></div>

                            <button
                                onClick={() => setResult(null)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-white p-2"
                            >
                                <X size={24} />
                            </button>

                            <div className="mb-8">
                                <span className="inline-block py-1.5 px-4 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold tracking-widest uppercase mb-6">Kết quả vòng quay</span>
                                <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500 font-display break-words">
                                    {result.text}
                                </h2>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button
                                    onClick={() => setResult(null)}
                                    className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-colors shadow-lg shadow-white/10"
                                >
                                    Tuyệt vời! Quay lại
                                </button>
                                <button
                                    onClick={removeResultItem}
                                    className="px-6 py-3 bg-slate-800 text-slate-300 rounded-xl font-medium hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 border border-slate-700 transition-all"
                                >
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
