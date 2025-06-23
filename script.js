





document.addEventListener("DOMContentLoaded", function () {
    // Зірки
    const stars = document.querySelectorAll('.stars .star');
    stars.forEach(star => {
        star.addEventListener('click', function () {
            const value = this.getAttribute('data-value');
            stars.forEach(s => {
                if (s.getAttribute('data-value') <= value) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
    });

    // Валідація форми
    const form = document.getElementById('feedbackForm');
    const notRobotCheckbox = document.getElementById('notRobot');
    const robotError = document.getElementById('robotError');

    if (form) {
        form.addEventListener('submit', function (event) {
            if (!notRobotCheckbox.checked) {
                event.preventDefault(); // Зупиняємо відправку форми
                robotError.style.display = 'block'; // Показуємо повідомлення про помилку
            } else {
                robotError.style.display = 'none'; // Ховаємо повідомлення про помилку
            }
        });
    }

    // Кнопка прокрутки
    const scrollTopBtn = document.getElementById("scrollTopBtn");
    if (scrollTopBtn) {
        window.addEventListener("scroll", function () {
            if (window.scrollY > 100) {
                scrollTopBtn.style.display = "flex";
            } else {
                scrollTopBtn.style.display = "none";
            }
        });

        scrollTopBtn.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
});



// cкрипти для кошика
let cart = []; // Масив для збереження товарів

// Завантаження кошика з LocalStorage при завантаженні сторінки
window.onload = function() {
  loadCartFromLocalStorage();
};

// Оновлення кількості товарів на значку кошика
function updateCartCount() {
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  $('#cart-count').text(cartCount);
}

// Оновлення контенту в модальному вікні
function updateCartModal() {
  const cartContainer = document.getElementById('cartItemsContainer');
  const totalPriceElement = document.getElementById('totalPrice');
  cartContainer.innerHTML = '';

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p class="text-center" id="emptyCartMessage">Кошик порожній</p>';
    totalPriceElement.innerText = '0';
    return;
  }

  let total = 0;
  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    cartContainer.innerHTML += `
      <div class="d-flex align-items-center justify-content-between border-bottom py-2">
        <img src="${item.image}" alt="${item.name}" class="img-fluid" style="width: 50px; height: 50px;">
        <div class="flex-grow-1 mx-2">
          <p class="mb-1">${item.name}</p>
          <p class="fw-bold">${item.price * item.quantity}₴</p>
        </div>
        <div class="d-flex align-items-center">
          <button class="btn btn-outline-secondary btn-sm" onclick="updateQuantity(${index}, -1)">-</button>
          <span class="mx-2">${item.quantity}</span>
          <button class="btn btn-outline-secondary btn-sm" onclick="updateQuantity(${index}, 1)">+</button>
        </div>
      </div>
    `;
  });

  totalPriceElement.innerText = total;
}

// Оновлення кількості товару
function updateQuantity(index, change) {
  cart[index].quantity += change;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  updateCartCount();
  updateCartModal();
  saveCartToLocalStorage();
}

// Додавання товару
document.querySelectorAll('.addbasket').forEach(button => {
  button.addEventListener('click', function () {
    const productContainer = this.closest('.textprod');
    const productName = productContainer.querySelector('h4').innerText;
    const productPrice = parseInt(productContainer.querySelector('.text-danger').innerText.replace('₴', ''));
    const productImage = productContainer.previousElementSibling.querySelector('img').src;

    const existingProduct = cart.find(item => item.name === productName);
    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.push({ name: productName, price: productPrice, quantity: 1, image: productImage });
    }

    updateCartCount();
    updateCartModal();
    saveCartToLocalStorage();
  });
});

// Відкриття модалки кошика
document.querySelector('.bi-cart').addEventListener('click', () => {
  updateCartModal();
  new bootstrap.Modal(document.getElementById('cartModal')).show();
});

// Збереження кошика
function saveCartToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Завантаження кошика
function loadCartFromLocalStorage() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
  updateCartCount();
  updateCartModal();
}

// Повідомлення про успішне додавання
function showSuccessMessage() {
  var successMessage = document.getElementById("successMessage");
  successMessage.style.display = "block";
  setTimeout(function () {
    successMessage.style.display = "none";
  }, 3000);
}

// Показ/приховування полів доставки
document.getElementById('deliveryChoice').addEventListener('change', function () {
  if (this.value === 'novaPoshta') {
    document.getElementById('novaPoshtaFields').style.display = 'block';
    document.getElementById('ukrPostFields').style.display = 'none';
  } else if (this.value === 'ukrPost') {
    document.getElementById('novaPoshtaFields').style.display = 'none';
    document.getElementById('ukrPostFields').style.display = 'block';
  } else {
    document.getElementById('novaPoshtaFields').style.display = 'none';
    document.getElementById('ukrPostFields').style.display = 'none';
  }
});

// ✅ Функція очищення кошика
function clearCart() {
  cart = [];
  saveCartToLocalStorage();
  updateCartCount();
  updateCartModal();
}

// ✅ ЄДИНИЙ правильний обробник підтвердження замовлення
document.getElementById('confirmOrderButton').addEventListener('click', function () {
  const paymentChoice = document.querySelector('input[name="paymentChoice"]:checked');
  if (!paymentChoice) return;

  if (paymentChoice.value === 'payNow') {
    const paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));
    paymentModal.show();
    clearCart();
  } else if (paymentChoice.value === 'payUponReceiving') {
    const paymentUponReceivingModal = new bootstrap.Modal(document.getElementById('paymentUponReceivingModal'));
    paymentUponReceivingModal.show();
    clearCart();
  }
});

// Кнопки переходу на головну
document.getElementById('goToHomePageButton').addEventListener('click', function () {
  window.location.href = 'index.html';
});

document.getElementById('goToHomePageUponReceivingButton').addEventListener('click', function () {
  window.location.href = 'index.html';
});
