

var MaxTest = function(port, numControllers) {

    this.active = 0;

    this.setActiveController = function(index) {
        this.active = index;
    }

    this.clearDisplay = function() {
        console.log(this.active + " : clear display");
    }

    this.setDigitSegments = function(line, array) {
        //console.log(this.active + " : {" + line + "} " + array)
        //console.log(this.active + " : setDigitSegments");
    }

    this.setDecodeNone = function() { console.log(this.active + " : setDecodeNone"); };

    this.setScanLimit = function() { console.log(this.active + " : setScanLimit"); };

    this.setDisplayIntensity = function() { 
        //console.log(this.active + " : setDisplayIntensity");
     };

    this.startup = function() { console.log(this.active + " : startup"); };

    this.shutdown = function() { console.log(this.active + " : shutdown") };

}

var MAX7219 = require('max7219');
//var MAX7219 = MaxTest;

var numControllers = 4;
var lineHeight = process.env.lineHeight || 2;
var defaultBrightness = process.env.brightness || 8;


var font = [
    [
        [0,1,0],
        [1,0,1],
        [1,0,1],
        [1,0,1],
        [0,1,0]
    ],
    [
        [0,1,0],
        [1,1,0],
        [0,1,0],
        [0,1,0],
        [1,1,1]
    ],
    [
        [1,1,1],
        [0,0,1],
        [1,1,1],
        [1,0,0],
        [0,1,1]
    ],
    [
        [1,1,1],
        [0,0,1],
        [1,1,1],
        [0,0,1],
        [1,1,1]
    ],
    [
        [1,0,1],
        [1,0,1],
        [1,1,1],
        [0,0,1],
        [0,0,1]
    ],
    [
        [1,1,1],
        [1,0,0],
        [1,1,1],
        [0,0,1],
        [1,1,0]
    ],
    [
        [0,1,1],
        [1,0,0],
        [1,1,0],
        [1,0,1],
        [0,1,1]
    ],
    [
        [1,1,1],
        [0,0,1],
        [0,1,0],
        [0,1,0],
        [0,1,0]
    ],
    [
        [0,1,1],
        [1,0,1],
        [1,1,1],
        [1,0,1],
        [0,1,1]
    ],
    [
        [0,1,1],
        [1,0,1],
        [1,1,1],
        [0,0,1],
        [0,0,1]
    ],
    // empty
    [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ],
    // Tick
    [
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,1],
        [0,0,0,0,0,0,1,0],
        [0,0,0,0,0,1,1,0],
        [0,1,0,0,1,1,0,0],
        [0,0,1,0,1,0,0,0],
        [0,0,0,1,0,0,0,0],
        [0,0,0,0,0,0,0,0]
    ],
    // Unknown
    [
        [0,0,0,0,0,0,0,0],
        [0,1,0,0,0,0,1,0],
        [0,0,1,0,0,1,0,0],
        [0,0,0,1,1,0,0,0],
        [0,0,0,1,1,0,0,0],
        [0,0,1,0,0,1,0,0],
        [0,1,0,0,0,0,1,0],
        [0,0,0,0,0,0,0,0]
    ],
    // Error
    [
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [1,1,0,0,0,0,0,0],
        [1,0,0,0,0,0,0,0],
        [1,1,0,1,1,0,1,1],
        [1,0,0,1,0,0,1,0],
        [1,1,0,1,0,0,1,0],
        [0,0,0,0,0,0,0,0]
    ]
];

var animSegments = [

    [
        [0,0,0,0,0,0,0,0],
        [0,0,0,1,1,0,0,0],
        [0,0,0,1,0,0,1,0],
        [0,0,1,1,1,1,0,0],
        [0,1,0,1,1,0,0,0],
        [0,0,0,1,1,1,0,0],
        [0,1,1,1,0,1,0,0],
        [0,0,0,0,0,0,1,0]
    ],
    [
        [0,0,0,1,1,0,0,0],
        [0,0,0,1,0,0,0,0],
        [0,0,1,1,1,0,1,0],
        [0,0,1,1,1,1,0,0],
        [0,0,0,1,1,0,0,0],
        [0,0,1,1,0,1,0,0],
        [0,1,0,0,0,1,1,0],
        [0,0,0,0,0,0,1,0]
    ],
    [
        [0,0,0,1,1,0,0,0],
        [0,0,0,1,0,0,0,0],
        [0,0,0,1,1,0,0,0],
        [0,0,0,1,1,1,0,0],
        [0,0,0,1,1,0,0,0],
        [0,0,1,1,1,1,0,0],
        [0,0,1,0,1,0,0,0],
        [0,1,0,0,1,1,0,0]
    ],
    [
        [0,0,0,1,1,0,0,0],
        [0,0,0,1,0,0,0,0],
        [0,0,0,1,1,0,0,0],
        [0,0,1,1,1,1,0,0],
        [0,0,0,1,1,0,0,0],
        [0,0,0,1,0,1,0,0],
        [0,0,1,1,0,1,0,0],
        [0,0,1,0,0,1,0,0]
    ],
    [
        [0,0,0,0,0,0,0,0],
        [0,0,0,1,1,0,0,0],
        [0,0,0,1,0,0,0,0],
        [0,0,1,1,1,0,1,0],
        [0,0,1,1,1,1,0,0],
        [0,0,0,1,1,0,0,0],
        [0,1,1,0,0,1,1,0],
        [0,1,0,0,0,0,0,0]
    ]

];

var emptyLine = [0,0,0,0,0,0,0,0];
var decimalLine = [];
for (var i = 1; i <= 8; ++i) {
    if (i == lineHeight + 5) {
        decimalLine.push(1);
    } else {
        decimalLine.push(0);
    }
}

function transpose(seg) {

    var transposed = [];
    for (var line = 0; line < seg[0].length; ++line) {
        transposed.push([]);
    }

    for (var y = 0; y < seg.length; ++y) {
        for (var x = 0; x < seg[y].length; ++x) {
            transposed[x].push(seg[y][x]);
        }
    }

    return transposed;
}

// used to determine if the bottom left pixel is used by the font
// this allows us to best position the decimal point
function notUsingBottomLeftPixel(num) {
    switch (num) {
        case 0:
        case 2:
        case 4:
        case 6:
        case 7:
        case 8:
        case 9:
            return true;
    }

    return false;
}
    

for (var s = 0; s < animSegments.length; ++s) {
    animSegments[s] = transpose(animSegments[s]);
}

var Char = {
    Empty: 10,
    Tick: 11,
    Unknown: 12,
    Error: 13
};

function getDigits(num, allowDecimalPoint) {

    // deduce 2 digit number
    if (num > 99) { 
        num = 99;  
    }  

    var leftDigit = Math.floor(num / 10);
    var rightDigit = Math.floor(num % 10);

    // don't display left digit if it's 0
    if (leftDigit == 0) leftDigit = Char.Empty;

    // deal with decimal points
    var showDecimalPoint = false;    
    if (allowDecimalPoint && num < 10) {
        showDecimalPoint = true;

        leftDigit = rightDigit;

        // get the first decimal number
        rightDigit = (Math.round(num * 10)) % 10;
    }

    // rotate everything 90 degrees
    // lines on the display = vertical of our font
    function addLines(lines, digit, spaceAtEnd) {

        var segment = font[digit];
        
        for (var x = 0; x < 3; ++x) {
            var line = [];
            // line height
            for (var y = 0; y < lineHeight; ++y) {
                line.push(0);
            }

            // character        
            for (var y = 0; y < 5; ++y) {
                line.push(segment[y][x]);
            }   

            while (line.length < 8) line.push(0);         

            lines.push(line);
        }
    }

    var lines = [];
    addLines(lines, leftDigit, true);
    
    if (showDecimalPoint) {
         if (notUsingBottomLeftPixel(rightDigit)) {
            lines.push(emptyLine);
            lines.push(decimalLine);
         } else {             
            lines.push(decimalLine);
            lines.push(emptyLine);
         }
    }
    else {
        lines.push(emptyLine);
        lines.push(emptyLine);
    }   

    addLines(lines, rightDigit, false);

    return lines;
}

var Controller = function(disp, index) {

    this.display = disp;
    this.index = index;

    this.blinkInterval = null;
    this.blinkValue = defaultBrightness;

    this.clear = function() {
        disp.setActiveController(index);
        disp.clearDisplay();
        disp.setDisplayIntensity(defaultBrightness);
    }

    this.write = function(segments) {
        disp.setActiveController(index);
        for (i = 0; i < 8; ++i) {
            disp.setDigitSegments(i, segments[i]);
        }
    }

    this.writeUnknown = function() {
        this.write(font[Char.Unknown]);
    }

    this.writeNumber = function(num) {
        this.write(getDigits(num));
    }

    this.writeDecimal = function(num) {
        this.write(getDigits(num, true));
    }

    this.writeTick = function() {
        this.write(font[Char.Tick]);
    }

    this.writeError = function() {
        this.write(font[Char.Error]);
    }

    this.blink = function(time) {
        var fadeUp = true;
        var self = this;
        if (this.blinkInterval) {
            this.blinkOff();
        }
        this.blinkInterval = setInterval(function() {
            if (fadeUp) {
                self.blinkValue++;
            }
            else {
                self.blinkValue--;
            }
            if (self.blinkValue >= 15) {
                self.blinkValue = 15;
                fadeUp = false;
            } else if (self.blinkValue < 0) {
                self.blinkValue = 0;
                fadeUp = true;
            }

            disp.setActiveController(index);
            disp.setDisplayIntensity(self.blinkValue);

        }, time);
    };

    this.blinkOff = function() {
        clearInterval(this.blinkInterval);
        this.blinkInterval = null;

        disp.setActiveController(index);
        disp.setDisplayIntensity(defaultBrightness);
    }

    this.playAnim = function() {
        var anim = 0;

        this.animInterval = setInterval(function() {

            disp.setActiveController(index);
            for (i = 0; i < 8; ++i) {
                disp.setDigitSegments(i, animSegments[anim][i]);
            }

            ++anim;
            if (anim >= 5) {
                anim = 0;
            }

        }, 5000 / 60);        
    }

    this.stopAnim = function() {
        clearInterval(this.animInterval);
    }

}

module.exports = function() {

    var disp = new MAX7219("/dev/spidev0.0", numControllers);

    this.controllers = [
        new Controller(disp, 3),
        new Controller(disp, 2),
        new Controller(disp, 1),
        new Controller(disp, 0)
    ];

    this.init = function() {
        this.show();
    }

    this.show = function() {
        for (var c = 0; c < numControllers; ++c) {

            disp.setActiveController(c);
            disp.setDecodeNone();
            disp.setScanLimit(8);
            disp.startup();
        }
    }

    this.hide = function() {
        for (var c = 0; c < numControllers; ++c) {

            disp.setActiveController(c);
            disp.clearDisplay();
            disp.shutdown();
        }        
    }

    this.getController = function(index) {
        return this.controllers[index];
    }

};
