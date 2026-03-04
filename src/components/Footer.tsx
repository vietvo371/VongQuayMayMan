import Link from "next/link";
import { Facebook, Youtube, Mail, MapPin, User, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="relative mt-24 border-t border-white/10 overflow-hidden bg-slate-950">
            {/* Background Glow matching layout */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[300px] bg-blue-900/20 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="container mx-auto px-6 py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">

                    {/* Brand Column */}
                    <div className="lg:col-span-5 pr-0 lg:pr-8">
                        <Link href="/" className="inline-block mb-6">
                            <Image
                                src="/wp-content/uploads/2025/09/LOGO-VQMM.png"
                                alt="Logo VQMM"
                                width={200}
                                height={40}
                                className="h-[32px] w-auto brightness-[1.2]"
                            />
                        </Link>
                        <p className="text-slate-400 text-[15px] leading-relaxed mb-8">
                            VongQuayMayMan.mobi là công cụ tạo vòng quay may mắn tự ghi trực tuyến miễn phí, cực kỳ dễ sử dụng. Giao diện cao cấp, tốc độ mượt mà. Giúp bạn tạo sự hào hứng cho mọi sự kiện.
                        </p>

                        <ul className="space-y-4 text-slate-300 text-[14px]">
                            <li className="flex items-start gap-3">
                                <div className="mt-1 w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                    <User size={12} className="text-blue-400" />
                                </div>
                                <span>Chịu trách nhiệm: <strong>Nguyễn Đăng Cường</strong></span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="mt-1 w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                    <Mail size={12} className="text-fuchsia-400" />
                                </div>
                                <span>Email: <a href="mailto:hotro@vongquaymayman.mobi" className="hover:text-blue-400 transition-colors">hotro@vongquaymayman.mobi</a></span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="mt-1 w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                    <MapPin size={12} className="text-emerald-400" />
                                </div>
                                <span>Địa chỉ: Lê Văn Thịnh, Suối Hoa, Bắc Ninh</span>
                            </li>
                        </ul>
                    </div>

                    {/* Spacer */}
                    <div className="hidden lg:block lg:col-span-1"></div>

                    {/* Links Column 1 */}
                    <div className="lg:col-span-3">
                        <h4 className="font-display text-white font-bold text-lg mb-6 tracking-wide">Về Chúng Tôi</h4>
                        <ul className="space-y-3">
                            {aboutLinks.map((link, idx) => (
                                <li key={idx}>
                                    <Link href={link.href} className="group flex items-center gap-2 text-[15px] text-slate-400 hover:text-white transition-colors">
                                        <ChevronRight size={14} className="text-blue-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                        <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div className="lg:col-span-3">
                        <h4 className="font-display text-white font-bold text-lg mb-6 tracking-wide">Thông Tin Khác</h4>
                        <ul className="space-y-3 mb-8">
                            {infoLinks.map((link, idx) => (
                                <li key={idx}>
                                    <Link href={link.href} className="group flex items-center gap-2 text-[15px] text-slate-400 hover:text-white transition-colors">
                                        <ChevronRight size={14} className="text-fuchsia-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                        <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <div className="flex gap-3">
                            <a href="https://www.facebook.com/vongquaymayman.mobi" target="_blank" rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-[#1877f2] hover:border-[#1877f2] hover:text-white transition-all duration-300 hover:scale-110 shadow-lg"
                                aria-label="Facebook"
                            >
                                <Facebook size={18} />
                            </a>
                            <a href="https://www.youtube.com/@VongQuayMayManMobi" target="_blank" rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-[#ff0000] hover:border-[#ff0000] hover:text-white transition-all duration-300 hover:scale-110 shadow-lg"
                                aria-label="YouTube"
                            >
                                <Youtube size={18} />
                            </a>
                        </div>
                    </div>

                </div>
            </div>

            {/* Copyright Bar */}
            <div className="border-t border-white/5 bg-black/20">
                <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-slate-500">
                        &copy; {new Date().getFullYear()} Vòng Quay May Mắn. Premium Edition.
                    </p>
                    <div className="flex items-center gap-6">
                        <div className="text-xs text-slate-600 font-medium tracking-widest uppercase">
                            Designed for the Future
                        </div>
                        <Link href="/admin"
                            className="text-[10px] text-slate-700 hover:text-slate-500 transition-colors tracking-widest uppercase font-medium">
                            Admin
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

const aboutLinks = [
    { href: "/", label: "Giới thiệu" },
    { href: "/", label: "Liên hệ" },
    { href: "/", label: "Điều khoản dịch vụ" },
    { href: "/", label: "Miễn trừ trách nhiệm" },
    { href: "/", label: "Bộ máy tổ chức" },
];

const infoLinks = [
    { href: "/", label: "Hướng dẫn sử dụng" },
    { href: "/", label: "Mã nhúng cho website" },
    { href: "/", label: "Hợp tác với chúng tôi" },
    { href: "/", label: "Blog tin tức" },
];
