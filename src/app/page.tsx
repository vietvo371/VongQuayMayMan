import Wheel from "@/components/Wheel";
import FAQ from "@/components/FAQ";
import ArticleList from "@/components/ArticleList";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="relative mt-20 md:mt-24 pt-4 lg:pt-8 min-h-screen">
        {/* Sub-hero background flair */}
        <div className="absolute top-10 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        {/* Wheel Section */}
        <Wheel />

        {/* Info Content Section (Glassmorphism & Darkness) */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4 lg:px-6 max-w-5xl">
            <div className="glass-card p-8 md:p-14 relative overflow-hidden">
              {/* Decorative glow inside card */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -z-10"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-600/10 rounded-full blur-[80px] -z-10"></div>

              <div className="prose-premium relative z-10">
                <p className="text-lg md:text-xl font-medium text-white/90 mb-8 border-l-4 border-blue-500 pl-4 py-2">
                  <strong>Vòng quay may mắn random</strong> (viết tắt: <strong>VQMM</strong>) được thiết kế để hỗ trợ các hoạt động marketing, sự kiện, minigame, và quà tặng. Tạo trải nghiệm vòng quay <span className="text-blue-400">cực kỳ bắt mắt, miễn phí và mượt mà.</span>
                </p>

                <h2>Hướng dẫn tạo vòng quay tự ghi chuyên nghiệp</h2>
                <p>Khác biệt hoàn toàn so với các công cụ cũ kĩ, tại phiên bản Premium này, quy trình tạo ra một trải nghiệm vòng quay chưa bao giờ dễ dàng và đẹp mắt đến thế:</p>

                <h3>Bước 1: Quản lý danh sách phần thưởng trực tiếp</h3>
                <p>Ngay bên cạnh bảng Vòng Quay, bạn sẽ nhìn thấy mục <strong>"Danh sách vòng quay"</strong>. Tại đây bạn có thể thêm mới phần thưởng ngẫu nhiên bằng cách nhập Text và ấn biểu tượng <strong>+</strong>.</p>
                <p>Hệ thống sẽ ngay lập tức vẽ ra một mũi mới trên bánh xe với màu sắc Neon rực rỡ ngẫu nhiên, hoàn toàn real-time!</p>

                <figure className="my-10 relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-fuchsia-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                  <Image
                    src="/wp-content/uploads/2025/09/Them-du-lieu.jpg"
                    alt="Nhập dữ liệu của bạn vào ô trống"
                    width={1000}
                    height={624}
                    className="relative rounded-xl border border-white/10 shadow-2xl mx-auto w-full object-cover"
                  />
                  <figcaption className="text-center text-slate-400 text-sm mt-4 tracking-wide uppercase">Cập nhật nhanh chóng, tiện lợi</figcaption>
                </figure>

                <h3>Bước 2: Quay và hiệu ứng bùng nổ </h3>
                <p>Sau khi đã chuẩn bị xong bộ giải thưởng mong muốn, bạn chỉ việc ấn nút <strong>"QUAY NGAY"</strong> đang tỏa sáng giữa màn hình.</p>
                <ul>
                  <li className="prose-premium-bullet">Hệ thống áp dụng thuật toán **Bézier Curves** tạo độ trễ vật lý cực kỳ chân thật khi quay.</li>
                  <li className="prose-premium-bullet">Mỗi lần hiển thị kết quả, một cửa sổ Glow bóng bẩy sẽ bật ra chúc mừng người thắng cuộc.</li>
                  <li className="prose-premium-bullet">Bạn có thể chọn tiếp tục hoặc xóa ngay phần thưởng vừa trúng khỏi danh sách.</li>
                </ul>

                <div className="mt-16 border-t border-white/10 pt-10">
                  <FAQ />
                </div>

                {/* Styled Tags */}
                <div className="flex flex-wrap items-center gap-3 mt-12 bg-black/20 p-4 rounded-2xl border border-white/5">
                  <span className="text-slate-400 font-medium px-2">Từ khóa:</span>
                  {["vòng quay premium", "glassmorphism wheel", "tạo vòng quay 3d", "vòng quay neon"].map((tag, i) => (
                    <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition-all cursor-default">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Removed Article List because it breaks the App Premium flow, but we keep it here for data completeness styled as premium cards if needed */}
        {/* <ArticleList /> */}
      </div>
    </>
  );
}
