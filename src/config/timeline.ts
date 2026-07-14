export type TimelineItem = {
  id: string;
  title: string;
  caption: string;
  quote: string;
  photo?: string;
};

export const timeline: TimelineItem[] = [
  {
    id: "first-meet",
    title: "Lần đầu gặp",
    caption: "Có những khoảnh khắc mà anh biết — nó sẽ ở lại rất lâu.",
    quote: "Trong hàng nghìn khuôn mặt, ánh mắt anh chỉ dừng ở em.",
  },
  {
    id: "first-chat",
    title: "Tin nhắn đầu tiên",
    caption: "Anh gõ rồi xoá, xoá rồi gõ, chỉ để một câu chào trông thật tự nhiên.",
    quote: "Và em đã trả lời — thế là bắt đầu một chương mới.",
  },
  {
    id: "first-coffee",
    title: "Ly cafe đầu tiên",
    caption: "Anh không nhớ mình uống gì, chỉ nhớ em cười.",
    quote: "Cái cách em khuấy ly nước cũng đủ khiến anh mất tập trung.",
  },
  {
    id: "favorite-memory",
    title: "Ký ức anh giữ",
    caption: "Có một buổi tối, thành phố rất đông, nhưng anh chỉ thấy em.",
    quote: "Anh muốn kể lại nó cho em nghe, mỗi ngày.",
  },
  {
    id: "today",
    title: "Và hôm nay",
    caption: "Anh làm cả một website chỉ để nói với em một điều.",
    quote: "Chờ em đọc tới cuối nhé.",
  },
];