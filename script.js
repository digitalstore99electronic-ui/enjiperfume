// --- Тохиргоо ---
let cart = [];
const botToken = "8578358695:AAGDHEjmw1EDhkdH60HWfys498gmuGM-Njo"; // Чиний өгсөн Token
const chatId = "7069407872"; // Чиний өгсөн Bot ID (Chat ID)

// --- Custom Alert Функц (Гоё мэдэгдэл гаргах) ---
function showAlert(message) {
    const alertModal = document.getElementById('custom-alert');
    const alertMessage = document.getElementById('alert-message');
    if (alertModal && alertMessage) {
        alertMessage.innerText = message;
        alertModal.classList.add('active');
    } else {
        // Хэрэв HTML дээр Custom Alert байхгүй бол энгийн alert гаргана
        alert(message);
    }
}

function closeAlert() {
    const alertModal = document.getElementById('custom-alert');
    if (alertModal) alertModal.classList.remove('active');
}

// --- Сагсны үйлдлүүд ---
function addToCart(name, price, img) {
    cart.push({ name, price, img });
    updateCart();
    showAlert("Сагсанд нэмэгдлээ! ✨");
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function updateCart() {
    const cartList = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const totalAmount = document.getElementById('total-amount');
    
    if (!cartList) return;

    cartList.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        cartList.innerHTML += `
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px; background: #f9f9f9; padding: 12px; border-radius: 15px;">
                <div style="display: flex; align-items: center;">
                    <img src="${item.img}" style="width: 45px; height: 45px; border-radius: 10px; object-fit: cover; margin-right: 12px;">
                    <div>
                        <h4 style="font-size: 11px; font-weight: 600; margin: 0;">${item.name}</h4>
                        <p style="font-size: 11px; font-weight: 800; color: #d4af37; margin: 2px 0 0 0;">${item.price.toLocaleString()}₮</p>
                    </div>
                </div>
                <button onclick="removeFromCart(${index})" style="background: #fff; border: 1px solid #eee; color: #ff3b30; padding: 5px 10px; border-radius: 8px; font-size: 10px; cursor: pointer;">Устгах</button>
            </div>
        `;
    });

    if (cartCount) cartCount.innerText = cart.length;
    if (totalAmount) totalAmount.innerText = total.toLocaleString() + "₮";
}

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar) sidebar.classList.toggle('active');
}

// --- Бусад функцууд ---
function copyAcc() {
    const accNumber = "5458026272";
    navigator.clipboard.writeText(accNumber).then(() => {
        showAlert("Дансны дугаар хуулагдлаа! ✅");
    });
}

// --- Telegram руу захиалга илгээх ---
async function sendOrder() {
    const phone = document.getElementById('phone-number').value;
    const address = document.getElementById('address').value || "Хаяг бичээгүй";

    if (!phone) {
        showAlert("Утасны дугаараа оруулна уу! 📞");
        return;
    }
    if (cart.length === 0) {
        showAlert("Сагс хоосон байна! 🛒");
        return;
    }

    const orderBtn = document.getElementById('send-order-btn');
    const originalText = orderBtn.innerText;
    orderBtn.innerText = "Илгээж байна...";
    orderBtn.disabled = true;

    // Захиалгын текстийг бэлдэх
    let itemsText = cart.map((item, index) => `${index + 1}. ${item.name} - ${item.price.toLocaleString()}₮`).join('\n');
    let total = cart.reduce((sum, item) => sum + item.price, 0);
    
    const message = `
🛍 **ШИНЭ ЗАХИАЛГА!**

📞 **Утас:** ${phone}
📍 **Хаяг:** ${address}

📦 **Бараанууд:**
${itemsText}

💰 **Нийт дүн:** ${total.toLocaleString()}₮
    `;

    try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: "Markdown"
            })
        });

        if (response.ok) {
            showAlert("Захиалга амжилттай илгээгдлээ! Тантай удахгүй холбогдоно. ✨");
            cart = []; // Сагсыг цэвэрлэх
            updateCart();
            toggleCart(); // Сагсыг хаах
            document.getElementById('phone-number').value = "";
            document.getElementById('address').value = "";
        } else {
            throw new Error('Telegram API error');
        }
    } catch (error) {
        console.error(error);
        showAlert("Алдаа гарлаа. Та дахин оролдоно уу эсвэл шууд холбогдоно уу. ⚠️");
    } finally {
        orderBtn.innerText = originalText;
        orderBtn.disabled = false;
    }
}

