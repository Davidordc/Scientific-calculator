// Mocking the math.js library
global.math = {
    evaluate: jest.fn()
};

const Calculator = require('./calculator');

describe('Calculator', () => {
    let calculator;
    
    beforeEach(() => {
        calculator = new Calculator();
        // Reset the mock implementation for each test
        math.evaluate.mockReset();
    });
    
    // Test basic operations (Version 1)
    describe('Basic Operations (Version 1)', () => {
        test('should append input correctly', () => {
            calculator.appendInput('5');
            calculator.appendInput('+');
            calculator.appendInput('3');
            expect(calculator.getInput()).toBe('5+3');
        });
        
        test('should clear input', () => {
            calculator.appendInput('123');
            calculator.clearInput();
            expect(calculator.getInput()).toBe('');
            expect(calculator.getResult()).toBe('');
        });
        
        test('should clear last entry', () => {
            calculator.appendInput('123');
            calculator.clearEntry();
            expect(calculator.getInput()).toBe('12');
        });
        
        test('should calculate basic addition', () => {
            math.evaluate.mockReturnValue(8);
            calculator.appendInput('5+3');
            calculator.calculate();
            expect(math.evaluate).toHaveBeenCalledWith('5+3');
            expect(calculator.getResult()).toBe('8');
        });
        
        test('should handle calculation errors', () => {
            math.evaluate.mockImplementation(() => {
                throw new Error('Invalid expression');
            });
            calculator.appendInput('5/0');
            calculator.calculate();
            expect(calculator.getResult()).toBe('Error');
        });
    });
    
    // Test scientific functions (Version 2)
    describe('Scientific Functions (Version 2)', () => {
        test('should handle exponential calculations', () => {
            math.evaluate.mockReturnValue(8);
            calculator.appendInput('2^3');
            calculator.calculate();
            // ^ should be replaced with ** for math.js
            expect(math.evaluate).toHaveBeenCalledWith('2**3');
            expect(calculator.getResult()).toBe('8');
        });
        
        test('should upgrade to version 2', () => {
            expect(calculator.getVersion()).toBe(1);
            calculator.upgradeVersion(2);
            expect(calculator.getVersion()).toBe(2);
        });
    });
    
    // Test memory and history functions (Version 3)
    describe('Advanced Features (Version 3)', () => {
        beforeEach(() => {
            calculator.upgradeVersion(3);
        });
        
        test('should store and recall memory', () => {
            math.evaluate.mockReturnValue(5);
            calculator.appendInput('5');
            calculator.calculate();
            calculator.memoryStore();
            calculator.clearInput();
            calculator.memoryRecall();
            expect(calculator.getInput()).toBe('5');
        });
        
        test('should add to memory', () => {
            math.evaluate.mockReturnValue(5);
            calculator.appendInput('5');
            calculator.calculate();
            calculator.memoryStore(); // Memory = 5
            
            math.evaluate.mockReturnValue(3);
            calculator.clearInput();
            calculator.appendInput('3');
            calculator.memoryAdd(); // Memory = 5 + 3 = 8
            
            expect(calculator.getMemory()).toBe(8);
        });
        
        test('should subtract from memory', () => {
            math.evaluate.mockReturnValue(10);
            calculator.appendInput('10');
            calculator.calculate();
            calculator.memoryStore(); // Memory = 10
            
            math.evaluate.mockReturnValue(4);
            calculator.clearInput();
            calculator.appendInput('4');
            calculator.memorySubtract(); // Memory = 10 - 4 = 6
            
            expect(calculator.getMemory()).toBe(6);
        });
        
        test('should clear memory', () => {
            math.evaluate.mockReturnValue(10);
            calculator.appendInput('10');
            calculator.calculate();
            calculator.memoryStore(); // Memory = 10
            calculator.memoryClear();
            expect(calculator.getMemory()).toBe(0);
        });
        
        test('should add calculations to history', () => {
            math.evaluate.mockReturnValue(8);
            calculator.appendInput('5+3');
            calculator.calculate();
            expect(calculator.getHistory()[0]).toEqual({
                expression: '5+3',
                result: '8'
            });
        });
        
        test('should limit history to 10 items', () => {
            // Add 11 items to history
            for (let i = 0; i < 11; i++) {
                math.evaluate.mockReturnValue(i);
                calculator.appendInput(`${i}`);
                calculator.calculate();
            }
            
            // Check that only 10 items are stored and the oldest is removed
            expect(calculator.getHistory().length).toBe(10);
            expect(calculator.getHistory()[0].result).toBe('1');
        });
        
        test('should clear history', () => {
            math.evaluate.mockReturnValue(8);
            calculator.appendInput('5+3');
            calculator.calculate();
            calculator.clearHistory();
            expect(calculator.getHistory().length).toBe(0);
        });
    });
});