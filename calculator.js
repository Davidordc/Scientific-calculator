// calculator.js - Core calculator functionality
class Calculator {
    constructor() {
        this.input = '';
        this.result = '';
        this.memory = 0;
        this.history = [];
        this.version = 1;
    }

    // Input handling
    appendInput(value) {
        this.input += value;
        return this.input;
    }

    clearInput() {
        this.input = '';
        this.result = '';
        return this.input;
    }

    clearEntry() {
        this.input = this.input.slice(0, -1);
        return this.input;
    }

    // Calculation
    calculate() {
        try {
            // Replace ^ with ** for exponentiation
            let expression = this.input.replace(/\^/g, '**');
            
            this.result = math.evaluate(expression).toString();
            
            // Add to history
            this.addToHistory(this.input, this.result);
            
            return this.result;
        } catch (error) {
            console.error('Calculation error:', error);
            this.result = 'Error';
            return this.result;
        }
    }

    // Memory functions
    memoryStore() {
        try {
            this.memory = this.result ? parseFloat(this.result) : math.evaluate(this.input);
        } catch (error) {
            console.error('Memory store error:', error);
        }
    }

    memoryRecall() {
        this.input += this.memory.toString();
        return this.input;
    }

    memoryAdd() {
        try {
            const currentValue = this.result ? parseFloat(this.result) : math.evaluate(this.input);
            this.memory += currentValue;
        } catch (error) {
            console.error('Memory add error:', error);
        }
    }

    memorySubtract() {
        try {
            const currentValue = this.result ? parseFloat(this.result) : math.evaluate(this.input);
            this.memory -= currentValue;
        } catch (error) {
            console.error('Memory subtract error:', error);
        }
    }

    memoryClear() {
        this.memory = 0;
    }

    // History management
    addToHistory(expression, result) {
        this.history.push({ expression, result });
        
        // Keep history limited to last 10 calculations
        if (this.history.length > 10) {
            this.history.shift();
        }
    }

    clearHistory() {
        this.history = [];
    }

    // Version management
    upgradeVersion(newVersion) {
        if (newVersion > 0 && newVersion <= 3) {
            this.version = newVersion;
        }
        return this.version;
    }

    // Getters
    getInput() {
        return this.input;
    }

    getResult() {
        return this.result;
    }

    getMemory() {
        return this.memory;
    }

    getHistory() {
        return this.history;
    }

    getVersion() {
        return this.version;
    }
}

// Export for testing
if (typeof module !== 'undefined') {
    module.exports = Calculator;
}