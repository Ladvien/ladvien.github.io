---
layout: post
title: Porting DRV8830 I2C Motor Driver Code to NodeJS
categories: Arch Linux
excerpt: How to setup NodeJS on Raspberry Pi Zero W
tags: [NodeJS, i2c, Arch Linux, Raspberry Pi Zero W, linux]
series: RAN
image: 
    feature: RAN_Robot.png
comments: true
custom_css:
custom_js: 
---

Earlier in this article series I showed how to install NodeJS -- it was pretty simple with an install script.  However, I thought I better show how I actually worked with NodeJS to create my little 1b1 driver code.

Again, simple, I used others hard work.  Specifically, Michael Hord with Sparkfun's MiniMoto library.

* [MiniMoto Arduino Library](https://github.com/sparkfun/SparkFun_MiniMoto_Arduino_Library/tree/V_1.1.0)

Really, all I did was tweak the code a little bit to fit JavaScript syntax.

The result
{% highlight js %}
'use strict';
var i2c = require('i2c-bus');
var sleep = require('sleep');

// Commands
const FAULT_CMD         = 0x01;

// Fault constants
const CLEAR_FAULT       = 0x80;
const FAULT             = 0x01;
const ILIMIT            = 0x10;
const OTS               = 0x08;
const UVLO              = 0x04;
const OCP               = 0x02;

// Direction bits
const FORWARD           = 0b00000010;
const REVERSE           = 0b00000001;
const HI_Z              = 0b00000000;
const BRAKE             = 0b00000011;

module.exports = class Motor {

    /** 1. Add "inverse" motor option
     *  2. Add option to clear fault on each motor call.
     *  
     */

    constructor(address, i2cbus, options = undefined) {        
        this.address = address
        this.i2cbus = i2cbus
        this.options = options
    }

    getFault() {

        var fault = {
            message: '',
            code: 0
        }
    
        var faultCode;
        try {
            this.i2cbus.readByteSync(this.address, FAULT_CMD);
        } catch (e) {
            console.log(`Read fault failed: ${e}`)
        }
        
        fault.code = faultCode;
    
        if (faultCode !== undefined) {
            console.log(faultCode);
            fault.message = 'Unknown fault.';
            switch (faultCode){
                case FAULT:
                    fault.message = 'Unknown fault.'
                    break;
                case ILIMIT:
                    fault.message = 'Extended current limit event'
                    break;
                case OTS:
                    fault.message = 'Over temperature.'
                    break;
                case UVLO:
                    fault.message = 'Undervoltage lockout.'
                    break;
                case OCP:
                    fault.message = 'Overcurrent lockout.'
                    break;
                default:
                    fault.message = 'Unknown fault.'
                    break;
            }
            return fault;
        } else {
            fault.message = 'No fault';
            return fault;
        }
    }
    
    clearFault() {
        var fault = this.getFault(this.address);
        if (fault.code) {
            try {
                var success = this.i2cbus.writeByteSync(this.address, FAULT_CMD, CLEAR_FAULT);
                if (success) { return true; }
            } catch (e) {
                console.log(`Failed to clear faults: ${e}`)
            }
        }
        return false;
    }
    
    drive(speed = 0, direction = undefined, checkFault = false) {
        // The speed should be 0-63.
        if (checkFault) { this.clearFault();}
        if (direction === undefined) {        
            direction = speed < 0;
            speed = Math.abs(speed);
            if (speed > 63) { speed = 63; }
            speed = speed << 2 ;
            if (direction) { speed |= FORWARD; }
            else           { speed |= REVERSE; }
        } else {
            speed = speed << 2 ;
            speed |= direction;
        }
        try {
            this.i2cbus.writeByteSync(this.address, 0x00, speed);
        } catch (e){
            console.log('Drive command failed.')
        }
    }
    
    brake() {
        try {
            this.drive(0, HI_Z);
        } catch (e) {
            console.log('Brake command failed.')
        }
    }
    
    
    stop() {
        try {
            this.drive(0, BRAKE);
        } catch (e) {
            console.log('Brake command failed.')
        }
    }
}
{% endhighlight %}

There's a lot left to do, but it works.

Todo List:
1. Have the constructor accept an `options` object
2. Add `read()` to get the current speed which a motor is set.
3. Refactor option to clear faults on write to be determined during construction
4. Add acceleration and deceleration algorithms add functions.
5. Create an async polling of fault codes.

But! For now it works.

Also, or those who are like, "You stole code, dewd! Not cool."  Mhord's code has a [beerware](https://en.wikipedia.org/wiki/Beerware) license.  I sent this email to Sparkfun in regards to the license and how I might pay Sparkfun back for their work.


>Hey Mr. Hord,
>
>I'm in the process of porting your DRV8830 library to Node--I wanted to make sure I give appropriate credit. 
>
>>https://github.com/Ladvien/drv8830 
>
>Also, was going to ship some beer to Sparkfun--in respect of the beerware license.  Just let me know what kind.
>
>Lastly, I wanted to make sure Sparkfun benefits.  It looks like the DRV8830 TinyMoto board has been discontinued. > Should I recommend people roll their own...or _gasp_ get something off a slow ship from China?
>---Thomas
>aka, Ladvien

But I didn't hear back.  _C'est la vie_
