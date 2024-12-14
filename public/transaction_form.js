document.getElementById('transaction-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const urlParams = new URLSearchParams(window.location.search);
  const walletIndex = parseInt(urlParams.get('walletIndex'), 10);
  const transactionIndex = urlParams.has('transactionIndex') ? parseInt(urlParams.get('transactionIndex'), 10) : null;

  const date = document.getElementById('date').value;
  const type = document.getElementById('type').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const description = document.getElementById('description').value;

  const wallets = JSON.parse(localStorage.getItem('wallets')) || [];
  const wallet = wallets[walletIndex];

  if (transactionIndex !== null) {
    const oldTransaction = wallet.transactions[transactionIndex];
    wallet.balance -= oldTransaction.type === 'income' ? oldTransaction.amount : -oldTransaction.amount;
    wallet.transactions[transactionIndex] = { date, type, amount, description };
  } else {
    wallet.transactions.push({ date, type, amount, description });
  }

  wallet.balance += type === 'income' ? amount : -amount;
  localStorage.setItem('wallets', JSON.stringify(wallets));
  window.location.href = 'index.html';
});

function cancelTransaction() {
  window.location.href = 'index.html';
}
