/* ============================================================
   DỮ LIỆU SẢN PHẨM TĨNH – thay thế backend Railway + MySQL
   Muốn sửa sản phẩm / link TikTok Shop / thêm ảnh: chỉ sửa file này.
   ============================================================ */
window.TSH = {
  // Link TikTok Shop chung (dùng khi sản phẩm không có link riêng).
  // TODO: thay bằng link gian hàng TikTok Shop thật của bạn.
  TIKTOK_SHOP_URL: "https://www.tiktok.com/@trasenhongloan",

  // true = hiện giá trên web, false = ẩn giá (nếu giá trên TikTok Shop hay đổi)
  SHOW_PRICE: true,

  CATEGORIES: {
    "tra-moc": "Trà Mộc",
    "tra-tui-loc": "Trà Túi Lọc",
    "qua-tang": "Bộ Quà Tặng",
    "thanh-phan": "Thành Phần",
  },

  /* price = giá đang bán (Giá KM), originalPrice = giá gốc.
     images: thêm đường dẫn ảnh khi có, ví dụ ["assets/product/tra-ngu-ngon.jpg"]
             (để [] thì web hiện biểu tượng thay thế).
     tiktok: link TikTok Shop riêng của sản phẩm (để "" thì dùng link chung). */
  PRODUCTS: [
    {
      id: 1,
      name: "Trà Ngủ Ngon",
      category: "tra-moc",
      desc: "Trà Sen giúp ngủ ngon, hỗ trợ những người mất ngủ, giúp thư giãn, giảm mệt mỏi.",
      detail:
        "Từ những nguyên liệu được tuyển chọn, trải qua quy trình chế biến tỉ mỉ, giữ trọn vẹn tinh túy.\nGiúp an thần, giảm căng thẳng, lo âu, cải thiện chất lượng giấc ngủ.\nGiảm căng thẳng, hỗ trợ điều trị mất ngủ hiệu quả.\nChứa nhiều vitamin và khoáng chất thiết yếu cho cơ thể.",
      price: 170000,
      originalPrice: 175000,
      unit: "hộp 250g",
      tags: ["bestseller"],
      images: [],
      tiktok: "",
    },
    {
      id: 2,
      name: "Trà Thanh Nhiệt",
      category: "tra-moc",
      desc: "Trà Thanh Nhiệt giúp giải độc cơ thể, làm mát gan và hỗ trợ thanh lọc các độc tố tích tụ bên trong.",
      detail:
        "Từ những thảo mộc tự nhiên được tuyển chọn, giữ trọn dược tính thanh khiết.\nGiúp giải nhiệt, giảm nóng trong, hỗ trợ điều trị mụn nhọt, rôm sảy.\nTăng cường chức năng gan và hệ bài tiết.\nMang lại cảm giác sảng khoái, nhẹ nhàng cho cơ thể mỗi ngày.",
      price: 170000,
      originalPrice: 175000,
      unit: "hộp 250g",
      tags: ["new"],
      images: [],
      tiktok: "",
    },
    {
      id: 3,
      name: "Trà Đường Huyết",
      category: "tra-moc",
      desc: "Trà Đường Huyết hỗ trợ ổn định chỉ số đường huyết, là giải pháp tự nhiên cho người có nguy cơ hoặc đang bị tiểu đường.",
      detail:
        "Thành phần thảo dược quý giúp hỗ trợ kiểm soát lượng đường trong máu hiệu quả.\nGiảm các triệu chứng mệt mỏi, khát nước do đường huyết cao gây ra.\nHỗ trợ ngăn ngừa các biến chứng liên quan đến tim mạch và huyết áp.\nThức uống an lành, không chứa đường hóa học hay chất bảo quản.",
      price: 150000,
      originalPrice: 155000,
      unit: "hộp 200g",
      tags: ["new"],
      images: [],
      tiktok: "",
    },
    {
      id: 4,
      name: "Trà Túi Lọc",
      category: "tra-tui-loc",
      desc: "Trà Túi Lọc mang đến sự tiện lợi tối đa mà vẫn giữ trọn hương vị trà tự nhiên, phù hợp với nhịp sống hiện đại.",
      detail:
        "Thiết kế túi lọc hiện đại, dễ dàng pha chế và sử dụng tại văn phòng hoặc khi đi du lịch.\nChiết xuất từ lá trà tươi sạch thông qua quy trình sấy lạnh tiên tiến.\nGiúp tỉnh táo, tập trung tinh thần và giảm căng thẳng tức thì.\nGiữ nguyên các hoạt chất chống oxy hóa có lợi cho sức khỏe.",
      price: 190000,
      originalPrice: 195000,
      unit: "hộp 168g",
      tags: ["new"],
      images: [],
      tiktok: "",
    },
    {
      id: 5,
      name: "Trà Hoa Sen",
      category: "qua-tang",
      desc: "Trà Hoa Sen với hương thơm thanh tao, thuần khiết, giúp an thần và nâng tầm nghệ thuật thưởng trà.",
      detail:
        "Hoa sen được thu hái thủ công vào sáng sớm để giữ trọn vẹn tinh dầu và hương thơm.\nGiúp thư giãn hệ thần kinh, hỗ trợ giấc ngủ sâu và yên bình.\nChống lão hóa, làm đẹp da từ sâu bên trong nhờ các dưỡng chất tự nhiên.\nMón quà tinh tế, sang trọng dành tặng người thân và đối tác.",
      price: 40000,
      originalPrice: 45000,
      unit: "hộp 100g",
      tags: ["new"],
      images: [],
      tiktok: "",
    },
    {
      id: 6,
      name: "Lá Sen Tươi (10kg)",
      category: "thanh-phan",
      desc: "Lá Sen Tươi được chọn từ nguồn nguyên liệu sạch.",
      detail:
        "Tuyển chọn từ những đầm sen sạch, lá to, xanh mướt và không hóa chất.\nĐóng gói số lượng lớn, đảm bảo độ tươi mới khi đến tay khách hàng.",
      price: 295000,
      originalPrice: 300000,
      unit: "bao 10kg",
      tags: ["new"],
      images: [],
      tiktok: "",
    },
    {
      id: 7,
      name: "Lá Tía Tô Sấy Khô (1kg)",
      category: "thanh-phan",
      desc: "Lá Tía Tô chế biến từ nguồn nguyên liệu sạch.",
      detail:
        "Sấy khô bằng công nghệ hiện đại giữ nguyên màu sắc và tinh chất tự nhiên.",
      price: 245000,
      originalPrice: 250000,
      unit: "túi 1kg",
      tags: ["new"],
      images: [],
      tiktok: "",
    },
    {
      id: 8,
      name: "Lá Sen Sấy Khô (2kg)",
      category: "thanh-phan",
      desc: "Lá Sen chế biến từ nguồn nguyên liệu sạch.",
      detail:
        "Sấy khô bằng công nghệ hiện đại giữ nguyên màu sắc và tinh chất tự nhiên.",
      price: 295000,
      originalPrice: 300000,
      unit: "túi 2kg",
      tags: ["new"],
      images: [],
      tiktok: "",
    },
  ],
};

// Gán link TikTok Shop chung cho mọi nút/liên kết có class "js-tiktok-shop"
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("a.js-tiktok-shop").forEach(function (a) {
    a.href = window.TSH.TIKTOK_SHOP_URL;
  });
});
