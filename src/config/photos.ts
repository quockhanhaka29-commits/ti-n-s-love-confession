export type Photo = {
  src?: string;
  caption?: string;
  frame?: "polaroid" | "glass" | "heart" | "modern";
};

// Thêm ảnh vào public/photos/ rồi khai báo path tại đây.
export const photos: Photo[] = [
  { caption: "✨ Kỷ niệm đầu tiên", frame: "polaroid" },
  { caption: "✨ Nụ cười của em", frame: "glass" },
  { caption: "✨ Một buổi chiều", frame: "modern" },
  { caption: "✨ Ký ức nhỏ", frame: "heart" },
  { caption: "✨ Khoảnh khắc", frame: "polaroid" },
  { caption: "✨ Em", frame: "glass" },
];