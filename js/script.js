// du lieu san pham mac dinh cua trang web
const defaultProducts = [
    { id: 1, title: "Emerald Glass", price: 299000, image: "assets/images/product1.jpg", description: "Terrarium thủy tinh hiện đại với rêu xanh tự nhiên mang lại cảm giác thư giãn cho không gian làm việc." },
    { id: 2, title: "Moss Planet", price: 259000, image: "assets/images/product2.jpg", description: "Thiết kế terrarium mini với hệ rêu xanh tối giản phù hợp cho góc học tập hiện đại." },
    { id: 3, title: "Desert Bowl", price: 349000, image: "assets/images/product3.jpg", description: "Sự kết hợp giữa sen đá, sỏi trắng và thủy tinh tạo nên phong cách decor hiện đại." },
    { id: 4, title: "Nature Orb", price: 399000, image: "assets/images/product4.jpg", description: "Terrarium treo nghệ thuật với không gian xanh nhỏ gọn và sang trọng." },
    { id: 5, title: "Green Habitat", price: 279000, image: "assets/images/product5.jpg", description: "Không gian xanh thu nhỏ mang cảm giác yên bình và gần gũi với thiên nhiên." },
    { id: 6, title: "Mini Forest", price: 319000, image: "assets/images/product6.jpg", description: "Terrarium phong cách rừng mini giúp góc làm việc trở nên sinh động hơn." },
    { id: 7, title: "Crystal Moss", price: 289000, image: "assets/images/product7.jpg", description: "Thiết kế thủy tinh trong suốt kết hợp rêu xanh tạo vẻ đẹp tối giản hiện đại." },
    { id: 8, title: "Zen Garden", price: 369000, image: "assets/images/product8.jpg", description: "Lấy cảm hứng từ khu vườn Nhật Bản với phong cách tinh tế và thư giãn." },
    { id: 9, title: "Little Bunny Garden", price: 2470000, image: "assets/images/product9.jpg", description: "Khu vườn sen đá đáng yêu với điểm nhấn là mô hình chú thỏ xinh xắn giữa không gian sắc màu." },
    { id: 10, title: "Snowy Succulent Jar", price: 269000, image: "assets/images/product10.jpg", description: "Bình terrarium thanh lịch với lớp nền cát trắng làm nổi bật sự sinh động của các loài sen đá." },
    { id: 11, title: "The Little Oasis", price: 459000, image: "assets/images/product11.jpg", description: "Một ốc đảo xanh mát đầy tinh tế, mang đến vẻ đẹp thư thái cho không gian làm việc của bạn." },
    { id: 12, title: "Desert Mini-Scape", price: 329000, image: "assets/images/product12.jpg", description: "Góc sa mạc thu nhỏ cá tính với sự kết hợp hài hòa giữa xương rồng, sen đá và những viên đá tự nhiên." }
];
// lay du lieu san pham tu localStorage, neu chua co thi dung defaultProducts
let productData = JSON.parse(localStorage.getItem('plantlab_products')) || defaultProducts;
// lay gio hang da luu, neu chua co thi de mang rong
let cart = JSON.parse(localStorage.getItem('plantlab_cart')) || [];
// neu la lan dau vao trang thi luu san pham vao localStorage
if (!localStorage.getItem('plantlab_products')) {
    localStorage.setItem('plantlab_products', JSON.stringify(defaultProducts));
}
// sua lai duong dan anh cho dung vi tri cua trang hien tai
function suaAnh(imgPath) {
    if (!imgPath) return '';
    if (window.location.pathname.includes('/html/')) {
        return '../' + imgPath;
    }
    return imgPath;
}
// tim san pham trong mang theo id truyen vao
function laySpTheoId(id) {
    return productData.find(p => p.id == id);
}
// them san pham vao gio hang
function addToCart(maSP, soLuongThem = 1) {
    let sp = laySpTheoId(maSP);
    if (!sp) return;
    // kiem tra san pham nay da co trong gio chua
    let spDaCo = cart.find(item => item.id == maSP);
    if (spDaCo) {
        spDaCo.quantity += soLuongThem;
    } else {
        cart.push({
            id: sp.id,
            name: sp.title,
            price: sp.price,
            img: sp.image,
            quantity: soLuongThem
        });
    }
    luuVaCapNhatGio();
    hienToast(`Đã thêm ${soLuongThem} x ${sp.title} vào giỏ hàng!`);
}
// tang hoac giam so luong san pham trong gio
function changeQuantityInCart(maSP, delta) {
    let item = cart.find(item => item.id == maSP);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
        xoaKhoiGio(maSP);
    } else {
        luuVaCapNhatGio();
    }
}
// xoa san pham khoi gio hang
function xoaKhoiGio(maSP) {
    cart = cart.filter(item => item.id != maSP);
    luuVaCapNhatGio();
}
// luu gio hang vao localStorage va cap nhat lai giao dien
function luuVaCapNhatGio() {
    localStorage.setItem('plantlab_cart', JSON.stringify(cart));
    capNhatSoBadge();
    hienThiGioHang();
}
// cap nhat so hien thi tren icon gio hang
function capNhatSoBadge() {
    let badge = document.getElementById('cartBadge');
    if (!badge) return;
    let tongSL = 0;
    cart.forEach(item => {
        tongSL += item.quantity;
    });
    badge.textContent = tongSL;
}
// hien thi danh sach san pham trong sidebar gio hang
function hienThiGioHang() {
    let container = document.getElementById('cartItemsContainer');
    let headerCount = document.getElementById('cartCountHeader');
    let subtotalEl = document.getElementById('cartSubtotal');
    if (!container) return;
    // tinh tong so luong
    let tongSL = 0;
    cart.forEach(item => {
        tongSL += item.quantity;
    });
    if (headerCount) headerCount.textContent = tongSL;
    // neu gio trong thi bao nguoi dung
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <i class="fa-solid fa-basket-shopping"></i>
                <p>Giỏ hàng của bạn đang trống.</p>
            </div>
        `;
        if (subtotalEl) subtotalEl.textContent = "0đ";
        return;
    }
    // tao html cho tung san pham trong gio
    let html = '';
    let tongTien = 0;
    cart.forEach(item => {
        let thanhTien = item.price * item.quantity;
        tongTien += thanhTien;
        html += `
            <div class="cart-item">
                <img src="${suaAnh(item.img)}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">${item.price.toLocaleString('vi-VN')}đ</p>
                    <div class="cart-item-qty">
                        <button class="cart-qty-btn minus" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="cart-qty-btn plus" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="cart-remove-btn" data-id="${item.id}" title="Xóa">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            </div>
        `;
    });
    container.innerHTML = html;
    if (subtotalEl) subtotalEl.textContent = tongTien.toLocaleString('vi-VN') + "đ";
}
// khoi tao chuc nang tim kiem tren header va trang san pham
function khoiTaoTimKiem() {
    let searchBtn = document.getElementById('searchIconBtn');
    let searchInput = document.getElementById('headerSearchInput');
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            searchInput.classList.toggle('open');
            if (searchInput.classList.contains('open')) {
                searchInput.focus();
                searchInput.style.width = "180px";
                searchInput.style.opacity = "1";
            } else {
                searchInput.style.width = "0";
                searchInput.style.opacity = "0";
                searchInput.value = "";
                locSanPham("");
            }
        });
        searchInput.addEventListener('keyup', () => {
            locSanPham(searchInput.value);
        });
    }
    // tim kiem o trang san pham
    let mainSearch = document.getElementById('mainProductSearch');
    if (mainSearch) {
        mainSearch.addEventListener('input', (e) => {
            locSanPham(e.target.value);
        });
    }
}
// loc san pham theo tu khoa nguoi dung nhap
function locSanPham(keyword) {
    let value = keyword.toLowerCase().trim();
    let cards = document.querySelectorAll(".all-products .product-card, .featured-container .product-card");
    cards.forEach(card => {
        let name = card.getAttribute("data-name") || "";
        let title = card.querySelector("h3") ? card.querySelector("h3").innerText : "";

        if (name.toLowerCase().includes(value) || title.toLowerCase().includes(value)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}
function khoiTaoYeuThich() {
    let btn = document.getElementById('wishlistIconBtn');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        let icon = btn.querySelector('i');
        if (icon.classList.contains('fa-regular')) {
            icon.classList.remove('fa-regular');
            icon.classList.add('fa-solid');
            hienToast("Đã thêm vào danh sách yêu thích!");
        } else {
            icon.classList.remove('fa-solid');
            icon.classList.add('fa-regular');
            hienToast("Đã xóa khỏi danh sách yêu thích.");
        }
    });
}
// danh dau link trang dang xem tren navbar
function danhDauNavbar() {
    let currentPage = window.location.pathname;
    let navLinks = document.querySelectorAll(".navbar a");

    navLinks.forEach(link => {
        let href = link.getAttribute("href");
        if (href && currentPage.includes(href.split('/').pop())) {
            link.classList.add("active");
        }
    });
}
// hieu ung card xuat hien khi nguoi dung scroll den
function scrollAnimation() {
    let cards = document.querySelectorAll(".collection-card, .product-card, .why-card, .review-card, .mission-card, .stats-card");
    if ('IntersectionObserver' in window) {
        let observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: "0px 0px -50px 0px" });

        cards.forEach(card => observer.observe(card));
    } else {
        // neu trinh duyet cu khong ho tro thi hien tat ca luon
        cards.forEach(card => card.classList.add("show"));
    }
}
// xu ly mo/dong sidebar gio hang va cac su kien ben trong
function khoiTaoSidebar() {
    let cartBtn = document.getElementById('cartIconBtn');
    let closeBtn = document.getElementById('closeCartBtn');
    let sidebar = document.getElementById('cartSidebar');
    let overlay = document.getElementById('cartOverlayBg');
    let container = document.getElementById('cartItemsContainer');
    if (!cartBtn || !sidebar) return;
    // click icon gio hang de mo sidebar
    cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        sidebar.classList.add('open');
        overlay.classList.add('open');
    });
    // ham dong sidebar dung chung cho nhieu nut
    const dongSidebar = () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('open');
    };
    if (closeBtn) closeBtn.addEventListener('click', dongSidebar);
    overlay.addEventListener('click', dongSidebar);
    // xu ly nut +/- va xoa trong gio hang
    if (container) {
        container.addEventListener('click', (e) => {
            let qtyBtn = e.target.closest('.cart-qty-btn');
            let removeBtn = e.target.closest('.cart-remove-btn');
            if (qtyBtn) {
                let id = qtyBtn.getAttribute('data-id');
                let delta = qtyBtn.classList.contains('plus') ? 1 : -1;
                changeQuantityInCart(id, delta);
            }
            if (removeBtn) {
                let id = removeBtn.getAttribute('data-id');
                xoaKhoiGio(id);
            }
        });
    }
    // xu ly nut thanh toan
    let checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                hienToast("Giỏ hàng đang trống!", "error");
                return;
            }
            hienToast("Cảm ơn bạn đã mua hàng tại PlantLab! 🌿");
            cart = [];
            luuVaCapNhatGio();
            dongSidebar();
        });
    }
}
// xu ly gui form lien he
function xuLyFormLienHe() {
    let form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let name = document.getElementById('contactName').value.trim();
        let email = document.getElementById('contactEmail').value.trim();
        let message = document.getElementById('contactMessage').value.trim();
        if (!name || !email || !message) {
            hienToast("Vui lòng điền đầy đủ thông tin!", "error");
            return;
        }
        hienToast("Cảm ơn bạn! Tin nhắn đã được gửi thành công.");
        form.reset();
    });
}
// hien hop thong bao nho o goc man hinh
function hienToast(message, type = "success") {
    let container = document.getElementById('toastContainer');
    if (!container) return;
    let toast = document.createElement('div');
    toast.className = 'toast-message';
    let icon = type === "error" ? "fa-circle-xmark" : "fa-circle-check";
    toast.innerHTML = `
        <i class="fa-solid ${icon}"></i>
        <span>${message}</span>
    `;
    container.appendChild(toast);
    // tu dong an sau 3 giay
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.5s ease forwards';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}
window.showToast = hienToast;
// lay id san pham tu url va hien thi thong tin len trang chi tiet
function hienChiTietSP() {
    let params = new URLSearchParams(window.location.search);
    let productId = params.get("product") || "1";
    let product = laySpTheoId(productId);
    if (!product) return;
    // cap nhat cac phan tu HTML tren trang
    let elements = {
        title: document.getElementById("detail-title"),
        price: document.getElementById("detail-price"),
        desc: document.getElementById("detail-description"),
        breadcrumb: document.getElementById("breadcrumb-title"),
        image: document.getElementById("detail-image")
    };
    if (elements.title) elements.title.textContent = product.title;
    if (elements.price) elements.price.textContent = product.price.toLocaleString('vi-VN') + "đ";
    if (elements.desc) elements.desc.textContent = product.description;
    if (elements.breadcrumb) elements.breadcrumb.textContent = product.title;
    if (elements.image) {
        elements.image.src = suaAnh(product.image);
        elements.image.alt = product.title;
    }
    document.title = product.title + " | PlantLab";
    // xu ly nut tang giam so luong
    let qtyInput = document.getElementById('quantity');
    let btnMinus = document.getElementById('minus');
    let btnPlus = document.getElementById('plus');
    if (btnMinus && btnPlus && qtyInput) {
        btnPlus.addEventListener('click', () => {
            qtyInput.value = Math.max(1, parseInt(qtyInput.value || 1) + 1);
        });
        btnMinus.addEventListener('click', () => {
            qtyInput.value = Math.max(1, parseInt(qtyInput.value || 1) - 1);
        });
        // kiem tra lai gia tri khi click ra ngoai o so luong
        qtyInput.addEventListener('blur', () => {
            qtyInput.value = Math.max(1, parseInt(qtyInput.value || 1));
        });
    }
    // nut them vao gio tren trang chi tiet
    let btnAddToCart = document.getElementById('btnAddToCart');
    if (btnAddToCart) {
        btnAddToCart.addEventListener('click', () => {
            let qty = parseInt(qtyInput.value || 1);
            addToCart(productId, qty);
            if (qtyInput) qtyInput.value = 1;
        });
    }
}
// xu ly nut them vao gio nhanh tren danh sach san pham
function themNhanhVaoGio() {
    document.addEventListener('click', (e) => {
        let btn = e.target.closest('.add-to-cart-btn');
        if (!btn) return;
        e.preventDefault();
        let productId = btn.dataset.id;
        if (productId) {
            addToCart(productId, 1);
        }
    });
}
// ve lai danh sach san pham phia nguoi dung
function renderPublicProducts() {
    let grid = document.getElementById('productGrid');
    if (!grid) return;
    let html = '';
    productData.forEach(prod => {
        html += `
            <div class="product-card" data-name="${prod.title.toLowerCase()}">
                <div class="product-image">
                    <img src="${suaAnh(prod.image)}" alt="${prod.title}">
                </div>
                <div class="product-content">
                    <h3>${prod.title}</h3>
                    <p class="product-price">${prod.price.toLocaleString('vi-VN')}đ</p>
                    <div class="product-actions">
                        <a href="chi-tiet.html?product=${prod.id}" class="product-btn">Xem chi tiết</a>
                        <button class="add-to-cart-btn" data-id="${prod.id}" aria-label="Thêm vào giỏ hàng">
                            <i class="fa-solid fa-basket-shopping"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    grid.innerHTML = html;
    scrollAnimation();
}
// bang san pham trong trang quan tri admin
function renderAdminTable() {
    let tbody = document.getElementById('adminProductTableBody');
    if (!tbody) return;
    let html = '';
    productData.forEach(prod => {
        html += `
            <tr>
                <td><strong>#${prod.id}</strong></td>
                <td><img src="${suaAnh(prod.image)}" alt="${prod.title}" class="admin-thumb"></td>
                <td><span class="admin-title">${prod.title}</span></td>
                <td><span class="admin-price">${prod.price.toLocaleString('vi-VN')}đ</span></td>
                <td>
                    <button class="action-btn btn-edit" onclick="editProduct('${prod.id}')">
                        <i class="fa-solid fa-pencil"></i> Sửa
                    </button>
                    <button class="action-btn btn-delete" onclick="deleteProduct('${prod.id}')">
                        <i class="fa-solid fa-trash"></i> Xóa
                    </button>
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}
// xoa san pham khoi danh sach
function deleteProduct(id) {
    if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm #${id}?`)) {
        productData = productData.filter(p => p.id != id);
        localStorage.setItem('plantlab_products', JSON.stringify(productData));
        renderAdminTable();
        hienToast("Đã xóa sản phẩm!");
    }
}
// dien thong tin san pham vao form de chuan bi sua
function editProduct(id) {
    let product = productData.find(p => p.id == id);
    if (!product) return;
    document.getElementById('editProductId').value = product.id;
    document.getElementById('prodTitle').value = product.title;
    document.getElementById('prodPrice').value = product.price;
    document.getElementById('prodImage').value = product.image;
    document.getElementById('prodDesc').value = product.description;
    document.getElementById('formTitle').textContent = `Chỉnh Sửa Sản Phẩm (#${id})`;
    document.getElementById('btnCancelEdit').style.display = "block";
    document.getElementById('prodTitle').focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
// xoa trang form 
function resetAdminForm() {
    document.getElementById('editProductId').value = "";
    document.getElementById('prodTitle').value = "";
    document.getElementById('prodPrice').value = "";
    document.getElementById('prodImage').value = "";
    document.getElementById('prodDesc').value = "";
    document.getElementById('formTitle').textContent = "Thêm Sản Phẩm Mới";
    document.getElementById('btnCancelEdit').style.display = "none";
}
// luu san pham moi hoac cap nhat san pham dang sua
function saveProduct() {
    let id = document.getElementById('editProductId').value;
    let title = document.getElementById('prodTitle').value.trim();
    let price = parseInt(document.getElementById('prodPrice').value);
    let image = document.getElementById('prodImage').value.trim();
    let description = document.getElementById('prodDesc').value.trim();
    if (!title || !price || !image || !description) {
        hienToast("Vui lòng điền đầy đủ thông tin!", "error");
        return;
    }
    if (price <= 0) {
        hienToast("Giá phải lớn hơn 0!", "error");
        return;
    }
    if (id) {
        // cap nhat san pham cu
        let index = productData.findIndex(p => p.id == id);
        if (index !== -1) {
            productData[index] = { id: parseInt(id), title, price, image, description };
            hienToast("Cập nhật sản phẩm thành công!");
        }
    } else {
        // them san pham moi voi id tu tang
        let newId = productData.length > 0 ? Math.max(...productData.map(p => p.id)) + 1 : 1;
        productData.push({ id: newId, title, price, image, description });
        hienToast("Thêm sản phẩm mới thành công!");
    }
    localStorage.setItem('plantlab_products', JSON.stringify(productData));
    renderAdminTable();
    resetAdminForm();
}
// tim kiem san pham trong bang admin theo ten
function searchAdminProduct() {
    let keyword = document.getElementById('searchProduct').value.toLowerCase().trim();
    let rows = document.querySelectorAll('#adminProductTableBody tr');
    rows.forEach(row => {
        let name = row.querySelector('.admin-title');
        if (!name) return;
        if (name.textContent.toLowerCase().includes(keyword)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}
// xuat cac ham dung trong onclick o HTML
window.searchAdminProduct = searchAdminProduct;
window.deleteProduct = deleteProduct;
window.editProduct = editProduct;
window.saveProduct = saveProduct;
window.resetAdminForm = resetAdminForm;
window.renderPublicProducts = renderPublicProducts;
window.addToCart = addToCart;
window.changeQuantityInCart = changeQuantityInCart;
window.removeFromCart = xoaKhoiGio;
window.filterProducts = locSanPham;
// chay tat ca ham khoi tao khi trang load xong
document.addEventListener('DOMContentLoaded', () => {
    luuVaCapNhatGio();
    khoiTaoTimKiem();
    danhDauNavbar();
    scrollAnimation();
    khoiTaoSidebar();
    hienChiTietSP();
    xuLyFormLienHe();
    themNhanhVaoGio();
    // neu la trang admin thi ve bang san pham
    if (document.getElementById('adminProductTableBody')) {
        renderAdminTable();
    }
});
