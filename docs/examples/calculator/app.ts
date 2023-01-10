class CalculatorApp {
    #hydrate:HydrateApp;
    #state:CalculatorState;
    #model:CalculatorState;

    constructor() {
        this.#hydrate = new HydrateApp();
        const calculator = this;

        this.#state = {
            entry: {
                value1: "0",
                value2: null,
                operator: null,
                memmory: null,
                total: null
            },
            display: {
                lines: []
            },
            keypad: {
                keys: [
                    
                    {display: "1", press: () => calculator.pressNumber("1")},
                    {display: "2", press: () => calculator.pressNumber("2")},
                    {display: "3", press: () => calculator.pressNumber("3")},
                    {display: "/", press: () => calculator.pressOperator("/")},

                    {display: "4", press: () => calculator.pressNumber("4")},
                    {display: "5", press: () => calculator.pressNumber("5")},
                    {display: "6", press: () => calculator.pressNumber("6")},
                    {display: "*", press: () => calculator.pressOperator("*")},

                    {display: "7", press: () => calculator.pressNumber("7")},
                    {display: "8", press: () => calculator.pressNumber("8")},
                    {display: "9", press: () => calculator.pressNumber("9")},
                    {display: "+", press: () => calculator.pressOperator("+")},


                    {display: "0", press: () => calculator.pressNumber("0")},
                    {display: ".", press: () => calculator.pressDecimal()},
                    {display: "-", press: () => calculator.pressOperator("-")},
                    {display: "=", press: () => calculator.calculate()},
                ]
            }
        };
        this.#model = this.#hydrate.bind("app", this.#state);
        this.updateDisplay();
    }

    get hydrate() {
        return this.#hydrate;
    }

    start() {
        this.#hydrate.start();
        this.#hydrate.route();
    }

    pressNumber(number:string) {
        this.#model.entry.value1 = Number.parseFloat(this.#state.entry.value1) === 0 ? number : this.#state.entry.value1 + number;
        this.updateDisplay();
    }

    pressDecimal() {
        if(this.#state.entry.value1.indexOf(".") > -1)
            return;
        this.pressNumber(".");
    }

    pressOperator(operator:CalculatorOperator) {
        this.#model.entry.memmory = null;
        if(this.#model.entry.value2 != null)
        {
            this.calculate();
        }
        this.#model.entry.value2 = this.#state.entry.value1;
        this.#model.entry.value1 = "0";
        this.#model.entry.operator = operator;
        this.updateDisplay();
    }

    calculate() {
        if(this.#state.entry.value2 == null && this.#state.entry.memmory == null)
            return;
        const operator = this.#state.entry.memmory?.operator ?? this.#state.entry.operator;
        let total:number = 0;
        const val1 = this.#state.entry.memmory?.value ?? this.#state.entry.value1;
        const val2 = this.#state.entry.memmory == null ? this.#state.entry.value2 : this.#state.entry.value1;
        const input1 = Number.parseFloat(val2);
        const input2 = Number.parseFloat(val1);
        switch(operator)
        {
            case "+":
                total = input1 + input2;
                break;
            case "-":
                total = input1 - input2;
                break;
            case "/":
                total = input1 / input2;
                break;
            case "*":
                total = input1 * input2;
                break;
        } 

        this.#model.entry.memmory = {
            value: val1,
            operator: operator
        };
        this.#model.entry.operator = null;
        this.#model.entry.value1 = total.toString();
        this.#model.entry.value2 = null;
        this.updateDisplay();
    }

    updateDisplay() {
        const lines = [];

        this.#model.display.lines = [
            this.#state.entry.value1.toString(),
            this.#state.entry.operator?.toString() ?? "",
            this.#state.entry.value2?.toString() ?? "",
        ];
    }
}

type CalculatorOperator = "+" | "-" | "/" | "*";

interface CalculatorState {
    entry:CalculatorEntryState;
    display:CalculatorDisplayState;
    keypad:CalculatorKeypadState;
}

interface CalculatorEntryState {
    value1:string;
    value2:string;
    operator:CalculatorOperator;
    memmory:CalculatorEntryMemmoryState;
    total:number;
}

interface CalculatorEntryMemmoryState {
    value:string;
    operator:CalculatorOperator;
}

interface CalculatorDisplayState {
    lines:string[];
}

interface CalculatorKeypadState {
    keys:CalculatorKey[]
}

interface CalculatorKey {
    display:string;
    press:()=>void;
}