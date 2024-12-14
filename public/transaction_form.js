document.getElementById('transaction-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const urlParams = new URLSearchParams(window.location.search);
  const walletIndex = parseInt(urlParams.get('walletIndex'), 10);
  const transactionIndex = urlParams.has('transactionIndex') ? parseInt(urlParams.get('transactionIndex'), 10) : null;

  const wallets = JSON.parse(localStorage.getItem('wallets')) || [];
  if (!wallets[walletIndex]) {
    alert('Wallet not found. Please try again.');
    window.location.href = 'index.html'; // Kembali ke halaman utama jika wallet tidak ditemukan
    return;
  }

  const wallet = wallets[walletIndex];
  const date = document.getElementById('date').value;
  const type = document.getElementById('type').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const description = document.getElementById('description').value;

  // Validasi data input
  if (!date || isNaN(amount) || amount <= 0) {
    alert('Please fill in all required fields with valid data.');
    return;
  }

  // Tambahkan atau perbarui transaksi
  if (transactionIndex !== null) {
    const oldTransaction = wallet.transactions[transactionIndex];
    wallet.balance -= oldTransaction.type === 'income' ? oldTransaction.amount : -oldTransaction.amount;
    wallet.transactions[transactionIndex] = { date, type, amount, description };
  } else {
    wallet.transactions.push({ date, type, amount, description });
  }

  // Perbarui saldo wallet
  wallet.balance += type === 'income' ? amount : -amount;

  // Simpan kembali data ke localStorage
  localStorage.setItem('wallets', JSON.stringify(wallets));
  window.location.href = 'index.html';
});
