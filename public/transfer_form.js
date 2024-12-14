document.getElementById('transfer-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const urlParams = new URLSearchParams(window.location.search);
  const fromWalletIndex = parseInt(urlParams.get('walletIndex'), 10);
  const toWalletIndex = parseInt(document.getElementById('toWallet').value, 10);
  const amount = parseFloat(document.getElementById('amount').value);

  const wallets = JSON.parse(localStorage.getItem('wallets')) || [];
  const fromWallet = wallets[fromWalletIndex];
  const toWallet = wallets[toWalletIndex];

  if (fromWallet.balance < amount) {
    alert('Insufficient balance in the source wallet.');
    return;
  }

  fromWallet.balance -= amount;
  toWallet.balance += amount;

  const date = new Date().toISOString().split('T')[0];

  fromWallet.transactions.push({
    date,
    type: 'Expense',
    amount,
    description: `Transfer to ${toWallet.name}`,
  });

  toWallet.transactions.push({
    date,
    type: 'Income',
    amount,
    description: `Transfer from ${fromWallet.name}`,
  });

  localStorage.setItem('wallets', JSON.stringify(wallets));
  window.location.href = 'index.html';
});

function cancelTransfer() {
  window.location.href = 'index.html';
}

const urlParams = new URLSearchParams(window.location.search);
const fromWalletIndex = parseInt(urlParams.get('walletIndex'), 10);
const wallets = JSON.parse(localStorage.getItem('wallets')) || [];

wallets.forEach((wallet, index) => {
  if (index !== fromWalletIndex) {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = wallet.name;
    document.getElementById('toWallet').appendChild(option);
  }
});
