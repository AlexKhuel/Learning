const amountPaid = {};

function addPerson(){
    const name = document.getElementById("nameInput").value.trim();
    const amountText = document.getElementById("amountInput").value.trim();

    if(!name){
        alert("Please enter a name")
        return;
    }

    let cleanInput = amountText.replace(/[^0-9.]/g, '').trim();
    let value = parseFloat(cleanInput);

    if(isNaN(value)){
        alert("That is not a valid input. Please enter a number");
    }

    amountPaid[name] = value;

    const entriesList = document.getElementById("entries");
    const entryItem = document.createElement("li");
    entryItem.innerText = `${name} paid $${value.toFixed(2)}`;
    entriesList.appendChild(entryItem);

    document.getElementById("nameInput").value = "";
    document.getElementById("amountInput").value = "";
}

function finishInput(){
    const people = Object.keys(amountPaid);

    if(people.length < 2){
        alert("Enter at least 2 people to settle up")
        return;
    }

    const resultsList = document.getElementById("results");
    resultsList.innerHTML = "";

    const results = splitExpenses(amountPaid);
    results.forEach(res =>{
        const item = document.createElement("li");
        item.innerText = res;
        resultsList.appendChild(item);
    })
}

function splitExpenses(amountPaid){
    const people = Object.keys(amountPaid);
    const amounts = Object.values(amountPaid);

    let differentAmounts = amounts.filter(amount => amount !== amounts[0]);
    if(differentAmounts.length === 0){
        return ["Everyone is already settled up"];
    }

    const total = amounts.reduce((a, b) => a + b, 0);
    const avg = total / people.length;

    const balances = {}
    people.forEach(p => balances[p] = amountPaid[p] - avg)

    let result = [];

    let debtors = people.filter(p => balances[p] < 0);
    let creditors = people.filter(p => balances[p] > 0);

    while(debtors.length && creditors.length){
        let debtor = debtors[0];
        let creditor = creditors[0];

        let amount = Math.min(-balances[debtor], balances[creditor]);
        result.push(`${debtor} owes ${creditor} $${amount.toFixed(2)}`);
        
        balances[debtor] += amount;
        balances[creditor] -= amount;

        if(balances[debtor] === 0) debtors.shift();
        if(balances[creditor] === 0) creditors.shift();

    }
    return result;
}
