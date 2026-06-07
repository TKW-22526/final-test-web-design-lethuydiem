// 1. DỮ LIỆU SẢN PHẨM - SỬ DỤNG ARRAY 
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
// 2. KHỞI TẠO DỮ LIỆU 
// Tải dữ liệu sản phẩm từ localStorage (nếu có sửa đổi), nếu không thì dùng mặc định
let productData = JSON.parse(localStorage.getItem('plantlab_products')) || defaultProducts;
// Tải giỏ hàng từ localStorage
let cart = JSON.parse(localStorage.getItem('plantlab_cart')) || [];
// Lưu sản phẩm vào localStorage lần đầu
if (!localStorage.getItem('plantlab_products')) {
    localStorage.setItem('plantlab_products', JSON.stringify(defaultProducts));
}
// 3. TIỆN ÍCH 
// Sửa đường dẫn ảnh theo vị trí trang
function fixImagePath(imgPath) {
    if (!imgPath) return '';
    if (window.location.pathname.includes('/html/')) {
        return '../' + imgPath;
    }
    return imgPath;
}
// Tìm sản phẩm theo ID
function getProductById(id) {
    return productData.find(p => p.id == id);
}
//  4. QUẢN LÝ GIỎ HÀNG 
// Thêm sản phẩm vào giỏ
function addToCart(productId, quantityToAdd = 1) {
    const product = getProductById(productId);
    if (!product) return;
    const existingItem = cart.find(item => item.id == productId);
    if (existingItem) {
        existingItem.quantity += quantityToAdd;
    } else {
        cart.push({
            id: product.id,
            name: product.title,
            price: product.price,
            img: product.image,
            quantity: quantityToAdd
        });
    }
    updateCartSystem();
    showToast(`Đã thêm ${quantityToAdd} x ${product.title} vào giỏ hàng!`);
}
// Thay đổi số lượng sản phẩm trong giỏ
function changeQuantityInCart(productId, delta) {
    const item = cart.find(item => item.id == productId);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartSystem();
    }
}
// Xóa sản phẩm khỏi giỏ
function removeFromCart(productId) {
    cart = cart.filter(item => item.id != productId);
    updateCartSystem();
}
// Lưu giỏ hàng và cập nhật giao diện
function updateCartSystem() {
    localStorage.setItem('plantlab_cart', JSON.stringify(cart));
    renderCartBadge();
    renderCartSidebar();
}
// 5. HIỂN THỊ GIỎ HÀNG 
// Cập nhật số lượng trên icon giỏ
function renderCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (!badge) return;
    let total = 0;
    cart.forEach(item => {
        total += item.quantity;
    });
    badge.textContent = total;
}
// Hiển thị chi tiết giỏ hàng
function renderCartSidebar() {
    const container = document.getElementById('cartItemsContainer');
    const headerCount = document.getElementById('cartCountHeader');
    const subtotalEl = document.getElementById('cartSubtotal');
    if (!container) return;
    // Tính tổng số lượng
    let totalItems = 0;
    cart.forEach(item => {
        totalItems += item.quantity;
    });
    if (headerCount) headerCount.textContent = totalItems;
    // Giỏ trống
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
    // Hiển thị sản phẩm
    let html = '';
    let subtotal = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        html += `
            <div class="cart-item">
                <img src="${fixImagePath(item.img)}" alt="${item.name}">
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
    if (subtotalEl) subtotalEl.textContent = subtotal.toLocaleString('vi-VN') + "đ";
}
// 6. TÌM KIẾM & FILTER 
function initSearchFeatures() {
    // Search header
    const searchBtn = document.getElementById('searchIconBtn');
    const searchInput = document.getElementById('headerSearchInput');
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
                filterProducts("");
            }
        });
        searchInput.addEventListener('keyup', () => {
            filterProducts(searchInput.value);
        });
    }
    // Search trang sản phẩm
    const mainSearch = document.getElementById('mainProductSearch');
    if (mainSearch) {
        mainSearch.addEventListener('input', (e) => {
            filterProducts(e.target.value);
        });
    }
}
// Lọc sản phẩm
function filterProducts(keyword) {
    const value = keyword.toLowerCase().trim();
    const cards = document.querySelectorAll(".all-products .product-card, .featured-container .product-card");
    cards.forEach(card => {
        const name = card.getAttribute("data-name") || "";
        const title = card.querySelector("h3") ? card.querySelector("h3").innerText : "";
        if (name.toLowerCase().includes(value) || title.toLowerCase().includes(value)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}
// 7. YÊU THÍCH & MENU 

function initWishlistFeature() {
    const btn = document.getElementById('wishlistIconBtn');
    if (!btn) return;
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const icon = btn.querySelector('i');
        
        if (icon.classList.contains('fa-regular')) {
            icon.classList.remove('fa-regular');
            icon.classList.add('fa-solid');
            showToast("Đã thêm vào danh sách yêu thích!");
        } else {
            icon.classList.remove('fa-solid');
            icon.classList.add('fa-regular');
            showToast("Đã xóa khỏi danh sách yêu thích.");
        }
    });
}
function initActiveNavbar() {
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll(".navbar a");
    navLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (href && currentPage.includes(href.split('/').pop())) {
            link.classList.add("active");
        }
    });
}
// 8. HIỆU ỨNG SCROLL 

function initScrollAnimation() {
    const cards = document.querySelectorAll(".collection-card, .product-card, .why-card, .review-card, .mission-card, .stats-card");
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: "0px 0px -50px 0px" });
        cards.forEach(card => observer.observe(card));
    } else {
        cards.forEach(card => card.classList.add("show"));
    }
}
// 9. SỰ KIỆN GIỎ HÀNG 
function initSidebarEvents() {
    const cartBtn = document.getElementById('cartIconBtn');
    const closeBtn = document.getElementById('closeCartBtn');
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlayBg');
    const container = document.getElementById('cartItemsContainer');
    if (!cartBtn || !sidebar) return;
    // Mở giỏ
    cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        sidebar.classList.add('open');
        overlay.classList.add('open');
    });
    // Đóng giỏ
    const closeCart = () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('open');
    };
    if (closeBtn) closeBtn.addEventListener('click', closeCart);
    overlay.addEventListener('click', closeCart);
    // Sự kiện trong giỏ
    if (container) {
        container.addEventListener('click', (e) => {
            const qtyBtn = e.target.closest('.cart-qty-btn');
            const removeBtn = e.target.closest('.cart-remove-btn');
            if (qtyBtn) {
                const id = qtyBtn.getAttribute('data-id');
                const delta = qtyBtn.classList.contains('plus') ? 1 : -1;
                changeQuantityInCart(id, delta);
            }
            if (removeBtn) {
                const id = removeBtn.getAttribute('data-id');
                removeFromCart(id);
            }
        });
    }
    const checkoutBtn = document.querySelector('.checkout-btn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showToast("Giỏ hàng đang trống!", "error");
            return;
        }
        showToast("Cảm ơn bạn đã mua hàng tại PlantLab! 🌿");
        // Xóa giỏ hàng sau khi thanh toán
        cart = [];
        updateCartSystem();
        // Đóng giỏ hàng
        sidebar.classList.remove('open');
        overlay.classList.remove('open');
    });
}
}
// 10. FORM LIÊN HỆ 
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const message = document.getElementById('contactMessage').value.trim();
        if (!name || !email || !message) {
            showToast("Vui lòng điền đầy đủ thông tin!", "error");
            return;
        }
        showToast("Cảm ơn bạn! Tin nhắn đã được gửi thành công.");
        form.reset();
    });
}
// 11. THÔNG BÁO TOAST 
function showToast(message, type = "success") {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    const icon = type === "error" ? "fa-circle-xmark" : "fa-circle-check";
    toast.innerHTML = `
        <i class="fa-solid ${icon}"></i>
        <span>${message}</span>
    `;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.5s ease forwards';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}
window.showToast = showToast;
//  12. TRANG CHI TIẾT SẢN PHẨM 
function initPageControls() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("product") || "1";
    const product = getProductById(productId);
    if (!product) return;
    // Cập nhật thông tin
    const elements = {
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
        elements.image.src = fixImagePath(product.image);
        elements.image.alt = product.title;
    }
    document.title = product.title + " | PlantLab";
    // Điều khiển số lượng
    const qtyInput = document.getElementById('quantity');
    const btnMinus = document.getElementById('minus');
    const btnPlus = document.getElementById('plus');

    if (btnMinus && btnPlus && qtyInput) {
        btnPlus.addEventListener('click', () => {
            qtyInput.value = Math.max(1, parseInt(qtyInput.value || 1) + 1);
        });

        btnMinus.addEventListener('click', () => {
            qtyInput.value = Math.max(1, parseInt(qtyInput.value || 1) - 1);
        });

        qtyInput.addEventListener('blur', () => {
            qtyInput.value = Math.max(1, parseInt(qtyInput.value || 1));
        });
    }

    const pageWishlistBtn = document.getElementById('pageWishlistBtn');
    if (pageWishlistBtn) {
        pageWishlistBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const icon = pageWishlistBtn.querySelector('i');
            
            if (icon.classList.contains('fa-regular')) {
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
                showToast("Đã thích sản phẩm này!");
            } else {
                icon.classList.remove('fa-solid');
                icon.classList.add('fa-regular');
                showToast("Đã bỏ thích sản phẩm.");
            }
        });
    }
    // Nút mua
    const btnAddToCart = document.getElementById('btnAddToCart');
    if (btnAddToCart) {
        btnAddToCart.addEventListener('click', () => {
            const qty = parseInt(qtyInput.value || 1);
            addToCart(productId, qty);
            if (qtyInput) qtyInput.value = 1;
        });
    }
}
// 13. THÊM SẢN PHẨM NHANH TỪ DANH SÁCH
function initQuickAddToCart() {

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.add-to-cart-btn');
        if (!btn) return;
        e.preventDefault();
        const productId = btn.dataset.id;
        if (productId) {
            addToCart(productId, 1);
        }
    });
}
// 14. HỆ THỐNG QUẢN TRỊ 
// Hiển thị sản phẩm công khai (được gọi khi admin sửa)
function renderPublicProducts() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    let html = '';
    productData.forEach(prod => {
        html += `
            <div class="product-card" data-name="${prod.title.toLowerCase()}">
                <div class="product-image">
                    <img src="${fixImagePath(prod.image)}" alt="${prod.title}">
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
    initScrollAnimation();
}
// Hiển thị bảng admin
function renderAdminTable() {
    const tbody = document.getElementById('adminProductTableBody');
    if (!tbody) return;
    let html = '';
    productData.forEach(prod => {
        html += `
            <tr>
                <td><strong>#${prod.id}</strong></td>
                <td><img src="${fixImagePath(prod.image)}" alt="${prod.title}" class="admin-thumb"></td>
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
// Xóa sản phẩm
function deleteProduct(id) {
    if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm #${id}?`)) {
        productData = productData.filter(p => p.id != id);
        localStorage.setItem('plantlab_products', JSON.stringify(productData));
        renderAdminTable();
        showToast("Đã xóa sản phẩm!");
    }
}
// Chuẩn bị chỉnh sửa
function editProduct(id) {
    const product = productData.find(p => p.id == id);
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
// Reset form
function resetAdminForm() {
    document.getElementById('editProductId').value = "";
    document.getElementById('prodTitle').value = "";
    document.getElementById('prodPrice').value = "";
    document.getElementById('prodImage').value = "";
    document.getElementById('prodDesc').value = "";
    document.getElementById('formTitle').textContent = "Thêm Sản Phẩm Mới";
    document.getElementById('btnCancelEdit').style.display = "none";
}
// Lưu sản phẩm
function saveProduct() {
    const id = document.getElementById('editProductId').value;
    const title = document.getElementById('prodTitle').value.trim();
    const price = parseInt(document.getElementById('prodPrice').value);
    const image = document.getElementById('prodImage').value.trim();
    const description = document.getElementById('prodDesc').value.trim();
    // Kiểm tra
    if (!title || !price || !image || !description) {
        showToast("Vui lòng điền đầy đủ thông tin!", "error");
        return;
    }
    if (price <= 0) {
        showToast("Giá phải lớn hơn 0!", "error");
        return;
    }
    if (id) {
        // Cập nhật
        const index = productData.findIndex(p => p.id == id);
        if (index !== -1) {
            productData[index] = { id: parseInt(id), title, price, image, description };
            showToast("Cập nhật sản phẩm thành công!");
        }
    } else {
        // Thêm mới
        const newId = productData.length > 0 ? Math.max(...productData.map(p => p.id)) + 1 : 1;
        productData.push({ id: newId, title, price, image, description });
        showToast("Thêm sản phẩm mới thành công!");
    }
    localStorage.setItem('plantlab_products', JSON.stringify(productData));
    renderAdminTable();
    resetAdminForm();
}
//Tìm kiếm sản phẩm trong bảng admin
function searchAdminProduct() {
    const keyword = document.getElementById('searchProduct').value.toLowerCase().trim();
    const rows = document.querySelectorAll('#adminProductTableBody tr');
    rows.forEach(row => {
        const name = row.querySelector('.admin-title');
        if (!name) return;
        if (name.textContent.toLowerCase().includes(keyword)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}
window.searchAdminProduct = searchAdminProduct;
// Xuất hàm
window.deleteProduct = deleteProduct;
window.editProduct = editProduct;
window.saveProduct = saveProduct;
window.resetAdminForm = resetAdminForm;
window.renderPublicProducts = renderPublicProducts;
window.addToCart = addToCart;
window.changeQuantityInCart = changeQuantityInCart;
window.removeFromCart = removeFromCart;
window.filterProducts = filterProducts;
// 15. KHỞI CHẠY
document.addEventListener('DOMContentLoaded', () => {
    updateCartSystem();
    initSearchFeatures();
    initWishlistFeature();
    initActiveNavbar();
    initScrollAnimation();
    initSidebarEvents();
    initPageControls();
    initContactForm();
    initQuickAddToCart();
    // Nếu là trang admin
    if (document.getElementById('adminProductTableBody')) {
        renderAdminTable();
    }
});