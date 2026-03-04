import Image from "next/image";
import Link from "next/link";

const articles = [
    {
        title: "Hướng dẫn cài đặt cấu hình vòng quay may mắn",
        url: "/huong-dan-cai-dat",
        img: "/wp-content/uploads/2025/09/Huong-dan-cai-dat-cau-hinh-vong-quay-may-man-768x432.jpg"
    },
    {
        title: "Hướng dẫn cài dữ liệu mới (thêm kết quả quay) vào vòng quay may mắn",
        url: "/huong-dan-them-ket-qua",
        img: "/wp-content/uploads/2025/09/Huong-dan-cai-du-lieu-moi-vao-vong-quay-may-man-768x432.jpg"
    },
    {
        title: "Hướng dẫn xoá dữ liệu mặc định của vòng quay may mắn để cài dữ liệu mới",
        url: "/huong-dan-xoa",
        img: "/wp-content/uploads/2025/09/Huong-dan-xoa-du-lieu-mac-dinh-cua-vong-quay-may-man-de-cai-du-lieu-moi-768x432.jpg"
    }
];

export default function ArticleList() {
    return (
        <section className="builder-section py-16 bg-white border-t border-slate-100 mt-12">
            <div className="section-inner max-w-6xl mx-auto px-4">
                <h2 className="section-title text-3xl font-bold mb-10 text-slate-800">Bài viết mới</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article, idx) => (
                        <article key={idx} className="post-card post-card--minimal bg-white border border-slate-100 rounded-2xl p-3.5 shadow-[0_6px_20px_rgba(2,6,23,0.04)] hover:shadow-[0_12px_28px_rgba(2,6,23,0.08)] hover:-translate-y-1 transition-all duration-300 group">
                            <Link href={article.url} className="thumb block overflow-hidden rounded-xl aspect-[16/9] bg-slate-100 relative mb-4">
                                <Image
                                    src={article.img}
                                    alt={article.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </Link>
                            <h3 className="title text-[17px] font-bold leading-snug px-1 mb-2">
                                <Link href={article.url} className="text-slate-800 hover:text-blue-600 line-clamp-2 transition-colors">
                                    {article.title}
                                </Link>
                            </h3>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
