// script.js
const wallets = [
  { name: 'Cash', balance: 100000, transactions: [] },
  { name: 'BRI', balance: 200000, transactions: [] },
  { name: 'BCA', balance: 200000, transactions: [] },
  { name: 'Mandiri', balance: 200000, transactions: [] },
  { name: 'SeaBank', balance: 200000, transactions: [] },
  { name: 'Gopay', balance: 200000, transactions: [] },
  { name: 'Dana', balance: 200000, transactions: [] },
];

const walletContainer = document.getElementById('wallet-container');
const transactionList = document.getElementById('transaction-list');
const totalBalanceDisplay = document.getElementById('total-balance');

// Display wallets and their balances
function renderWallets() {
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

// Show transactions for a specific wallet
function showTransactions(walletIndex) {
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

  const addButton = document.createElement('button');
  addButton.textContent = 'Add Transaction';
  addButton.addEventListener('click', () => {
    openTransactionForm(walletIndex);
  });
  transactionList.appendChild(addButton);

  const transferButton = document.createElement('button');
  transferButton.textContent = 'Transfer Between Wallets';
  transferButton.addEventListener('click', () => {
    openTransferForm(walletIndex);
  });
  transactionList.appendChild(transferButton);
}

// Open transaction form in a new page or modal
function openTransactionForm(walletIndex, transactionIndex = null) {
  const url = new URL('transaction_form.html', window.location.origin);
  url.searchParams.append('walletIndex', walletIndex);
  if (transactionIndex !== null) {
    url.searchParams.append('transactionIndex', transactionIndex);
  }
  window.location.href = url;
}

// Open transfer form in a new page or modal
function openTransferForm(walletIndex) {
  const url = new URL('transfer_form.html', window.location.origin);
  url.searchParams.append('walletIndex', walletIndex);
  window.location.href = url;
}

// Edit a transaction
function editTransaction(walletIndex, transactionIndex) {
  openTransactionForm(walletIndex, transactionIndex);
}

// Delete a transaction
function deleteTransaction(walletIndex, transactionIndex) {
  if (confirm('Are you sure you want to delete this transaction?')) {
    wallets[walletIndex].transactions.splice(transactionIndex, 1);
    renderWallets();
    showTransactions(walletIndex);
  }
}

// Process transfer between wallets
function processTransfer(fromWalletIndex, toWalletIndex, amount) {
  if (fromWalletIndex === toWalletIndex) {
    alert('Cannot transfer to the same wallet.');
    return;
  }

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

  renderWallets();
  showTransactions(fromWalletIndex);
}

// Initial render
renderWallets();
