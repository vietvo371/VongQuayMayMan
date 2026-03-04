"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-slate-950/70 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-3"
          : "bg-transparent py-5"
        }`}
    >
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        <Link
          href="/"
          className="brand relative group flex items-center gap-2"
        >
          {/* Logo glow effect on hover */}
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-fuchsia-600 rounded-lg opacity-0 group-hover:opacity-40 blur-lg transition duration-500"></div>

          <Image
            src="/wp-content/uploads/2025/09/LOGO-VQMM.png"
            alt="Logo Vòng Quay May Mắn"
            width={220}
            height={50}
            className="h-[32px] sm:h-[38px] w-auto relative z-10 brightness-[1.2]"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center">
          <ul className="flex space-x-1 items-center bg-slate-800/40 backdrop-blur-md border border-white/5 rounded-full px-2 py-1 relative">
            {navLinks.map((link, idx) => (
              <li key={idx}>
                <Link
                  href={link.href}
                  className="relative px-5 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors duration-300 group"
                >
                  {link.label}
                  {/* Hover indicator */}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-blue-400 to-fuchsia-400 rounded-t-full group-hover:w-3/4 transition-all duration-300"></span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Action Button (Desktop) */}
        <div className="hidden lg:block">
          <Link
            href="/"
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-fuchsia-600 hover:from-blue-500 hover:to-fuchsia-500 text-white text-sm font-bold rounded-full shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_25px_rgba(217,70,239,0.5)] transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Tạo Vòng Quay
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-white p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? "max-h-[400px] py-4" : "max-h-0 py-0"
          }`}
      >
        <div className="container mx-auto px-6 flex flex-col space-y-2">
          {navLinks.map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              className="px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all text-base font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 mt-2 border-t border-white/10">
            <Link
              href="/"
              className="flex justify-center items-center w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white text-base font-bold rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.3)]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tạo Vòng Quay Ngay
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

const navLinks = [
  { href: "/gioi-thieu", label: "Giới Thiệu" },
  { href: "/lien-he", label: "Liên Hệ" },
  { href: "/huong-dan-su-dung", label: "Hướng Dẫn" },
];
