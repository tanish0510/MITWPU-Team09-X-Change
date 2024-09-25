document.getElementById('addItem').addEventListener('click', function() {
    const quantity = document.querySelector('input[type="number"]').value;
    const selectedItem = document.querySelector('select').value;

    const resultDiv = document.getElementById('result');
    if (quantity > 0) {
        resultDiv.innerHTML += `<p>Added ${quantity} of ${selectedItem} to your basket.</p>`;
    } else {
        resultDiv.innerHTML += `<p>Please enter a valid quantity.</p>`;
    }
});
