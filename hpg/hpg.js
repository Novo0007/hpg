 // JavaScript logic remains the same as before
                document.addEventListener('DOMContentLoaded', () => {
            const colorDisplay = document.getElementById('colorDisplay');
            const numberDisplay = document.getElementById('numberDisplay');
            const colorButtons = document.querySelectorAll('.color-button');
            const numberButtons = document.querySelectorAll('.number-button');
            const balanceDisplay = document.getElementById('balance');
            const betAmountInput = document.getElementById('betAmount');
            const placeBetButton = document.getElementById('placeBetButton');
            const resultDisplay = document.getElementById('result');
            const addMoneyButton = document.getElementById('addMoneyButton');
            const withdrawButton = document.getElementById('withdrawButton');
            const timerDisplay = document.getElementById('timer');
            const historyList = document.getElementById('historyList');

            let balance = parseInt(localStorage.getItem('balance')) || 10;
            let selectedColor = null;
            let selectedNumber = null;
            let timer;
            let timeLeft = 60;
            let roundEnded = false;

            const colors = ["Red", "Blue", "Green", "Yellow", "Purple", "Orange", "Pink", "Cyan"];
            const numbers = Array.from({ length: 10 }, (_, i) => i + 1); // Numbers 1-10

            // Load balance from localStorage
            balanceDisplay.textContent = balance;

            // Event listeners for color selection
            colorButtons.forEach(button => {
                button.addEventListener('click', () => {
                    selectedColor = button.getAttribute('data-color');
                    colorButtons.forEach(btn => btn.classList.remove('selected'));
                    button.classList.add('selected');
                });
            });

            // Event listeners for number selection
            numberButtons.forEach(button => {
                button.addEventListener('click', () => {
                    selectedNumber = parseInt(button.getAttribute('data-number'));
                    numberButtons.forEach(btn => btn.classList.remove('selected'));
                    button.classList.add('selected');
                });
            });

            // Event listener for placing a bet
            placeBetButton.addEventListener('click', () => {
                if (roundEnded) return;

                const betAmount = parseInt(betAmountInput.value);

                if (isNaN(betAmount) || betAmount <= 0) {
                    alert('Please enter a valid bet amount!');
                    return;
                }

                if (betAmount > balance) {
                    alert('Insufficient balance!');
                    return;
                }

                if (!selectedColor || !selectedNumber) {
                    alert('Please select a color and a number!');
                    return;
                }

                // Deduct bet amount
                updateBalance(-betAmount);

                // Start the countdown
                startTimer();

                // Disable buttons
                placeBetButton.disabled = true;
                colorButtons.forEach(button => button.disabled = true);
                numberButtons.forEach(button => button.disabled = true);
                betAmountInput.disabled = true;
            });

            // Start the countdown timer
            function startTimer() {
                clearInterval(timer);
                timeLeft = 60;
                timerDisplay.textContent = `Time Left: ${timeLeft}s`;
                timer = setInterval(() => {
                    timeLeft--;
                    timerDisplay.textContent = `Time Left: ${timeLeft}s`;
                    if (timeLeft <= 0) {
                        clearInterval(timer);
                        endRound();
                    }
                }, 1000);
            }

            // End the round and determine the result
            function endRound() {
                roundEnded = true;

                const winningColor = colors[Math.floor(Math.random() * colors.length)];
                const winningNumber = numbers[Math.floor(Math.random() * numbers.length)];

                colorDisplay.style.backgroundColor = winningColor;
                numberDisplay.textContent = winningNumber;

                let resultText = '';
                let winnings = 0;

                if (selectedColor === winningColor && selectedNumber === winningNumber) {
                    winnings = betAmountInput.value * 3; // 10x payout for both correct
                    resultText = `🎉 Congratulations! You won ₹${winnings}! (Color: ${winningColor}, Number: ${winningNumber})`;
                } else if (selectedColor === winningColor) {
                    winnings = betAmountInput.value * 2; // 2x payout for correct color
                    resultText = `🎉 Congratulations! You won ₹${winnings}! (Color: ${winningColor})`;
                } else if (selectedNumber === winningNumber) {
                    winnings = betAmountInput.value * 2; // 5x payout for correct number
                    resultText = `🎉 Congratulations! You won ₹${winnings}! (Number: ${winningNumber})`;
                } else {
                    resultText = `❌ Sorry! You lost this round. Try again! (Color: ${winningColor}, Number: ${winningNumber})`;
                }

                updateBalance(winnings);
                resultDisplay.textContent = resultText;
                addToHistory(resultText);

                // Enable buttons for the next round
                setTimeout(() => {
                    placeBetButton.disabled = false;
                    colorButtons.forEach(button => button.disabled = false);
                    numberButtons.forEach(button => button.disabled = false);
                    betAmountInput.disabled = false;
                    roundEnded = false;
                    startTimer(); // Restart the timer for the next round
                }, 10000); // 3-second delay before the next round
            }

            // Update balance and save to localStorage
            function updateBalance(amount) {
                balance += amount;
                balanceDisplay.textContent = balance;
                localStorage.setItem('balance', balance);
            }

            // Add result to game history
            function addToHistory(result) {
                const li = document.createElement('li');
                li.textContent = result;
                historyList.appendChild(li);
            }

            // Add Money Button (Razorpay Integration)
            addMoneyButton.addEventListener('click', () => {
                const options = {
                    key: 'rzp_live_X4DZnSdUxCtfV8', // Replace with your Razorpay Key ID
                    amount: 5000, // Amount in paise (e.g., 10000 = ₹100)
                    currency: 'INR',
                    name: 'Color & Number Prediction Game',
                    description: 'Add Money to Wallet',
                    handler: function(response) {
                        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
                        updateBalance(50); // Add ₹100 to balance
                    },
                    prefill: {
                        name: 'Player Name',
                        email: 'helpzappy@gmail.com',
                        contact: '8016487441'
                    },
                    theme: {
                        color: '#3399cc'
                    }
                };
                const rzp = new Razorpay(options);
                rzp.open();
            });

            // Withdraw Feature
            withdrawButton.addEventListener('click', () => {
                const withdrawAmount = parseInt(prompt('Enter the amount to withdraw:'));
                if (isNaN(withdrawAmount) || withdrawAmount <= 1024) {
                    alert('Invalid amount!');
                } else if (withdrawAmount > balance) {
                    alert('Insufficient balance!');
                } else {
                    updateBalance(-withdrawAmount);
                    alert(`Withdrawal successful! ₹${withdrawAmount} has been deducted from your balance.`);
                }
            });

            // Start the timer when the page loads
            startTimer();
        });
