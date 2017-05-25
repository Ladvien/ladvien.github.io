---
layout: post
title: ESPER -- ESP8266 Serial Communication Web Server
categories: robot
excerpt:
tags: [robot, C#, ESP8266, Arduino, HTTP]
image: 
    feature: 
comments: true
custom_css:
custom_js: 
---
## Lumi3

This project is meant as stepping stone to implement Lumi2\.  The Lumi projects I've been working on are over-the-air uploaders of Arduino / AVR programs to Atmega and Atiny chips which are programmed with the TinySafeBoot bootloader.  The goal is to allow the user to select either WiFi or Bluetooth, create a connection to either an ESP8266 or HM-1X device, and upload whatever program to an AVR connected to the wireless receiving device.  

The last iteration of Lumi was written in Windows Universal Apps SDK.  Unfortunately, the code-base turned into spaghetti.  I've diagnosed the issues to be due to God-modules, poor understand of object-oriented design, and rushed coding.  Passion got ahead of my ability.  Here's my history on the project so far:

1.  [Vorpal Hoff](https://github.com/Ladvien/LPC1114_Hex_Upload_Reroll) -- an attempt at wireless uploading with a HM-11 and LPC1114 combination.  Written in C / C++.
2.  [HM-1X Aid](https://github.com/Ladvien/HM-1X_Aid_v01) -- this project was meant to be a GUI on top of the HM-1X modules, allowing "easy" editing of the module's behavior.  It was my first venture into C#.  (It's sooo bad;although, the serial communication was asynchoronous.)
3.  [Lumi1](https://github.com/Ladvien/Lumi_TinySafeBoot_Uploader) -- this the first succesful TinySafeBoot uploader.  It was written in C# using the .NET WinForms.  Unfortunately, it was synchoronou.  And I was finished with the USB-to-UART uploader before I realized there was no easy BLE support in WinForm's .NET.
4.  [Lumi2](https://github.com/Ladvien/Lumi_Windows_App) --  this is where things start getting better.  It is the current version of the TSB wireless bootloader.  It works, is asynchronous, and has BLE support.  Unfortunately, the code turned into spaghetti.  This is largely due to my poor understanding of object-oriented design.  It has god-modules, a horrifically implemented SerialEvent response protocol, poor encapsulation, no polymorphism.  It's just a mess.

<iframe allowfullscreen="" frameborder="0" height="320" scrolling="no" src="//www.youtube.com/embed/mLfFbrijakc" width="640"></iframe>

Now, I'm going for the third attempt.  I'll attempt to correct for the above errors _and_ implement the WiFi uploading, with the receiving device being the ESP8266.

[Lumi3](https://github.com/Ladvien/Lumi3)

Here is sketch of the design:

![Lumi2_rough_Sketch_v2.png](/../../images/Lumi2_rough_Sketch_v2.png)

## ESPER

ESPER is a mini project to troubleshoot how the Lumi3 program will interact with a remote device.  

There are two sets of code below, the first is the C# side of the interaction.  It sets up an HttpClient with POST and GET calls.  The one real variant which makes C# ESPER code a little bit different is the asynchronous polling POST request for data.  This is meant to imitate a serial communication RX line across a WiFi signal.  

The other code is Arduino C and sets up the ESP8266 device as an HTTP WebServer.  It can then take data received from the UART and print it to the server.  This allows the C# polling POST call to pick up the data.  Of course, in the same manner, there is a the Arduino code is setup to receive data from the HTTP Client and transmit it across the UART.  _Voila!_ Serial communication across WiFi.  Now all we need is the annoying autobauding sounds and we will be firmly back in the 1990s.  

## Update 2/7/2016

![ESPER_ui_1.PNG](/../../images/ESPER_ui_1.PNG)I've added a search method to the ESPER class.  Basically, this iterates over a range POSTing a name request for the ESPER.  When the C# code discovers an ESPER, then it adds it to an array.  I'm pretty happy with it.  

I did run into an issue trying to use Windows.HttpClient, as there doesn't seem to be a way to adjust the timeout.  The default was like 3 seconds, which is way too long.  Therefore, the System.Net.HttpClient was used, since it has a Timeout property which takes a Timespan.    

C# 

{% highlight csharp %}
 public async Task<List<Uri>> SearchForESPER(int startingSub, int endingSub)
        {
            var httpClient = new System.Net.Http.HttpClient();
            httpClient.Timeout = new TimeSpan(0, 0, 0, 0, 300);
            var webService = WebServerUrl + "name";
            List<Uri> discoveredIPs = new List<Uri>();
            EsperProgressBar.Maximum = endingSub - startingSub;

            for (int i = startingSub; i < endingSub; i++)
            {
                try
                {
                    string ip = "http://192.168.1." + i.ToString() + "/";
                    var resourceUri = new Uri(ip);
                    var response = await httpClient.PostAsync(resourceUri, null);
                    if(response.IsSuccessStatusCode == true)
                    {
                        discoveredIPs.Add(resourceUri);
                    }
                    response.Dispose();
                }
                catch (Exception ex)
                {

                }
                EsperProgressBar.Value += 1;
            }
            EsperProgressBar.Value = 0;
            EsperProgressBar.IsEnabled = false;
            return discoveredIPs;
        }

.......

        private async void Search_Click(object sender, RoutedEventArgs e)
        {
            Esper esper = new Esper(ProgressBar);
            var discoveredIPs = await esper.SearchForESPER(98, 130);

            foreach(Uri ip in discoveredIPs) {
                IPComboBox.Items.Add(ip.Host);
            }
            IPComboBox.SelectedIndex = 0;
        }
{% endhighlight %}

C# ESPER

{% highlight csharp %}
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.Linq;
    using System.Runtime.InteropServices.WindowsRuntime;
    using System.Text;
    using System.Threading;
    using System.Threading.Tasks;
    using Windows.Storage.Streams;
    using Windows.Web.Http;

    namespace ESPER
    {
        class Esper
        {
            const int defaultPollingDelay = 50; 

            HttpClient httpClient = new HttpClient();
            CancellationTokenSource PollingForDataCancelToken = new CancellationTokenSource();

            private string WebServerUrl { get; set; }
            private int PollingDelay { get; set; } = defaultPollingDelay;
            private bool PollingActive { get; set; } = false;

            public Esper(string consumerUrl)
            {
                WebServerUrl = consumerUrl;
            }

            public async void PostByteArray(byte[] data)
            {

                var httpClient = new HttpClient();
                var webService = WebServerUrl + "data";
                var resourceUri = new Uri(WebServerUrl);
                try
                {
                    IBuffer buffer = data.AsBuffer();
                    using (HttpBufferContent content = new HttpBufferContent(buffer))
                    {
                        content.Headers.Add("Content-Type", "text/html; charset=utf-8");
                        content.Headers.ContentLength = buffer.Length;
                        var response = await httpClient.PostAsync(resourceUri, content);
                        Debug.WriteLine(response);
                    }
                }
                catch (TaskCanceledException ex)
                {
                    // Handle request being canceled due to timeout.
                }
            }

            public async void PostString(string str)
            {
                var httpClient = new HttpClient();
                var webService = WebServerUrl + "string";
                var resourceUri = new Uri(webService);
                try
                {
                    using (HttpStringContent content = new HttpStringContent(str, Windows.Storage.Streams.UnicodeEncoding.Utf8))
                    {
                        content.Headers.ContentLength = (ulong)str.Length;
                        using (var response = await httpClient.PostAsync(resourceUri, content)) { };
                    }
                }
                catch (TaskCanceledException ex)
                {
                    // Handle request being canceled due to timeout.
                }
            }

            public void Start()
            {
                if(false == PollingActive)
                {
                    PollingActive = true;
                    PollingForDataCancelToken = new CancellationTokenSource();
                    PollWebServerDataAvailability();
                }
            }

            public void End()
            {
                PollingActive = false;
                PollingForDataCancelToken.Cancel();
            }

            public void SetPollingDelay(int delayInMilliseconds) { PollingDelay = delayInMilliseconds; }

            private void PollWebServerDataAvailability()
            {   
                try
                {
                    Task.Run(async () =>
                    {
                        while (true)
                        {
                            if (PollingForDataCancelToken.IsCancellationRequested)
                            {
                                PollingForDataCancelToken.Token.ThrowIfCancellationRequested();
                            }
                            await GetData();
                            await Task.Delay(PollingDelay);
                        }
                    }, PollingForDataCancelToken.Token);
                } catch (TaskCanceledException)
                {
                    // TODO: Add cancelation callback here.
                }
            }

            public async Task<string> GetData()
            {
                var cts = new CancellationTokenSource();
                cts.CancelAfter(TimeSpan.FromSeconds(30));

                var webService = WebServerUrl + "buffer";
                var resourceUri = new Uri(webService);
                try
                {
                    HttpResponseMessage response = await httpClient.PostAsync(resourceUri, null);
                    var message = await response.Content.ReadAsStringAsync();
                    if (message != "") { Debug.WriteLine(message); }
                    response.Dispose();
                    cts.Dispose();
                    return message;
                }
                catch (TaskCanceledException ex)
                {
                    // Handle request being canceled due to timeout.
                    return "";
                }
                return "";
            }
        }
    }

{% endhighlight %}

{% highlight c %}  
Arduino ESPER​ WebServer

    /*
     * This code has been adapted from:
     *    "SDWebServer - Example WebServer with SD Card backend for esp8266
     *    Copyright (c) 2015 Hristo Gochkov. All rights reserved.
     *    This file is part of the ESP8266WebServer library for Arduino environment."
     * 
    */

    const char* ssid = "SSID";
    const char* password = "password";

    // Gross.  Global variables.  These are used for collecting Serial Data.
    String inputBuffer = "";         

    #include <ESP8266WiFi.h>
    #include <WiFiClient.h>
    #include <ESP8266WebServer.h>
    #include <ESP8266mDNS.h>

    const int ledPin = 2;
    const char* host = "esp8266sd";

    ESP8266WebServer server(80);

    void returnOK() {
      server.send(200, "text/plain", "");
    }

    void returnFail(String msg) {
      server.send(500, "text/plain", msg + "\r\n");
    }

    void debugWebRequest(){
      String message = "";
      message += "URI: ";
      message += server.uri();
      message += "\nMethod: ";
      message += (server.method() == HTTP_GET)?"GET":"POST";
      message += "\nArguments: ";
      message += server.args();
      message += "\n";
      for (uint8_t i=0; i<server.args(); i++){
        message += " NAME:"+server.argName(i) + "\n VALUE:" + server.arg(i) + "\n";
      }
      server.send(404, "text/plain", message);
      Serial.print(message);
    }

    void getSerialBuffer(){
      Serial.print("Sent data: ");
      Serial.println(inputBuffer);
      server.send(200, "text/plain", inputBuffer);
      inputBuffer = "";
    }

    void handleUnknownPost(){
      returnOK();
      //debugWebRequest();  
      Serial.print("Unknown POST.");
    }

    void handleStringPost(){
      returnOK();
      //debugWebRequest();
      Serial.print("Got data: ");
      Serial.print(server.arg(0));
    }

    void handleDataPost(){
      returnOK();
      //debugWebRequest();
      Serial.print("Data POST.");
    }

    void handleNotFound(){
      returnOK();
      //debugWebRequest();
      Serial.print("Resource not found POST.");
    }

    void setup(void){
      pinMode(ledPin, OUTPUT);

      Serial.begin(115200);
      Serial.setDebugOutput(true);
      Serial.print("\n");
      WiFi.begin(ssid, password);
      Serial.print("Connecting to ");
      Serial.println(ssid);

      digitalWrite(ledPin, HIGH);
      bool isLedPinOn = true;

      // Wait for connection
      uint8_t i = 0;
      while (WiFi.status() != WL_CONNECTED && i++ < 20) {//wait 10 seconds
        delay(500);
        Serial.print(".");
        isLedPinOn = !isLedPinOn;  

      }
      Serial.println("");
      if(i == 21){
        digitalWrite(ledPin, HIGH);
        Serial.print("Could not connect to");
        Serial.println(ssid);
        while(1) { 
          digitalWrite(ledPin, isLedPinOn ? HIGH : LOW);
          delay(200); 
        }
      }

      digitalWrite(ledPin, LOW);  

      Serial.print("Connected! IP address: ");
      Serial.println(WiFi.localIP());

      if (MDNS.begin(host)) {
        MDNS.addService("http", "tcp", 80);
        Serial.println("MDNS responder started");
        Serial.print("You can now connect to http://");
        Serial.print(host);
        Serial.println(".local");
      }

      server.on("/", HTTP_POST, handleUnknownPost);
      server.on("/string", HTTP_POST, handleStringPost);
      server.on("/data", HTTP_POST, handleDataPost);
      server.on("/buffer", HTTP_POST, getSerialBuffer);
      server.onNotFound(handleNotFound);

      server.begin();
      Serial.println("HTTP server started");
    }

    void loop(void){
      server.handleClient();
      while (Serial.available()) {
        char inChar = (char)Serial.read();
        inputBuffer += inChar;
      }
    }

{% endhighlight %}