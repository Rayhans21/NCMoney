// Import Firebase functions from firebase-config.js
import { db } from './firebase-config'; // Assuming you export db from firebase-config.js
import { doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';

// Function to render wallets from Firestore
async function renderWallets() {
  const walletContainer = document.getElementById('wallet-container');
  const totalBalanceDisplay = document.getElementById('total-balance');

  // Fetch wallets from Firestore
  const walletsSnapshot = await getDocs(collection(db, 'wallets'));
  const wallets = walletsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  walletContainer.innerHTML = '';
  let totalBalance = 0;

  // Display each wallet
  wallets.forEach((wallet) => {
    const walletDiv = document.createElement('div');
    walletDiv.textContent = `${wallet.name}: Rp${wallet.balance.toLocaleString('id-ID')}`;
    walletDiv.className = 'wallet';
    walletDiv.addEventListener('click', () => showTransactions(wallet.id));
    walletContainer.appendChild(walletDiv);

    totalBalance += wallet.balance;
  });

  totalBalanceDisplay.textContent = `Total Balance: Rp${totalBalance.toLocaleString('id-ID')}`;
}

// Function to add a transaction to a wallet in Firestore
async function addTransaction(walletId, transaction) {
  const walletRef = doc(db, 'wallets', walletId);

  // Get the current wallet document from Firestore
  const walletSnapshot = await getDoc(walletRef);
  if (walletSnapshot.exists()) {
    const wallet = walletSnapshot.data();
    wallet.transactions.push(transaction);

    // Update wallet balance based on the transaction
    wallet.balance += transaction.type === 'income' ? transaction.amount : -transaction.amount;

    // Save the updated wallet to Firestore
    await updateDoc(walletRef, wallet);
    console.log('Transaction added to Firestore');
  } else {
    console.error('Wallet not found');
  }
}

// Function to delete a transaction from a wallet in Firestore
async function deleteTransaction(walletId, transactionIndex) {
  const walletRef = doc(db, 'wallets', walletId);

  // Get the current wallet document from Firestore
  const walletSnapshot = await getDoc(walletRef);
  if (walletSnapshot.exists()) {
    const wallet = walletSnapshot.data();
    const transaction = wallet.transactions[transactionIndex];

    // Adjust the balance by removing the transaction
    wallet.balance += transaction.type === 'income' ? -transaction.amount : transaction.amount;
    wallet.transactions.splice(transactionIndex, 1);

    // Save the updated wallet to Firestore
    await updateDoc(walletRef, wallet);
    console.log('Transaction deleted from Firestore');
    renderWallets();
    showTransactions(walletId);
  } else {
    console.error('Wallet not found');
  }
}

// Function to show transactions of a wallet
async function showTransactions(walletId) {
  const transactionList = document.getElementById('transaction-list');

  const walletRef = doc(db, 'wallets', walletId);
  const walletSnapshot = await getDoc(walletRef);
  const wallet = walletSnapshot.data();
  transactionList.innerHTML = '';

  wallet.transactions.forEach((transaction, transactionIndex) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${transaction.date} - ${transaction.type}: Rp${transaction.amount.toLocaleString('id-ID')} (${transaction.description})</span>
      <button onclick="editTransaction(${walletId}, ${transactionIndex})">Edit</button>
      <button onclick="deleteTransaction(${walletId}, ${transactionIndex})">Delete</button>
    `;
    transactionList.appendChild(li);
  });

  // Add Transaction button
  const addButton = document.createElement('button');
  addButton.textContent = 'Add Transaction';
  addButton.id = 'add-transaction-btn';
  addButton.addEventListener('click', () => {
    openTransactionForm(walletId);
  });
  transactionList.appendChild(addButton);

  // Transfer Between Wallets button
  const transferButton = document.createElement('button');
  transferButton.textContent = 'Transfer Between Wallets';
  transferButton.id = 'transfer-btn';
  transferButton.addEventListener('click', () => {
    openTransferForm(walletId);
  });
  transactionList.appendChild(transferButton);
}

// Function to open the transaction form
function openTransactionForm(walletId, transactionIndex = null) {
  const url = new URL('transaction_form.html', window.location.origin);
  url.searchParams.append('walletId', walletId);
  if (transactionIndex !== null) {
    url.searchParams.append('transactionIndex', transactionIndex);
  }
  window.location.href = url; // Navigate to the transaction form page
}

// Function to open the transfer form
function openTransferForm(walletId) {
  const url = new URL('transfer_form.html', window.location.origin);
  url.searchParams.append('walletId', walletId);
  window.location.href = url; // Navigate to the transfer form page
}

// Call renderWallets to load the wallets on page load
renderWallets();
