document.addEventListener('DOMContentLoaded', () => {
    const terminal = document.getElementById('terminal');
    const userInput = document.getElementById('user-input');
    const prompt = document.getElementById('prompt');

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
                enableUserInput();
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
            printText(`\n${input}\n`);
            // Add logic to handle user input (execute commands, etc.)
            // For now, let's just clear the input
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

    // Update the cursor every 500 milliseconds to create a flashing effect

    // Example usage:
    printText('[ XENIA NETWORK TERMINAL ]\n> Authorized Personnel Only - Decrypting Cipher...\n>...\n>...\n> Decryption Complete. Terminal Access Granted.');

    function enableUserInput() {
        // Show the prompt and user input after printing is complete
        prompt.style.visibility = 'visible';
        userInput.style.visibility = 'visible';
        userInput.removeAttribute('disabled');
        userInput.focus();
    }
});