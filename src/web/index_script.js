document.addEventListener('DOMContentLoaded', () => {
    const terminal = document.getElementById('terminal');
    const userInput = document.getElementById('user-input');
    const prompt = document.getElementById('prompt');
    const printTextQueue = [];
    let isPrintTextBusy = false;
    let terminalAvailable = false;

    function processPrintTextQueue() {
        if (printTextQueue.length > 0 && !isPrintTextBusy) {
            isPrintTextBusy = true;
            const textToPrint = printTextQueue.shift();
            printText(textToPrint);
        }
    }

    function printText(text) {
        // Split the text into an array of characters
        const characters = text.split('');

        // Use recursion to print each character with a delay
        function printNextCharacter(index) {
            if (index < characters.length) {
                terminal.textContent += characters[index];
                terminal.scrollTop = terminal.scrollHeight;

                // Adjust the delay (you can tweak this value)
                const delay = 50;

                // Call the next character after the delay
                setTimeout(() => {
                    printNextCharacter(index + 1);
                }, delay);
            } else {
                if(!terminalAvailable) {
                    enableUserInput();
                    terminalAvailable = true;
                }
                isPrintTextBusy = false;
                processPrintTextQueue();
            }

        }

        // Start printing characters
        printNextCharacter(0);
    }

    function clearTerminal() {
        terminal.textContent = '';
    }

    function handleUserInput() {
        const input = userInput.value.trim();
        if (input !== '') {
            printTextQueue.push(`\n> ${input}\n`);
            fetch(`http://localhost:8000/guest_entry/${input}`)
                .then(response => response.json())
                .then(data => {
                        const jsonString = JSON.stringify(data, null, 2);
                    printTextQueue.push(jsonString);
                })
                .catch(error => console.error('Error:', error));
            

            if (!isPrintTextBusy) {
                processPrintTextQueue();
            }
            userInput.value = '';
            userInput.focus();
        }
    }

    userInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleUserInput();
        }
    });
    printText('[ XENIA NETWORK TERMINAL ]\n> Authorized Personnel Only - Decrypting Cipher...\n>...\n>...\n> Decryption Complete. Terminal Access Granted.\n> Type \'help\' to display available commands.\n\n\n');
    console.log("This Web service is running on a remote machine with VERY limited RAM and storage, please do not try to brute-force entries or I'll plant an IED under your house, thanks :) -Revo")
    function enableUserInput() {
        // Show the prompt and user input after printing is complete
        prompt.style.visibility = 'visible';
        userInput.style.visibility = 'visible';
        userInput.removeAttribute('disabled');
        userInput.focus();
    }
});