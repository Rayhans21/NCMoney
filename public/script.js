const wallets = JSON.parse(localStorage.getItem('wallets')) || [
  { name: 'Cash', balance: 100000, transactions: [] },
  { name: 'BCA', balance: 200000, transactions: [] },
  { name: 'Mandiri', balance: 200000, transactions: [] },
  { name: 'SeaBank', balance: 200000, transactions: [] },
  { name: 'Gopay', balance: 200000, transactions: [] },
  { name: 'Dana', balance: 200000, transactions: [] },
];

function renderWallets() {
  const walletContainer = document.getElementById('wallet-container');
  const totalBalanceDisplay = document.getElementById('total-balance');

  walletContainer.innerHTML = '';
  wallets.forEach((wallet, index) => {
    const walletDiv = document.createElement('div');
    walletDiv.textContent = `${wallet.name}: Rp${wallet.balance.toLocaleString('id-ID')}`;
    walletDiv.className = 'wallet';
    walletDiv.addEventListener('click', () => showTransactions(index));
    walletContainer.appendChild(walletDiv);
  });

  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
  totalBalanceDisplay.textContent = `Total Balance: Rp${totalBalance.toLocaleString('id-ID')}`;
}

function saveWallets() {
  localStorage.setItem('wallets', JSON.stringify(wallets));
}

function deleteTransaction(walletIndex, transactionIndex) {
  if (confirm('Are you sure you want to delete this transaction?')) {
    const transaction = wallets[walletIndex].transactions[transactionIndex];
    wallets[walletIndex].balance += transaction.type === 'income' ? -transaction.amount : transaction.amount;
    wallets[walletIndex].transactions.splice(transactionIndex, 1);
    saveWallets();
    renderWallets();
    showTransactions(walletIndex);
  }
}

function showTransactions(walletIndex) {
  console.log(`Showing transactions for wallet index: ${walletIndex}`);
  const transactionList = document.getElementById('transaction-list');
  const selectedWallet = wallets[walletIndex];
  transactionList.innerHTML = '';

  selectedWallet.transactions.forEach((transaction, transactionIndex) => {
    const li = document.createElement('li');
    li.innerHTML = `
          <span>${transaction.date} - ${transaction.type}: Rp${transaction.amount.toLocaleString('id-ID')} (${transaction.description})</span>
          <button onclick="editTransaction(${walletIndex}, ${transactionIndex})">Edit</button>
          <button onclick="deleteTransaction(${walletIndex}, ${transactionIndex})">Delete</button>
      `;
    transactionList.appendChild(li);
  });

  // Tombol Tambah Transaksi
  const addButton = document.createElement('button');
  addButton.textContent = 'Add Transaction';
  addButton.id = 'add-transaction-btn';
  addButton.addEventListener('click', () => {
    openTransactionForm(walletIndex);
  });
  transactionList.appendChild(addButton);

  // Tombol Transfer Antar Dompet
  const transferButton = document.createElement('button');
  transferButton.textContent = 'Transfer Between Wallets';
  transferButton.id = 'transfer-btn';
  transferButton.addEventListener('click', () => {
    openTransferForm(walletIndex);
  });
  transactionList.appendChild(transferButton);
}
// Fungsi untuk membuka form transaksi
function openTransactionForm(walletIndex, transactionIndex = null) {
  const url = new URL('transaction_form.html', window.location.origin);
  url.searchParams.append('walletIndex', walletIndex);
  if (transactionIndex !== null) {
    url.searchParams.append('transactionIndex', transactionIndex);
  }
  window.location.href = url; // Mengarahkan pengguna ke halaman form transaksi
}

// Fungsi untuk membuka form transfer antar wallet
function openTransferForm(walletIndex) {
  const url = new URL('transfer_form.html', window.location.origin);
  url.searchParams.append('walletIndex', walletIndex);
  window.location.href = url; // Mengarahkan pengguna ke halaman form transfer
}

renderWallets();
