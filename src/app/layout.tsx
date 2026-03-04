import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Cấu hình font
const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Vòng Quay May Mắn Random - Tạo VQMM Tự Ghi Miễn Phí",
  description: "Công cụ Wheel of Fortune (bánh xe may mắn) trực tuyến, người dùng có thể tự ghi kết quả và Quay với tỉ lệ ngẫu nhiên, minh bạch.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
        {/* Không tải CSS cũ nữa vì đã chuyển sang Tailwind hoàn toàn */}
      </head>
      {/* 
        Sử dụng dark mode làm mặc định (bg-slate-950 text-slate-100)
        Thêm hình nền (background) dạng lưới tinh tế hoặc mờ ảo 
      */}
      <body className={`${inter.variable} ${outfit.variable} font-sans min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-fuchsia-500/30 relative overflow-x-hidden`}>
        {/* Hiệu ứng ánh sáng nền mờ ảo (Background Glow) */}
        <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-[100%] bg-blue-600/10 blur-[120px] pointer-events-none -z-10"></div>
        <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-[100%] bg-fuchsia-600/10 blur-[120px] pointer-events-none -z-10"></div>

        <Header />
        <main className="flex-grow z-0">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
