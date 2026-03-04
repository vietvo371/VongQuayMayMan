// wheelConfig.ts — Đọc/ghi cấu hình vòng quay từ localStorage

export interface WheelItem {
    id: string;
    text: string;
    color: string;
}

export interface WheelConfig {
    items: WheelItem[];
    // Danh sách ID phần thưởng theo thứ tự sẽ ra (lần quay 1, 2, 3...)
    spinSequence: string[];
    // Con trỏ lần quay hiện tại
    spinIndex: number;
}

const STORAGE_KEY = "vqmm_wheel_config";

const defaultConfig: WheelConfig = {
    items: [
        { id: "1", text: "Thẻ cào 10k", color: "#E11D48" },
        { id: "2", text: "Chúc may mắn lần sau", color: "#1E293B" },
        { id: "3", text: "Voucher 50k", color: "#7C3AED" },
        { id: "4", text: "Quay lại miễn phí", color: "#0284C7" },
        { id: "5", text: "Thẻ cào 20k", color: "#EA580C" },
        { id: "6", text: "Bộ gift độc quyền", color: "#059669" },
    ],
    spinSequence: [],
    spinIndex: 0,
};

export function getWheelConfig(): WheelConfig {
    if (typeof window === "undefined") return defaultConfig;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return defaultConfig;
        const parsed = JSON.parse(raw) as WheelConfig;
        // Đảm bảo bộ config đủ field
        return {
            items: parsed.items ?? defaultConfig.items,
            spinSequence: parsed.spinSequence ?? [],
            spinIndex: parsed.spinIndex ?? 0,
        };
    } catch {
        return defaultConfig;
    }
}

export function saveWheelConfig(config: WheelConfig): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

/**
 * Lấy giải tiếp theo theo sequence admin đã định.
 * Trả về item nếu còn trong sequence, hoặc null nếu hết (sẽ quay ngẫu nhiên).
 */
export function getNextSequenceItem(config: WheelConfig): WheelItem | null {
    if (!config.spinSequence || config.spinSequence.length === 0) return null;
    if (config.spinIndex >= config.spinSequence.length) return null;

    const targetId = config.spinSequence[config.spinIndex];
    return config.items.find((item) => item.id === targetId) ?? null;
}

/**
 * Tăng con trỏ lần quay. Gọi sau mỗi lần quay xong.
 */
export function advanceSpinIndex(config: WheelConfig): WheelConfig {
    const updated = { ...config, spinIndex: config.spinIndex + 1 };
    saveWheelConfig(updated);
    return updated;
}

/**
 * Reset con trỏ về 0 (bắt đầu lại sequence từ đầu).
 */
export function resetSpinIndex(config: WheelConfig): WheelConfig {
    const updated = { ...config, spinIndex: 0 };
    saveWheelConfig(updated);
    return updated;
}
