// Terminal JavaScript.
// A webbased terminal emulator
var Terminal = (function (displayDOM) {

    var self = this;
    this.displayDOM = displayDOM;
    this.terminalLineCounter = 0;

    this.addTerminalLine = function (displayElement, text, pretext, lineStyle) {

        // 1. Get the element to display text on.
        // 2. Create a div for the new line.
        // 3. Concactenate pre-text and text.
        // 4. Check for style, apply
        // 5. Append the new line DIV to target element.
        // 6. Increment line count.

        var terminal = document.getElementById(displayElement);
        var newLine = document.createElement('div');
        newLine.innerHTML = pretext + text;
        if (lineStyle !== "") {
            newLine.classList.add(lineStyle);
        }
        terminal.appendChild(newLine);
        terminal.scrollTop = terminal.scrollHeight;
        terminalLineCounter++;
    };

    this.addSystemText = function (text) {
        self.addTerminalLine(displayDOM, text, '-) ', 'system-text');
    }
    
    this.setDisplayDOM = function(disDOM){
        this.displayDOM = disDOM;
    }
    
    return {
        addTerminalLine: addTerminalLine,
        addSystemText: addSystemText,
        setDisplayDOM: setDisplayDOM
    }
})();
