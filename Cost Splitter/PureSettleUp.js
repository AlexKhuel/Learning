import { createInterface } from "readline";

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});

const amountPaid = {};

let nameCount = 0;
function askPayment(){

    nameCount === 0 ? nameText = "Enter the name of the first person then press enter: " : nameText = "Enter the name of another person (or press enter to settle up): ";
    rl.question(nameText, (name) => {
        if(!name && nameCount >= 2){
            rl.close();
            console.log(splitExpenses(amountPaid));
            return;
        }
        else if(!name){
            console.log("You need to enter at least two names. Please try again");
            askPayment();
        }
        rl.question(`Enter amount paid by ${name}: `, (amount) => {
            let cleanInput = amount.replace(/[^0-9.]/g, '').trim();
            let value = parseFloat(cleanInput);
            if(isNaN(value)){
                console.log("That is not a valid input. Please enter a number");
                askPayment();
            }
            else{
                amountPaid[name] = value;
                nameCount++;
                askPayment();
            }
        });
    });
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
console.log(`
This app helps you split expenses. Enter the names of everyone in your group who paid and how much each person paid, and it will show who owes money and who should be paid so the cost is shared fairly.
    `);
askPayment();
