/*********************************************************************
This is an example for our Monochrome OLEDs based on SSD1306 drivers
  Pick one up today in the adafruit shop!
  ------> http://www.adafruit.com/category/63_98
This example is for a 128x32 size display using I2C to communicate
3 pins are required to interface (2 I2C and one reset)
Adafruit invests time and resources providing this open source code, 
please support Adafruit and open-source hardware by purchasing 
products from Adafruit!
Written by Limor Fried/Ladyada  for Adafruit Industries.  
BSD license, check license.txt for more information
All text above, and the splash screen must be included in any redistribution
*********************************************************************/

#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>


#define OLED_RESET 4
Adafruit_SSD1306 display(OLED_RESET);

#define NUMFLAKES 10
#define XPOS 0
#define YPOS 1
#define DELTAY 2


#define LOGO16_GLCD_HEIGHT 16 
#define LOGO16_GLCD_WIDTH  16 

#if (SSD1306_LCDHEIGHT != 32)
#error("Height incorrect, please fix Adafruit_SSD1306.h!");
#endif

#include <SoftwareSerial.h>
SoftwareSerial hm10Serial(9, 8); // RX, TX


void setup()   {                
  Serial.begin(9600);
  hm10Serial.begin(9600);  

  // by default, we'll generate the high voltage from the 3.3v line internally! (neat!)
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);  // initialize with the I2C addr 0x3C (for the 128x32)

  // Clear the buffer.
  display.clearDisplay();

  // text display tests
  display.setTextSize(1);
  display.setTextColor(WHITE);
  
  display.setTextSize(2);
  display.println("You turn");
  display.print("me on!");
  
  display.display();
  delay(250);
}


void loop() {
    if(hm10Serial.available() > 0){
        display.setCursor(0,0);
        display.clearDisplay();
        display.setTextColor(WHITE);
        display.setTextSize(2);         
        display.print(String(hm10Serial.available()));
        Serial.print(String(hm10Serial.available()));
        display.display();
        hm10Serial.flush();
    }
    delay(300);
    
    
}



