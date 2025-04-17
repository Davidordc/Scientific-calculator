// app.js - Application initialization and event handling
document.addEventListener('DOMContentLoaded', function() {
    // UI Elements
    const inputElement = document.getElementById('input');
    const resultElement = document.getElementById('result');
    const buttons = document.querySelectorAll('.btn');
    const upgradeBtn = document.getElementById('upgrade-btn');
    const versionBadge = document.getElementById('version-badge');
    const scientificFunctions = document.getElementById('scientific-functions');
    const memoryFunctions = document.getElementById('memory-functions');
    const historyContainer = document.getElementById('history-container');
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history');

    // Initialize calculator
    const calculator = new Calculator();
    
    // Version configurations
    const versionConfig = {
        1: {
            name: "Version 1.0: Basic Operations",
            nextVersion: 2,
            nextVersionName: "Scientific Functions"
        },
        2: {
            name: "Version 2.0: Scientific Functions",
            nextVersion: 3,
            nextVersionName: "Advanced Features"
        },
        3: {
            name: "Version 3.0: Advanced Features",
            nextVersion: null,
            nextVersionName: null
        }
    };

    // Function to update UI based on calculator version
    function updateVersionUI(version) {
        // Update version badge
        versionBadge.textContent = versionConfig[version].name;
        
        // Show/hide feature sections based on version
        if (version >= 2) {
            scientificFunctions.style.display = 'flex';
        } else {
            scientificFunctions.style.display = 'none';
        }
        
        if (version >= 3) {
            memoryFunctions.style.display = 'flex';
            historyContainer.style.display = 'block';
            // Update upgrade button
            upgradeBtn.style.display = 'none';
        } else {
            memoryFunctions.style.display = 'none';
            historyContainer.style.display = 'none';
            // Update upgrade button text
            if (versionConfig[version].nextVersion) {
                upgradeBtn.textContent = `Upgrade to ${versionConfig[version].nextVersion}.0: ${versionConfig[version].nextVersionName}`;
                upgradeBtn.style.display = 'inline-block';
            }
        }
    }

    // Function to update history display
    function updateHistoryDisplay() {
        historyList.innerHTML = '';
        const history = calculator.getHistory();
        
        if (history.length === 0) {
            const emptyItem = document.createElement('div');
            emptyItem.className = 'history-item';
            emptyItem.textContent = 'No calculations yet';
            historyList.appendChild(emptyItem);
        } else {
            history.forEach((item, index) => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                
                const expressionSpan = document.createElement('span');
                expressionSpan.className = 'history-expression';
                expressionSpan.textContent = `${item.expression} = `;
                
                const resultSpan = document.createElement('span');
                resultSpan.className = 'history-result';
                resultSpan.textContent = item.result;
                
                historyItem.appendChild(expressionSpan);
                historyItem.appendChild(resultSpan);
                historyList.appendChild(historyItem);
            });
        }
    }

    // Add click event listeners to all calculator buttons
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.getAttribute('data-value');
            
            // Handle different button types
            if (value === 'C') {
                // Clear all
                calculator.clearInput();
                inputElement.value = '';
                resultElement.textContent = '';
            } else if (value === 'CE') {
                // Clear last entry
                calculator.clearEntry();
                inputElement.value = calculator.getInput();
            } else if (value === '=') {
                // Calculate result
                calculator.calculate();
                resultElement.textContent = calculator.getResult();
                
                // Update history if in version 3
                if (calculator.getVersion() >= 3) {
                    updateHistoryDisplay();
                }
            } else if (value === 'MC') {
                // Memory clear
                calculator.memoryClear();
            } else if (value === 'MR') {
                // Memory recall
                calculator.memoryRecall();
                inputElement.value = calculator.getInput();
            } else if (value === 'M+') {
                // Memory add
                calculator.memoryAdd();
            } else if (value === 'M-') {
                // Memory subtract
                calculator.memorySubtract();
            } else {
                // Append value to input
                calculator.appendInput(value);
                inputElement.value = calculator.getInput();
            }
        });
    });

    // Add click event listener to upgrade button
    upgradeBtn.addEventListener('click', () => {
        const currentVersion = calculator.getVersion();
        const nextVersion = versionConfig[currentVersion].nextVersion;
        
        if (nextVersion) {
            calculator.upgradeVersion(nextVersion);
            updateVersionUI(nextVersion);
        }
    });

    // Add click event listener to clear history button
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', () => {
            calculator.clearHistory();
            updateHistoryDisplay();
        });
    }

    // Initialize UI with version 1
    updateVersionUI(calculator.getVersion());
});