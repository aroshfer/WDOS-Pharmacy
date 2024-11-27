var grandTotal = 0;

function addToCart(productName, productPrice, qtyInputId, isQty = false) {
    var qty = document.getElementById(qtyInputId).value;

    if (qty && qty > 0) {
        var table = document.getElementById('aryatable');
        var rows = table.rows;
        var itemUpdated = false;

        // Check if the item already exists in the table
        for (var i = 1; i < rows.length; i++) {
            var row = rows[i];
            var currentProductName = row.cells[0].innerText;

            if (currentProductName === productName) {
                // Update the existing row
                var currentQtyText = row.cells[1].innerText;
                var currentQty = parseFloat(currentQtyText.split(' ')[0]); // Extract numeric part
                var newQty = currentQty + qty;

                row.cells[1].innerText = newQty + (isQty ? "" : " Qty");
                var newTotalPrice = newQty * productPrice;
                row.cells[2].innerText = "Rs. " + newTotalPrice.toFixed(2);

                grandTotal += productPrice * qty;
                itemUpdated = true;
                break;
            }
        }
        if (!itemUpdated) {
            var row = table.insertRow(rows.length);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);

            cell1.innerHTML = productName;
            cell2.innerHTML = qty + (isQty ? "" : " Qty");
            cell3.innerHTML = "Rs. " + (productPrice * qty).toFixed(2);

            grandTotal += productPrice * qty;
        }

        updateTotal();
    } else {
        alert("Please enter a valid quantity.");
    }
}


function updateTotal() {
    var table = document.getElementById('aryatable');
    var totalRow = document.getElementById('totalRow');

    if (totalRow) {
        table.deleteRow(totalRow.rowIndex);
    }

    totalRow = table.insertRow(-1);
    totalRow.id = 'totalRow';
    var cell1 = totalRow.insertCell(0);
    var cell2 = totalRow.insertCell(1);
    var cell3 = totalRow.insertCell(2);

    cell1.innerHTML = "<strong>Total</strong>";
    cell2.innerHTML = "";
    cell3.innerHTML = "<strong>Rs. " + grandTotal.toFixed(2) + "</strong>";
}

function addToFavourite() {
    var aryatable = document.getElementById('aryatable');
    var favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    
    for (var i = 1; i < aryatable.rows.length - 1; i++) { 
        var row = aryatable.rows[i];
        var product = {
            name: row.cells[0].innerText,
            quantity: row.cells[1].innerText,
            price: row.cells[2].innerText
        };

        if (!favourites.some(fav => fav.name === product.name && fav.quantity === product.quantity)) {
            favourites.push(product);
        }
    }
    
    localStorage.setItem('favourites', JSON.stringify(favourites));
    alert("Items added to favourites!");
}

function applyToFavourite() {
    var aryatable = document.getElementById('aryatable');
    var favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    
    // Clear the table and reset the grand total
    aryatable.innerHTML = "<tr><th>Name</th><th>Qty</th><th>Price</th></tr>";
    grandTotal = 0;

    // Populate the table with favorite items
    favourites.forEach(function(product) {
        var row = aryatable.insertRow(-1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);

        cell1.innerHTML = product.name;
        cell2.innerHTML = product.quantity;
        cell3.innerHTML = product.price;

        // Update the grand total
        var priceText = product.price.replace("Rs. ", "");
        grandTotal += parseFloat(priceText);
    });

    // Update the total row
    updateTotal();

    // Clear favorites from localStorage (optional)
    localStorage.removeItem('favourites');
    alert("Favourites applied to cart!");
}


function buyNow() {
    var aryatable = document.getElementById('aryatable');
    var items = [];
    
    for (var i = 1; i < aryatable.rows.length - 1; i++) { // Exclude the total row
        var row = aryatable.rows[i];
        var item = {
            name: row.cells[0].innerText,
            quantity: row.cells[1].innerText,
            price: row.cells[2].innerText
        };
        items.push(item);
    }

    if (items.length === 0) {
        alert("Your cart is empty. Please add items to buy.");
        return;
    }

    localStorage.setItem('cart', JSON.stringify(items));
    alert("Proceeding to checkout!");
    window.location.href = 'buy.html';
}

function displayCart() {
    var table = document.getElementById('aryatable');
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    table.innerHTML = "<tr><th>Name</th><th>Qty</th><th>Price</th></tr>";

    grandTotal = 0; // Reset total
    cart.forEach(function(product) {
        var row = table.insertRow(-1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);

        cell1.innerHTML = product.name;
        cell2.innerHTML = product.quantity;
        cell3.innerHTML = product.price;

        var priceText = product.price.replace("Rs. ", "");
        grandTotal += parseFloat(priceText);
    });

    updateTotal();
}

document.getElementById('checkout-form').addEventListener('submit', function(event) {
    event.preventDefault();

    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 3);
    var deliveryDate = currentDate.toDateString();

    alert("Thank You! \nYour order has been placed successfully.\nYour expected delivery date is: " + deliveryDate);

    event.target.reset();
});

displayCart();
