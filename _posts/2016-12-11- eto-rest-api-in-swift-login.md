---
layout: post
title: ETO REST API in Swift
categories: robots
excerpt:
tags: [ETO, HMIS, iOS, REST, Swift]
image: ETO_and_Swift_0.png
comments: true
custom_css:
custom_js: 
---
## Logging in to ETO

This code base has become a bit of a pet project.  It uses [Alamofire](https://github.com/Alamofire/Alamofire) to create GET and POST requests against [Efforts to Outcomes REST API.](https://services.etosoftware.com/)  This enables native applications to interact with our Homeless Management Information System ([HMIS](https://www.hudexchange.info/programs/hmis/)) database.  I've been coding it to practice the craft.  Also, there are a few operations in our [continuum of care](https://www.hudexchange.info/programs/coc/) which could be improved by creating native applications, as opposed to using webapplications.  For example, street outreach teams are often without their computer, given the bulk.  But rarely is a street outreach specialist without a mobile device.  This would allow the outreach specialist to access all data regardless of physical settings.  

Identified benefits from native applications:

*   Self check in at shelters
*   Using TouchPoint responses instead of Points-of-Service for data activities, such as shelter check-in.
*   Street outreach
*   Leveraging existing hardware (most staff have smartphones)
*   User friendly UIs
*   Data aggregation through automated queries
*   Point-in-Time Count mobile-device survey
*   Collecting GPS coordinates of street outreach and point-and-time activities

This will be a documentation journal, given the project will most likely evolve to be bigger than my organic memory could manage.

### Login()

Setting up a session which is authorized to request information from an ETO databse has several steps.  The first, being the user has an actual account with the database 

1.  Take username, password, and webservice URL and make POST request.
2.  Async-wait for response
3.  Unwrap response data.
4.  If POST request returned 200-299, request was success. If failed, handle.
5.  When successful, convert the return JSON data.  If failed, handle.
6.  Pull SSOAuthToken from JSON data.
7.  If it was found in JSON data, call GetListOfEntperises() passing SSOAuthToken
8.  Async-wait returned list of Enterprises.
9.  Call completion callback meothd with parameter "Success"

{% highlight swift %}
//
//  ETOWebServiceLogin.swift
//  ETO-TouchPoint-Test
//
//  Created by Thomas Ladvien on 10/13/16.
//  Copyright © 2016 Honeysuckle Hardware. All rights reserved.
//

import Foundation
import Alamofire
import SwiftyJSON

public func login(currentSessionInfo: SessionInfo, username: String, password: String, completion: @escaping (_ response: ReturnInfoWithString) -> Void){

        // ETO Authentication Web Service.
        let SSOAuthenticateService = "https://services.etosoftware.com/API/Security.svc/SSOAuthenticate/"

        let parameters: Parameters = [
            "security": [
                "Email": username,
                "Password": password,
            ]
        ];

        var returnInfo = ReturnInfoWithString()

        // TODO: Check for HTTP response code.
        let request = Alamofire.request(SSOAuthenticateService, method: .post, parameters: parameters, encoding: JSONEncoding.default).validate().responseData { response in
            if let data = response.data {

                switch response.result {
                case .success:
                    let json = JSON(data: data)
                    returnInfo.value = json["SSOAuthenticateResult"]["SSOAuthToken"].stringValue
                    if ("00000000-0000-0000-0000-000000000000" != returnInfo.value) {
                        returnInfo.callback = self.prepareResponse(targetResponse: .Success)
                        currentSessionInfo.SSOAuthToken = returnInfo.value
                        completion(returnInfo)
                    } else {
                        returnInfo.callback = self.prepareResponse(targetResponse: .NoSSOAuthToken)
                        completion(returnInfo)
                    }
                case .failure:
                    returnInfo.callback = self.prepareResponse(targetResponse: .HTTPRequestFail)
                    completion(returnInfo)
                }

            } else {
                returnInfo.callback = self.prepareResponse(targetResponse: .UnknownFailure)
                completion(returnInfo)
            }
        }
        if(DebugMode){
            debugPrint(request)
        }
    }
{% endhighlight %}

Ok, let me break down steps in this function.

1.  Take username, password, and webservice URL and make POST request.
2.  Async-wait for response
3.  Unwrap response data.
4.  If POST request returned 200-299, request was success. If failed, handle.
5.  When successful, convert the return JSON data.  If failed, handle.
6.  Pull SSOAuthToken from JSON data.
7.  If it was found in JSON data, call GetListOfEntperises() passing SSOAuthToken
8.  Async-wait returned list of Enterprises.
9.  Call completion callback meothd with parameter "Success"