const fs = require("fs");
const axios = require("axios"); 
const { Readable } = require('stream');



module.exports = {
  config: {
    name: "bank",
    description: "Deposit or withdraw money from the bank and earn interest",
    guide: {
      vi: "",
      en: "Bank:\nInterest - Balance - Withdraw - Deposit - Transfer - Richest - Loan - Payloan - Lottery - Gamble - HighRiskInvest[hrinvest] - Heist"
    },
    category: "Money",
    countDown: 0,
    role: 0,
    author: "Loufi | JARiF | Abdul kaiyum"
  },
  onStart: async function ({ args, message, event,api, usersData }) {
    const { getPrefix } = global.utils;
    const p = getPrefix(event.threadID);

    const userMoney = await usersData.get(event.senderID, "money");
    const user = parseInt(event.senderID);
    const info = await api.getUserInfo(user);
      const username = info[user].name;
    const bankData = JSON.parse(fs.readFileSync("./bank.json", "utf8"));

    if (!bankData[user]) {
      bankData[user] = { bank: 0, lastInterestClaimed: Date.now() };
      fs.writeFileSync("./bank.json", JSON.stringify(bankData));
    }

    const command = args[0]?.toLowerCase();
    const amount = parseInt(args[1]);
    const recipientUID = parseInt(args[2]);

    switch (command) {
      case "deposit":
  const depositPassword = args[1];
  const depositAmount = parseInt(args[2]);

  if (!depositPassword || !depositAmount) {
    return message.reply("[🏦 Fa Hi Ma-Bank 🏦]\n\n✧Please provide both a password and a valid amount for deposit.🔑\n\nIf you don't set your password then set by -bank setpassword (password)\n\nExample: -bank deposit (your_password) (your_amount)");
  }

  if (bankData[user].password !== depositPassword) {
    return message.reply("[🏦 Fa Hi Ma-Bank 🏦]\n\n✧Incorrect password. Please try again.🔑");
  }

  if (isNaN(depositAmount) || depositAmount <= 0) {
    return message.reply("[🏦 Fa Hi Ma-Bank 🏦]\n\n✧Please enter a valid deposit amount.💸");
  }

  if (userMoney < depositAmount) {
    return message.reply("[🏦 Fa Hi Ma-Bank 🏦]\n\n✧You don't have the required amount✖️");
  }

  bankData[user].bank += depositAmount;
  await usersData.set(event.senderID, {
    money: userMoney - depositAmount
  });
  fs.writeFileSync("./bank.json", JSON.stringify(bankData));

  return message.reply(`[🏦 Fa Hi Ma-Bank 🏦]\n\n✧Successfully deposited ${depositAmount}$ into your bank account.`);


      case "withdraw":
  const withdrawPassword = args[1]; 
  const withdrawAmount = parseInt(args[2]); 

  if (!withdrawPassword || !withdrawAmount) {
    return message.reply("[🏦 Fa Hi Ma-Bank 🏦]\n\n✧Please provide both a password and a valid amount for withdrawal.🔑\n\nIf you don't set your password then set by -bank setpassword (password)\n\nExample: -bank withdraw (your_password) (your_amount)");
  }

  if (bankData[user].password !== withdrawPassword) {
    return message.reply("[🏦 Fa Hi Ma-Bank 🏦]\n\n✧Incorrect password. Please try again.🔑");
  }

  const balance = bankData[user].bank || 0;

  if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
    return message.reply("[🏦 Fa Hi Ma-Bank 🏦]\n\n✧Please enter a valid withdrawal amount.💸");
  }

  if (withdrawAmount > balance) {
    return message.reply("[🏦 Fa Hi Ma-Bank 🏦]\n\n✧The requested amount is greater than the available balance in your bank account.👽");
  }

  bankData[user].bank = balance - withdrawAmount;
  await usersData.set(event.senderID, {
    money: userMoney + withdrawAmount
  });
  fs.writeFileSync("./bank.json", JSON.stringify(bankData));

  return message.reply(`[🏦 Fa Hi Ma-Bank 🏦]\n\n✧Successfully withdrew ${withdrawAmount}$ from your bank account.`);

        case "hrinvest":
  const investmentAmount = parseInt(args[1]);

  if (isNaN(investmentAmount) || investmentAmount <= 0) {
    return message.reply("[🏦 Fa Hi Ma-Bank 🏦]\n\n✧Please enter a valid investment amount.💸");
  }

  const riskOutcome = Math.random() < 0.7; 
  const potentialReturns = investmentAmount * (riskOutcome ? 2 : 0.2); 

  if (riskOutcome) {
    bankData[user].bank -= investmentAmount;
    fs.writeFileSync("./bank.json", JSON.stringify(bankData));
    return message.reply(`[🏦 Fa Hi Ma-Bank 🏦]\n\n✧Your high-risk investment of ${investmentAmount}$ was risky, and you lost your money. 😔`);
  } else {
    bankData[user].bank += potentialReturns;
    fs.writeFileSync("./bank.json", JSON.stringify(bankData));
    return message.reply(`[🏦 Fa Hi Ma-Bank 🏦]\n\n✧Congratulations! Your high-risk investment of ${investmentAmount}$ paid off, and you earned ${potentialReturns}$ in returns! 🎉`);
  }
        case "gamble":
  const betAmount = parseInt(args[1]);

  if (isNaN(betAmount) || betAmount <= 0) {
    return message.reply("[🏦 JARiF AI-Bank 🏦]\n\n✧Please enter a valid amount to bet.💸");
  }

  if (userMoney < betAmount) {
    return message.reply("[🏦 Fa Hi Ma-Bank 🏦]\n\n✧You don't have enough money to place that bet.🙅‍♂️");
  }

  const winChance = 0.4;
  const isWin = Math.random() < winChance;

  if (isWin) {
    const winnings = betAmount * 2; 
    bankData[user].bank += winnings;
    await usersData.set(event.senderID, {
      money: userMoney - betAmount + winnings
    });
    fs.writeFileSync("./bank.json", JSON.stringify(bankData));
    return message.reply(`[🏦 Fa Hi Ma-Bank 🏦]\n\n✧Congratulations! You've won ${winnings}$! 🎉`);
  } else {
    bankData[user].bank -= betAmount;
    await usersData.set(event.senderID, {
      money: userMoney - betAmount
    });
    fs.writeFileSync("./bank.json", JSON.stringify(bankData));
    return message.reply(`[🏦 Fa Hi Ma-Bank 🏦]\n\n✧Oh no! You've lost ${betAmount}$ in the gamble. 😢`);
  }
        case "heist":
  const heistSuccessChance = 0.2; 
  const heistWinAmount = 10000; 
  const heistLossAmount = 500; 

  const isSuccess = Math.random() < heistSuccessChance;

  if (isSuccess) {
    const winnings = heistWinAmount;
    bankData[user].bank += winnings;
    fs.writeFileSync("./bank.json", JSON.stringify(bankData));
    return message.reply(`[🏦 Fa Hi Ma-Bank 🏦]\n\n✧Bank heist successful! You've won ${winnings}$! 💰`);
  } else {
    const lossAmount = heistLossAmount;
    bankData[user].bank -= lossAmount;
    fs.writeFileSync("./bank.json", JSON.stringify(bankData));
    return message.reply(`[🏦 Fa Hi Ma-Bank 🏦]\n\n✧Bank heist failed! You've lost ${lossAmount}$! 😔`);
  }
      case "balance":
        const bankBalance = bankData[user].bank !== undefined && !isNaN(bankData[user].bank) ? bankData[user].bank : 0;
        return message.reply(`[🏦 Fa Hi Ma-Bank 🏦]\n\n✧Your bank balance is: ${bankBalance}$ •\n✧To withdraw money.\n type:\n${p}Bank Withdraw 'your withdrawal amount'•\n✧To earn interest\ntype:\n${p}Bank Interest•`);


        case "interest":
        const interestRate = 0.001; // 0.1% daily interest rate
        const lastInterestClaimed = bankData[user].lastInterestClaimed || Date.now();
        const currentTime = Date.now();
        const timeDiffInSeconds = (currentTime - lastInterestClaimed) / 1000;
        const interestEarned = bankData[user].bank * (interestRate / 970) * timeDiffInSeconds;
        if (bankData[user].bank <= 0) {
    return message.reply("╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 Bank Bot 🏦]\n\n❏You don't have any money in your bank account to earn interest.💸🥱\n\n╚════ஜ۩۞۩ஜ═══╝");
        }

        bankData[user].lastInterestClaimed = currentTime;
        bankData[user].bank += interestEarned;

        fs.writeFileSync("bank.json", JSON.stringify(bankData));

        return message.reply(`╔════ஜ۩۞۩ஜ═══╗\n\n[🏦 Bank Bot 🏦]\n\n❏You have earned interest of ${interestEarned.toFixed(2)} $ . It has been successfully added to your account balance..✅\n\n╚════ஜ۩۞۩ஜ═══╝`);
      
      case "transfer":
        const senderBalance = bankData[user].bank || 0;

        if (isNaN(amount) || amount <= 0) {
          return message.reply("[🏦 Fa Hi Ma-Bank 🏦]\n\n✧Please enter the amount you want to transfer...♻️");
        }

        if (senderBalance < amount) {
          return message.reply("[🏦 Fa Hi Ma-Bank 🏦]\n\n✧The amount is not available in your bank account•");
        }

        if (isNaN(recipientUID)) {
          return message.reply(`[🏦 Fa Hi Ma-Bank 🏦]\n\n✧Please write:\n⭔ ${p}Bank Transfer followed by the amount and the recipient's ID {uid}•\nExample:\n${p}Bank Transfer 5000 289272210979`);
        }

        if (!bankData[recipientUID]) {
          bankData[recipientUID] = { bank: 0, lastInterestClaimed: Date.now() };
          fs.writeFileSync("./bank.json", JSON.stringify(bankData));
        }

        bankData[user].bank -= amount;
        bankData[recipientUID].bank += amount;

        fs.writeFileSync("./bank.json", JSON.stringify(bankData));

        const Ruser = await api.getUserInfo(recipientUID);
      const Rname = Ruser[recipientUID].name;
        const recipientMessage = `[🏦 Fa Hi Ma-Bank 🏦]\n\n✧You have received ${amount}$\nFrom:\n✧Name: ${username}\n✧BankID: ${user}.\n✧ Your current Bank balance:\n${bankData[recipientUID].bank}$\n\n~Fa Hi Ma Database✅`;
  await api.sendMessage(recipientMessage, recipientUID);
        return message.reply(`[🏦 Fa Hi Ma-Bank 🏦]\n\n✧Successfully deducted ${amount}$ from your account and transferred to Recipient Account\n\n-Recipient Info-\n✧Name: ${Rname}\n✧BankID: ${recipientUID}\n\n~Fa Hi Ma Database✅`);

        case "help":
  const helpMessage = `
    Bank Commands:
    -bank deposit (your_password) (your_amount)
    -bank withdraw (your_password) (your_amount)
    -bank balance
    -bank interest
    -bank transfer (amount) (recipientUID)
    -bank richest
    -bank loan (amount)
    -bank payloan (amount)
  `;
  return message.reply(helpMessage);



      case "richest":
  const bankDataCp = JSON.parse(fs.readFileSync('./bank.json', 'utf8'));

  const topUsers = Object.entries(bankDataCp)
    .sort(([, a], [, b]) => b.bank - a.bank)
    .slice(0, 50); 

  const output = (await Promise.all(topUsers.map(async ([userID, userData], index) => {
    const userName = await usersData.getName(userID);
    return `[${index + 1}. ${userName}] - ${userData.bank}$`;
  }))).join('\n');

  return message.reply("Top richest users in the Fa Hi Ma-Bank system👑🤴:\n" + output);


        case "setpassword":
  const newPassword = args[1];
  if (!newPassword) {
    return message.reply("[🏦 Fa Hi Ma-Bank 🏦]\n\n✧Please provide a new password to set.🔑");
  }
  bankData[user].password = newPassword;
  fs.writeFileSync("./bank.json", JSON.stringify(bankData));
  return message.reply("[🏦 Fa Hi Ma-Bank 🏦]\n\n✧Your password has been set successfully.🔑");

case "changepassword":
  const currentPassword = args[1];
  const newPwd = args[2]; 

  if (!currentPassword || !newPwd) {
    return message.reply("[🏦 Fa Hi Ma-Bank 🏦]\n\n✧Please provide your current password and a new password to change.🔑");
  }

  if (bankData[user].password !== currentPassword) {
    return message.reply("[🏦 Fa Hi Ma-Bank 🏦]\n\n✧Incorrect current password. Please try again.🔑");
  }
  bankData[user].password = newPwd; 
  feFileSync  ("./bank.json", JSON.stringify(bankData));
  return message.reply("[🏦 Fa Hi Ma-Bank 🏦]\n\n✧Your password has been changed successfully.🔑");

case "removepassword":
  if (!bankData[user].password) {
    return message.reply("[🏦 Fa Hi Ma-Bank 🏦]\n\n✧You do not have a password set for your account.🔒");
  }
  bankData[user].password = null;
  fs.writeFileSync("./bank.json", JSON.stringify(bankData));
  return message.reply("[🏦 Fa Hi Ma-Bank 🏦]\n\n✧Your password has been removed successfully.🔒");


           case "payloan":
  const loanBalance = bankData[user].loan || 0;

  if (isNaN(amount) || amount <= 0) {
    return message.reply("[🏦 Fa Hi Ma-Bank 🏦]\n\n✧Please enter a valid amount to repay your loan..❗");
  }

  if (loanBalance <= 0) {
    return message.reply("[🏦 Fa Hi Ma-Bank 🏦]\n\n✧You don't have any pending loan payments.😄");
  }

  if (amount > loanBalance) {
    return message.reply(`[🏦 Fa Hi Ma-Bank 🏦]\n\n✧The amount required to pay off the loan is greater than your due amount. Please pay the exact amount.😊\nYour total loan: ${loanBalance}$`);
  }

  if (amount > userMoney) {
    return message.reply(`[🏦 Fa Hi Ma-Bank 🏦]\n\n✧You do not have ${amount}$ in your balance to repay the loan.❌\nType ${p}bal\nto view your current main balance..😞`);
  }

  bankData[user].loan = loanBalance - amount;

  if (loanBalance - amount === 0) {
    bankData[user].loanPayed = true;
  }

  await usersData.set(event.senderID, {
    money: userMoney - amount
  });


  fs.writeFileSync("./bank.json", JSON.stringify(bankData));

  return message.reply(`[🏦 Fa Hi Ma-Bank 🏦]\n\n✧Successfully repaid ${amount}$ towards your loan.✅\n\nto check type:\n${p}bank balance\n\nAnd your current loan to pay: ${bankData[user].loan}$`);




case "loan":
  const maxLoanAmount = 10000000;
  const userLoan = bankData[user].loan || 0;
  const loanPayed = bankData[user].loanPayed !== undefined ? bankData[user].loanPayed : true;

  if (!amount) {
    return message.reply("[🏦 Fa Hi Ma-Bank 🏦]\n\n✧Please enter a valid loan amount..❗");
  }

  if (amount > maxLoanAmount) {
    return message.reply("[🏦 Fa Hi Ma-Bank 🏦]\n\n✧The maximum loan amount is 10000000 ‼️");
  }

  if (!loanPayed && userLoan > 0) {
    return message.reply(`[🏦 Fa Hi Ma-Bank 🏦]\n\n✧You cannot take a new loan until you pay off your current loan..🌚\nYour current loan to pay: ${userLoan}$`);
  }

  bankData[user].loan = userLoan + amount;
  bankData[user].loanPayed = false;
  bankData[user].bank += amount;

  fs.writeFileSync("./bank.json", JSON.stringify(bankData));

  return message.reply(`[🏦 Fa HiMa-Bank 🏦]\n\n✧You have successfully taken a loan of ${amount}$. Please note that loans must be repaid within a certain period.😉 loans na dite parle apner jaigajomisob amar hoia jabe 😘 link`);

        case "calculator":
  const operation = args[1]; 
  const operand1 = parseFloat(args[2]); 
  const operand2 = parseFloat(args[3]); 

  if (!operation || isNaN(operand1) || isNaN(operand2)) {
    return message.reply("[🧮 Calculator 🧮]\n\n✧Please provide a valid mathematical operation and two numbers to calculate. Example: -bank calculator + 5 3");
  }

  let result;

  switch (operation) {
    case "+":
      result = operand1 + operand2;
      break;
    case "-":
      result = operand1 - operand2;
      break;
    case "*":
      result = operand1 * operand2;
      break;
    case "/":
      if (operand2 === 0) {
        return message.reply("[🧮 Calculator 🧮]\n\n✧You can't divide by zero. Please provide a valid second number.");
      }
      result = operand1 / operand2;
      break;
    default:
      return message.reply("[🧮 Calculator 🧮]\n\n✧Invalid operation. Please use one of the following: +, -, *, /");
  }

  return message.reply(`[🧮 Calculator 🧮]\n\n✧Result of ${operand1} ${operation} ${operand2} is ${result}`);




default:
        return message.reply(`===[🏦 Fa Hi Ma-Bank 🏦]===\n\n✧Please use one of the following commands✧\n⦿ ${p}Bank Help\n⦿ ${p}Bank Deposit\n⦿ ${p}Bank Caculator\n⦿ ${p}Bank Balance\n⦿ ${p}Bank Interest\n⦿ ${p}Bank Transfer\n⦿ ${p}Bank Richest\n⦿ ${p}Bank Nude\n⦿ ${p}Bank Loan\n⦿ ${p}Bank PayLoan\n⦿ ${p}Bank hrinvest\n⦿ ${p}Bank Gamble\n⦿ ${p}Bank Heist\n\n ===[🏦 Password 🏦]===\n✧Please add password for secure your bank account✧\n⦿ ${p}Bank setpassword\n⦿ ${p}Bank changepassword\n⦿ ${p}Bank removepassword`);
    }
  }
};


// Function to format a number with full forms (e.g., 1 Thousand, 133 Million, 76.2 Billion)
function formatNumberWithFullForm(number) {
  const fullForms = [
    "",
    "Thousand",
    "Million",
    "Billion",
    "Trillion",
    "Quadrillion",
    "Quintillion",
    "Sextillion",
    "Septillion",
    "Octillion",
    "Nonillion",
    "Decillion",
    "Undecillion",
    "Duodecillion",
    "Tredecillion",
    "Quattuordecillion",
    "Quindecillion",
    "Sexdecillion",
    "Septendecillion",
    "Octodecillion",
    "Novemdecillion",
    "Vigintillion",
    "Unvigintillion",
    "Duovigintillion",
    "Tresvigintillion",
    "Quattuorvigintillion",
    "Quinvigintillion",
    "Sesvigintillion",
    "Septemvigintillion",
    "Octovigintillion",
    "Novemvigintillion",
    "Trigintillion",
    "Untrigintillion",
    "Duotrigintillion",
    "Googol",
  ];

  // Calculate the full form of the number (e.g., Thousand, Million, Billion)
  let fullFormIndex = 0;
  while (number >= 1000 && fullFormIndex < fullForms.length - 1) {
    number /= 1000;
    fullFormIndex++;
  }

  // Format the number with two digits after the decimal point
  const formattedNumber = parseFloat(number).toFixed(2);

  // Add the full form to the formatted number
  return `${formattedNumber} ${fullForms[fullFormIndex]}`;
}