(function () {
  const cartInfo = document.getElementById("cart-info");
  const cart = document.getElementById("cart");
  cartInfo.addEventListener("click", function () {
    cart.classList.toggle("show-cart");
  });
})();

if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}

function ready() {
  var addToCartButtons = document.getElementsByClassName("ADD_TO_CART");
  for (var i = 0; i < addToCartButtons.length; i++) {
    var button = addToCartButtons[i];
    button.addEventListener("click", addToCartClicked);
  }

  var quantityInputs = document.getElementsByClassName("cart-quantity-input");
  for (var i = 0; i < quantityInputs.length; i++) {
    var input = quantityInputs[i];
    input.addEventListener("change", quantityChanged);
  }

  /*remove items first part*/
  var removeCartItemButtons = document.getElementsByClassName("btn-danger");
  for (var i = 0; i < removeCartItemButtons.length; i++) {
    var button = removeCartItemButtons[i];
    button.addEventListener("click", removeCartItem);
  }
  /*end*/

  document
    .getElementsByClassName("btn-purchase")[0]
    .addEventListener("click", purchaseClicked);
}

function purchaseClicked() {
  alert("Thank you for your purchase");
  var cartItems = document.getElementsByClassName("cart-items")[0];
  while (cartItems.hasChildNodes()) {
    cartItems.removeChild(cartItems.firstChild);
  }
  updateCartTotal();
  updateItemsTotal();
}

/*remove items second part*/
function removeCartItem(event) {
  var buttonClicked = event.target;
  buttonClicked.parentElement.parentElement.remove();
  updateCartTotal();
  updateItemsTotal();
}
/*end*/

function quantityChanged(event) {
  var input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  updateCartTotal();
  updateItemsTotal();
}

function addToCartClicked(event) {
  var button = event.target;
  var product = button.parentElement.parentElement;
  var title = product.getElementsByClassName("product-title").innerText;
  var price = product.getElementsByClassName("product__price")[0].innerText;
  var imageSrc = product.getElementsByClassName("product__image")[0].src;
  addItemToCart(title, price, imageSrc);

  updateCartTotal();
  /*missing*/
  updateItemsTotal();
}

function addItemToCart(title, price, imageSrc) {
  var cartRow = document.createElement("div");
  cartRow.classList.add("cart-row");
  var cartItems = document.getElementsByClassName("cart-items")[0];
  var cartItemTitles = cartItems.getElementsByClassName("cart-item-title");
  for (var i = 0; i < cartItemTitles.length; i++) {
    if (cartItemTitles[i].innerText == title) {
      alert("This item is already added to the cart");
      return;
    }
  }
  var cartRowContents = `
    <div class="cart-item cart-column">
                <img class="cart-item-image" src="${imageSrc}">
                <span class="cart-item-title">${title}</span>
              </div>
              <span class="cart-price cart-column">${price}</span>
              <div class="cart-quantity cart-column">
                <input class="cart-quantity-input" type="number" value="1">
                <button class="btn btn-danger" type="button">REMOVE</button>
              </div>`;
  cartRow.innerHTML = cartRowContents;
  cartItems.append(cartRow);
  cartRow
    .getElementsByClassName("btn-danger")[0]
    .addEventListener("click", removeCartItem);
  cartRow
    .getElementsByClassName("cart-quantity-input")[0]
    .addEventListener("change", quantityChanged);
}

function updateCartTotal() {
  var cartItemContainer = document.getElementsByClassName("cart-items")[0];
  var cartRows = cartItemContainer.getElementsByClassName("cart-row");
  var total = 0;
  var totalProductQuantity = 0;
  var discountPercentage = 0;
  var postageFee = 10;
  var totalAfterDiscount = 0;

  for (var i = 0; i < cartRows.length; i++) {
    var cartRow = cartRows[i];
    var priceElement = cartRow.getElementsByClassName("cart-price")[0];
    var quantityElement = cartRow.getElementsByClassName(
      "cart-quantity-input"
    )[0];
    var price = parseFloat(priceElement.innerText.replace("RM", ""));
    var quantity = quantityElement.value;
    totalProductQuantity += Number(quantity);
    total = total + price * quantity;
  }

  if (totalProductQuantity >= 5 && totalProductQuantity <= 10) {
    discountPercentage = 5;
  } else if (totalProductQuantity > 10) {
    discountPercentage = 15;
  } else {
    discountPercentage = 0;
  }
  if (total > 100) {
    postageFee = 0;
  }
  totalAfterDiscount =
    Math.round(total - (discountPercentage / 100) * total) + postageFee;
  document.getElementsByClassName("cart-total-price")[0].innerText =
    "RM" + total;
  document.getElementsByClassName("cart-total-discount-rate")[0].innerText =
    discountPercentage + "%";
  document.getElementsByClassName("cart-total-postage-price")[0].innerText =
    "RM" + postageFee;
  document.getElementsByClassName("cart-total-price-discount")[0].innerText =
    "RM" + totalAfterDiscount;
}

function updateItemsTotal() {
  var cartItemContainer = document.getElementsByClassName("cart-items")[0];
  var cartRows = cartItemContainer.getElementsByClassName("cart-row");
  var total = 0;
  for (let i = 0; i < cartRows.length; i++) {
    var cartRow = cartRows[i];
    var quantityElement = cartRow.getElementsByClassName(
      "cart-quantity-input"
    )[0];
    var quantity = quantityElement.value;
    var total = total + parseInt(quantity);
  }
  document.getElementById("item-count").innerText = total;
}
