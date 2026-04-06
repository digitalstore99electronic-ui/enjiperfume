// --- Custom Alert Ажиллуулах Логик ---
function showAlert(message) {
    const alertModal = document.getElementById('custom-alert');
    const alertMessage = document.getElementById('alert-message');
    alertMessage.innerText = message;
    alertModal.classList.remove('hidden');
}

function closeAlert() {
    const alertModal = document.getElementById('custom-alert');
    alertModal.classList.add('hidden');
}

// --- Өмнөх alert() функцүүдийгshowAlert() болгож өөрчлөх ---

// 1. Сагсанд нэмэх
function addToCart(name, price, img) {
    cart.push({ name, price, img });
    updateCart();
    // Хуучин код: alert("Сагсанд нэмэгдлээ! ✨");
    showAlert("Сагсанд нэмэгдлээ! ✨");
}

// 2. Данс хуулах
function copyAcc() {
    navigator.clipboard.writeText("5458026272");
    // Хуучин код: alert("Данс хуулагдлаа!");
    showAlert("Данс хуулагдлаа! ✅");
}

// 3. Захиалга илгээх
async function sendOrder() {
    const phone = document.getElementById('phone-number').value;
    const address = document.getElementById('address').value;

    if (!phone || cart.length === 0) {
        showAlert("Утас эсвэл сагс хоосон байна! ❌");
        return;
    }

    const orderBtn = document.getElementById('send-order-btn');
    const originalText = orderBtn.innerText;
    orderBtn.innerText = "Илгээж байна...";
    orderBtn.disabled = true;

    // ... Telegram руу илгээх текст ...

    try {
        const response = await fetch(`https://api.telegram.org/bot.../sendMessage`, { ... });

        if (response.ok) {
            // Хуучин код: alert("Захиалга амжилттай илгээгдлээ! ✨");
            showAlert("Захиалга амжилттай илгээгдлээ! Тантай удахгүй холбогдоно. ✨");
            cart = []; updateCart(); toggleCart();
            document.getElementById('phone-number').value = "";
            document.getElementById('address').value = "";
        } else {
            throw new Error('Telegram error');
        }
    } catch (e) {
        // Хуучин код: alert("Алдаа гарлаа. Та дахин оролдоно уу.");
        showAlert("Алдаа гарлаа. Та дахин оролдоно уу эсвэл шууд холбогдоно уу. ⚠️");
    } finally {
        orderBtn.innerText = originalText;
        orderBtn.disabled = false;
    }
}
