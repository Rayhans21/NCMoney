// Reference to Firestore
let db;
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize Firebase Firestore
  db = firebase.firestore();

  const form = document.getElementById('transaction-form');
  const transactionsList = document.getElementById('transactions-list');

  // Add transaction to Firestore
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const wallet = document.getElementById('wallet').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;
    const note = document.getElementById('note').value;

    // Save to Firestore
    await db.collection('transactions').add({
      wallet,
      amount,
      type,
      note,
      date: new Date().toISOString(),
    });

    form.reset();
    loadTransactions();
  });

  // Load transactions
  async function loadTransactions() {
    transactionsList.innerHTML = ''; // Clear list
    const snapshot = await db.collection('transactions').get();
    snapshot.forEach((doc) => {
      const { wallet, amount, type, note, date } = doc.data();
      const listItem = document.createElement('li');
      listItem.textContent = `${wallet} - ${type} - Rp${amount} - ${note} (${new Date(date).toLocaleDateString()})`;
      transactionsList.appendChild(listItem);
    });
  }

  loadTransactions();
});
