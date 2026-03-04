"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqData = [
    {
        q: "Vòng quay này có thực sự mang lại may mắn không?",
        a: "Trang web được thiết kế như một công cụ hỗ trợ tạo sự hào hứng, bất ngờ và giải trí trong các hoạt động cá nhân hoặc tập thể. Chúng tôi không đảm bảo “may mắn” theo nghĩa tâm linh, nhưng công cụ hoàn toàn có thể giúp bạn tạo cảm giác hồi hộp, kích thích tinh thần và tạo ra niềm vui cho người chơi."
    },
    {
        q: "Tôi chơi nhiều lần thì có bị giảm tỉ lệ trúng không?",
        a: "Không. Mỗi lượt quay là một lần độc lập và không bị ảnh hưởng bởi lịch sử trước đó. Tỉ lệ trúng sẽ được giữ nguyên theo cấu hình thiết lập, bất kể quay 1 lần hay 100 lần."
    },
    {
        q: "Sử dụng vòng quay có mất phí không?",
        a: "Hoàn toàn miễn phí 100%. Bạn có thể tạo vòng quay, thiết lập phần thưởng, sử dụng bao nhiêu lần tùy thích mà không cần lo lắng về chi phí."
    },
    {
        q: "Cần đăng ký tài khoản mới dùng được không?",
        a: "Không cần. Không phải đăng nhập hay cung cấp thông tin cá nhân. Chỉ cần truy cập website là có thể dùng ngay lập tức, đảm bảo tính riêng tư tuyệt đối."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number>(0);

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? -1 : index);
    };

    return (
        <div className="max-w-3xl mx-auto my-16 relative z-10">
            <div className="text-center mb-12 relative">
                <h2 className="text-3xl md:text-4xl font-black text-white font-display inline-block relative">
                    Câu Hỏi Thường Gặp
                    {/* Subtle underline glow */}
                    <div className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-gradient-to-r from-blue-500 to-fuchsia-500 rounded-full blur-[2px]"></div>
                </h2>
            </div>

            <div className="space-y-4">
                {faqData.map((item, index) => {
                    const isOpen = openIndex === index;
                    return (
                        <div
                            key={index}
                            className={`glass-card overflow-hidden transition-all duration-300 ${isOpen ? "border-blue-500/30 bg-slate-800/80 shadow-[0_4px_30px_rgba(59,130,246,0.15)]" : "border-white/5 hover:border-white/10 hover:bg-slate-800/60"
                                }`}
                        >
                            <button
                                className="w-full text-left px-6 py-5 flex justify-between items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
                                onClick={() => toggle(index)}
                                aria-expanded={isOpen}
                            >
                                <span className={`font-semibold text-[16px] pr-4 transition-colors ${isOpen ? "text-blue-400" : "text-white"}`}>
                                    {item.q}
                                </span>
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? "bg-blue-500/20 text-blue-400 rotate-180" : "bg-white/5 text-slate-400"}`}>
                                    <ChevronDown size={18} />
                                </div>
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-[400ms] ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                            >
                                <div className="px-6 pb-6 pt-1 text-slate-300 leading-relaxed text-[15px] border-t border-white/5">
                                    <p className="opacity-90">{item.a}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
