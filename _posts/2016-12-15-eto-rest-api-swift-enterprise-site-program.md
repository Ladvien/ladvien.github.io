---
layout: post
title: ETO REST API in Swift -- Enterprise, Site, and Program Select
categories: HMIS, iOS
excerpt:
tags: [ETO, HMIS, iOS, REST, Swift]
image: ETO_and_Swift_0.png
comments: true
custom_css:
custom_js: 
---

1.  Unwrap SSOAuthToken.  Else, handle error.
2.  Create request from webservice and SSOAuthToken.
3.  Make a GET request.
4.  Async-wait for response
5.  Unwrap response data.
6.  If GET request returned 200-299, request was success. If failed, handle.
7.  When successful, convert the return JSON data.  If failed, handle.
8.  Get Enterprise Names and enterpriseGUUID string from JSON data.
9.  Add the enterpriseGUUID string to a Dictionary using the Enterprise Names as the Key
10.  Call completion callback meothd with parameter "Success"

{% highlight swift %}
public func getListOfEnterprisesAvailable(currentSessionInfo: SessionInfo, completion: @escaping (_ response: ReturnInfoWithDictionary) -> Void){

    let SSOAuthToken = currentSessionInfo.SSOAuthToken!

    var returnInfo = ReturnInfoWithDictionary()
    var enterpriseDictionary = Dictionary<String, String>()

    let GetSSOEnterprisesService = "https://services.etosoftware.com/API/Security.svc/GetSSOEnterprises/\(SSOAuthToken)"

    let request = Alamofire.request(GetSSOEnterprisesService, method: .get, parameters: nil, encoding: URLEncoding.default).validate().responseJSON { response in

        switch(response.result){
            case .success:
                if let jsonData = response.data {
                    let enterprisesList = JSON(data: jsonData)
                    for i in 0..<enterprisesList.count {
                        let key = enterprisesList[i]["Key"].string!
                        let value = enterprisesList[i]["Value"].string!
                        enterpriseDictionary.updateValue(key, forKey: value)
                    }
                    returnInfo.dictionary = enterpriseDictionary
                    returnInfo.callback = self.prepareResponse(targetResponse: .Success)
                    completion(returnInfo)
                } else {
                    returnInfo.callback = self.prepareResponse(targetResponse: .FailedToGetEnterpriseList)
                    completion(returnInfo)
                }
                break;
            case .failure:
                returnInfo.callback = self.prepareResponse(targetResponse: .HTTPRequestFail)
                completion(returnInfo)
                break;
        }
    }
    if(DebugMode){
        debugPrint(request)
    }
}

public func setEnterprise(currentSessionInfo: SessionInfo, selectedEnterprise: String){
    let etoUserDefaults = ETOUserDefaults()
    etoUserDefaults.setUserDefault(key: .enterpriseID, value: selectedEnterprise)
    currentSessionInfo.setEnterprise(chosenEnterprise: selectedEnterprise)
}
{% endhighlight %}

1.  Unwrap SSOAuthToken.  Else, handle error.
2.  Unwrap selectedEnterpriseGuuid.  Else, handle error.
3.  Create request from  webservice URL, SSOAuthToken, Enterprise GUUID.
4.  Make a GET request.
5.  Async-wait for response
6.  Unwrap response data.
7.  If GET request returned 200-299, request was success. If failed, handle.
8.  When successful, convert the return JSON data.  If failed, handle.
9.  Get Site Name and Site Number from JSON data.
10.  Add the Site Number to a Dictionary using the Site Name as the Key
11.  Call completion callback meothd with parameter "Success"


{% highlight swift %}
public func getListOfSites(currentSessionInfo: SessionInfo, completion: @escaping (_ response: ReturnInfoWithDictionary) -> Void){

    var returnInfo = ReturnInfoWithDictionary()

    let SSOAuthToken = currentSessionInfo.SSOAuthToken ?? ""
    let selectedEnterpriseGuuid = currentSessionInfo.selectedEnterprise()

    if "" == SSOAuthToken {
        returnInfo.callback = prepareResponse(targetResponse: .NoSSOAuthToken)
        completion(returnInfo)
    } else if "" == selectedEnterpriseGuuid {
        returnInfo.callback = prepareResponse(targetResponse: .NoEnterpriseIDSelected)
        completion(returnInfo)
    } else {

        let GetSSOSitesService = "https://services.etosoftware.com/API/Security.svc/GetSSOSites/\(SSOAuthToken)/\(selectedEnterpriseGuuid)"

        let request = Alamofire.request(GetSSOSitesService, method: .get, parameters: nil, encoding: URLEncoding.default).validate().responseJSON { response in

            switch(response.result){
            case .success:
                if let jsonData = response.data {
                    let siteList = JSON(data: jsonData)
                    for i in 0..<siteList.count {
                        let keyInt = siteList[i]["Key"].int!
                        let key = String(keyInt)
                        let value = siteList[i]["Value"].string!
                        returnInfo.dictionary.updateValue(key, forKey: value)
                    }
                    returnInfo.callback = self.prepareResponse(targetResponse: .Success)
                    completion(returnInfo)
                } else {
                    returnInfo.callback = self.prepareResponse(targetResponse: .FailedToGetSiteList)
                    completion(returnInfo)
                }
                break;
            case .failure:
                returnInfo.callback = self.prepareResponse(targetResponse: .HTTPRequestFail)
                completion(returnInfo)
                break;
            }
        }
        if(DebugMode){
            debugPrint(request)
        }
    }       
}
{% endhighlight %}

1.  Unwrap SSOAuthToken.  Else, handle error.
2.  Unwrap selectedEnterpriseGuuid.  Else, handle error.
3.  Create request from webservice, SSOAuthToken, and Enterprise GUUID.
4.  Make a GET request.
5.  Async-wait for response
6.  Unwrap response data.
7.  If GET request returned 200-299, request was success. If failed, handle.
8.  When successful, convert the returned JSON data.  If failed, handle.
9.  Assign the Site sessionSecurityToken from the token in JSON data.
10.  Call completion callback method with parameter "Success"


{% highlight swift %}
public func setSelectedSite(currentSessionInfo: SessionInfo, completion: @escaping (_ response: ReturnInfoWithString)-> Void){

  let etoUserDefault = ETOUserDefaults()
  var returnInfo = ReturnInfoWithString()

  let SSOAuthToken = currentSessionInfo.SSOAuthToken ?? ""
  let selectedEnterpriseGuuid = currentSessionInfo.selectedEnterprise()
  let selectedSite = currentSessionInfo.selectedSite()

  etoUserDefault.setUserDefault(key: .siteID, value: selectedSite)

  var secondsFromGMT: Int { return NSTimeZone.local.secondsFromGMT() }
  let utcOffsetInHours = String(secondsFromGMT / 60)

  if "" == SSOAuthToken {
      returnInfo.callback = prepareResponse(targetResponse: .NoSSOAuthToken)
      completion(returnInfo)
  } else if "" == selectedEnterpriseGuuid {
      returnInfo.callback = prepareResponse(targetResponse: .NoEnterpriseIDSelected)
      completion(returnInfo)
  } else if "" == utcOffsetInHours {
      returnInfo.callback = prepareResponse(targetResponse: .InvalidUTC)
      completion(returnInfo)
  } else {
      let body = "https://services.etosoftware.com/API/Security.svc/SSOSiteLogin/\(selectedSite)/\(selectedEnterpriseGuuid)/\(SSOAuthToken)/"
          + utcOffsetInHours
      let request = Alamofire.request(body, method: .get, encoding: URLEncoding.default).validate().responseJSON { response in

          switch(response.result){
          case .success:
              if let jsonData = response.data {
                  let sessionSecurityToken = JSON(data: jsonData)
                  currentSessionInfo.sessionSecurityToken = sessionSecurityToken.string!
                  returnInfo.value = sessionSecurityToken.string!
                  returnInfo.callback = self.prepareResponse(targetResponse: .Success)
                  completion(returnInfo)
              } else {
                  returnInfo.callback = self.prepareResponse(targetResponse: .FailedToGetSiteList)
                  completion(returnInfo)
              }
              break;
          case .failure:
              returnInfo.callback = self.prepareResponse(targetResponse: .HTTPRequestFail)
              completion(returnInfo)
              break;
          }
      }
      if(DebugMode){
          debugPrint(request)
      }
  }
}
{% endhighlight %}

1. Unwrap selectedEnterpriseGuuid.  Else, handle error.  
2. Create request from webservice URL, sessionSecurityToken, and EnterpriseGUUID  
3. Make a GET request.  
4. Async-wait for response  
5. Unwrap response data.  
6. If GET request returned 200-299, request was success. If failed, handle.  
7. When successful, convert the return JSON data.  If failed, handle.  
8. Get Program Name and Program Number from JSON data.  
9. Add the Program Number to a Dictionary using the Program Name as the Key  
10. Call completion callback meothd with parameter "Success"

{% highlight swift %}
public func getListOfPrograms(currentSessionInfo: SessionInfo, completion: @escaping (_ response: ReturnInfoWithDictionary)  -> Void){

     var returnInfo = ReturnInfoWithDictionary()

     let headers = headersWithEnterpriseIDAndSecurityToken(currentSessionInfo: sessionInfo)

     let selectedSite = currentSessionInfo.selectedSite()

     if "" == currentSessionInfo.SSOAuthToken {
         returnInfo.callback = prepareResponse(targetResponse: .NoSSOAuthToken)
         completion(returnInfo)
     } else if "" == currentSessionInfo.selectedEnterprise() {
         returnInfo.callback = prepareResponse(targetResponse: .NoEnterpriseIDSelected)
         completion(returnInfo)
     } else if "" == selectedSite {
         returnInfo.callback = prepareResponse(targetResponse: .NoSiteIDSelected)
         completion(returnInfo)
     } else {
         let body = "https://services.etosoftware.com/API/Form.svc/Forms/Program/GetPrograms/" + selectedSite

         let request = Alamofire.request(body, method: .get, encoding: URLEncoding.default, headers: headers).validate().responseJSON { response in

             switch(response.result){
             case .success:
                 if let jsonData = response.data {
                     let programList = JSON(data: jsonData).arrayValue
                     for i in 0..<programList.count {
                         let programIDInt = programList[i]["ID"].int
                         let disabled = programList[i]["Disabled"].boolValue //TODO: Make an option.
                         if !disabled {
                             if let programIDInt = programIDInt {
                                 returnInfo.dictionary.updateValue(String(programIDInt), forKey: programList[i]["Name"].string!)
                             }
                         }
                     }
                     currentSessionInfo.programsDictionary = returnInfo.dictionary
                     returnInfo.callback = self.prepareResponse(targetResponse: .Success)
                     completion(returnInfo)
                 } else {
                     returnInfo.callback = self.prepareResponse(targetResponse: .FailedToGetSiteList)
                 }
                 break;
             case .failure:
                 returnInfo.callback = self.prepareResponse(targetResponse: .HTTPRequestFail)
                 completion(returnInfo)
                 break;
             }
         }
         if(DebugMode){
             debugPrint(request)
         }
     }
}
{% endhighlight %}

1.  Unwrap selectedProgram.  Else, handle error.
2.  Unwrap selectedEnterpriseGuuid.  Else, handle error.
3.  Create request from webservice, selectedProgram, SSOAuthToken, and Enterprise GUUID.
4.  Make a GET request.
5.  Async-wait for response
6.  Unwrap response data.
7.  If GET request returned 200-299, request was success. If failed, handle.
8.  When successful, convert the returned JSON data.  If failed, handle.

10.  Call completion callback method with parameter "Success"

{% highlight swift %}
public func setSelectedProgram(currentSessionInfo: SessionInfo, setToProgramID: String,completion: @escaping (_ response: ReturnInfoWithJSON) -> Void){

  var etoUserDefaults = ETOUserDefaults()
  var returnInfo: ReturnInfoWithJSON = ReturnInfoWithJSON()

  etoUserDefaults.setUserDefault(key: .programID, value: setToProgramID)

  if "" == currentSessionInfo.SSOAuthToken {
      returnInfo.callback = prepareResponse(targetResponse: .NoSSOAuthToken)
      completion(returnInfo)
  } else if "" == currentSessionInfo.selectedEnterprise() {
      returnInfo.callback = prepareResponse(targetResponse: .NoEnterpriseIDSelected)
      completion(returnInfo)
  } else if "" == setToProgramID {
      returnInfo.callback = prepareResponse(targetResponse: .NoProgramIDSelected)
      completion(returnInfo)
  } else {
      let parameters: Parameters = [
          "ProgramID": setToProgramID
      ];

      let headers = headersWithEnterpriseIDAndSecurityToken(currentSessionInfo: currentSessionInfo)

      let body = "https://services.etosoftware.com/API/Security.svc/UpdateCurrentProgram/"

      let request = Alamofire.request(body, method: .post, parameters: parameters, encoding: JSONEncoding.default, headers: headers).validate().responseJSON { response in

          switch(response.result){
          case .success:
              if let responseData = response.data {
                  let jsonData = JSON(data: responseData)
                  currentSessionInfo.selectedProgramInfo = jsonData
                  currentSessionInfo.setProgram(chosenProgram: setToProgramID)
                  returnInfo.json = jsonData
                  returnInfo.callback = self.prepareResponse(targetResponse: .Success)
                  completion(returnInfo)
              } else {
                  returnInfo.callback = self.prepareResponse(targetResponse: .FailedToGetSiteList)
              }
              break;
          case .failure:
              returnInfo.callback = self.prepareResponse(targetResponse: .HTTPRequestFail)
              completion(returnInfo)
              break;
          }
      }
      if(DebugMode){
          debugPrint(request)
      }
  }
}

{% endhighlight %}


{% highlight swift %}
public func headersWithEnterpriseIDAndSecurityToken(currentSessionInfo: SessionInfo) -> HTTPHeaders{
    let selectedEnterpriseGuuid = currentSessionInfo.selectedEnterprise()
    let sessionSecurityToken = currentSessionInfo.sessionSecurityToken

    let headers: HTTPHeaders = [
        "Content-Type": "application/json",
        "Accept": "application/json",
        "enterpriseGuid": selectedEnterpriseGuuid,
        "securityToken": sessionSecurityToken,
        ]

    return headers
}

public func sortDictionary(dictionaryToSort: Dictionary<String, String>) -> Dictionary<String, String>{
    var dictionaryToReturn = Dictionary<String, String>()

    let sortedKeys = Array(dictionaryToSort.keys).sorted()

    for key in sortedKeys {
        if let valueForThisKey = dictionaryToSort[key] {
            dictionaryToReturn.updateValue(valueForThisKey, forKey: key)
        }
    }

    return dictionaryToReturn
}

private func prepareResponse(targetResponse: AuthenticationServiceResponseTypes) -> AuthenticationServiceResponse {
    var candidateResponse: AuthenticationServiceResponse = AuthenticationServiceResponse()
    candidateResponse.responseType = targetResponse
    candidateResponse.responseMessage = AuthenticationServiceResponseMessages[targetResponse]!
    return candidateResponse
}

public struct AuthenticationServiceResponse {
  var responseType: AuthenticationServiceResponseTypes
  var responseMessage: String

  init(){
      self.responseType = .UnknownFailure
      self.responseMessage = AuthenticationServiceResponseMessages[.UnknownFailure]!
  }
}

{% endhighlight %}


{% highlight swift %}
public struct ReturnInfoWithString {
    var value: String
    var callback: AuthenticationServiceResponse

    init(){
        self.value = ""
        self.callback = AuthenticationServiceResponse()
    }
}

public struct ReturnInfoWithDictionary {
    var dictionary: Dictionary<String, String> = Dictionary<String, String>()
    var callback: AuthenticationServiceResponse

    init(){
        self.dictionary = Dictionary<String, String>()
        self.callback = AuthenticationServiceResponse()
    }
}

public struct ReturnInfoWithJSON {
    var json: JSON?
    var callback: AuthenticationServiceResponse

    init(){
        self.json = JSON(["":""])
        self.callback = AuthenticationServiceResponse()
    }
}

public enum AuthenticationServiceResponseTypes {
    case
    Success,
    NoSSOAuthToken,
    HTTPRequestFail,
    FailedToGetEnterpriseList,
    FailedToGetSiteList,
    InvalidUTC,
    NoEnterpriseIDSelected,
    UnknownFailure,
    NoSiteIDSelected,
    NoProgramIDSelected,
    failedToConnectToServer

    init(){
        self = .UnknownFailure
    }
}

public let AuthenticationServiceResponseMessages: Dictionary<AuthenticationServiceResponseTypes, String> = [
    .Success : "Success",
    .NoSSOAuthToken : "Authorization denied.",
    .HTTPRequestFail : "Failed to get information from server.",
    .FailedToGetEnterpriseList : "Failed to get enterprise list.",
    .FailedToGetSiteList : "Failed to get site list.",
    .InvalidUTC : "UTC Offset invalid.",
    .NoEnterpriseIDSelected : "No enterprise selected.",
    .UnknownFailure : "An unknown failure has occurred.",
    .NoSiteIDSelected: "No site selected.",
    .NoProgramIDSelected: "No program selected.",
    .failedToConnectToServer : "Failled to connect to server."
]

{% endhighlight %}