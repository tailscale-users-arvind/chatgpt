const addTransactionForm = document.getElementById('addTransaction');
const transactionList   = document.getElementById('transactionList');
const balanceDiv        = document.getElementById('balance');
const typeSelect        = document.getElementById('type');
const expenseDetails    = document.getElementById('expenseDetails');
const recurringCheckbox = document.getElementById('recurring');
const recurringDetails  = document.getElementById('recurringDetails');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function updateUI() {
  transactionList.innerHTML = '';
  let balance = 0;

  transactions.forEach((t, index) => {
    balance += t.type === 'expense' ? -t.amount : t.amount;

    const details = [];
    if (t.type === 'expense' && t.category) details.push(t.category);
    if (t.recurring) details.push(`${t.frequency} from ${t.startDate}`);
    const detailText = details.length ? ` (${details.join(', ')})` : '';

    const li = document.createElement('li');
    li.classList.add(t.type);
    li.innerHTML = `
      <span>${t.desc}${detailText}</span>
      <span>${t.type === 'expense' ? '-' : '+'}$${t.amount.toFixed(2)}
        <button class="delete" data-index="${index}">x</button>
      </span>
    `;
    transactionList.appendChild(li);
  });

  balanceDiv.textContent = `$${balance.toFixed(2)}`;
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Show or hide expense-specific fields
function handleTypeChange() {
  if (typeSelect.value === 'expense') {
    expenseDetails.classList.remove('hidden');
  } else {
    expenseDetails.classList.add('hidden');
  }
}

typeSelect.addEventListener('change', handleTypeChange);

// Show or hide recurring details
recurringCheckbox.addEventListener('change', () => {
  if (recurringCheckbox.checked) {
    recurringDetails.classList.remove('hidden');
  } else {
    recurringDetails.classList.add('hidden');
  }
});

addTransactionForm.addEventListener('submit', e => {
  e.preventDefault();
  const desc   = document.getElementById('desc').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);
  const type   = typeSelect.value;
  if (!desc || isNaN(amount)) return;

  const transaction = { desc, amount, type };

  if (type === 'expense') {
    transaction.category = document.getElementById('category').value.trim();
    if (recurringCheckbox.checked) {
      transaction.recurring = true;
      transaction.startDate = document.getElementById('startDate').value;
      transaction.frequency = document.getElementById('frequency').value;
    }
  }

  transactions.push(transaction);
  addTransactionForm.reset();
  recurringDetails.classList.add('hidden');
  typeSelect.dispatchEvent(new Event('change'));
  updateUI();
});

transactionList.addEventListener('click', e => {
  if (e.target.classList.contains('delete')) {
    transactions.splice(e.target.dataset.index, 1);
    updateUI();
  }
});

// Initial render
handleTypeChange();
updateUI();
