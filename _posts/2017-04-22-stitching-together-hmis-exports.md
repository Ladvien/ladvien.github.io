---
layout: post
title: Stitching Together HMIS Exports
series: HMIS SQL-R Script Snippets
categories: HMIS
excerpt: 
tags: [ETO, HMIS, R, SQL]
image: 
    feature: R_SQL.png
comments: true
custom_css:
custom_js: 
---

This is an R script which will take two sets of HMIS 5.1 CSVs and produce a combined set.    

A few notes:

1.  A new ExportID will need to be provided.
2.  Each files are deduplicated based upon the Primary Key (ProjectEntryID, PersonalID, etc.)
3.  The Project.csv contains a PITCount which is different based upon the date ranges the two data sets were pulled.  However, the script takes the maximum of the two PITCounts.
4.  It requires HMIS_Functions and dplyr.

{% highlight r %}
    library(dplyr)
    # hmisFunctions <- "/Users/user//Dropbox/HMIS/HMIS_R_Functions/HMIS_R_Functions.R"
    # dataPathOne <- "/Users/user//Dropbox/HMIS/R HMIS CSV Set Merger/HMIS Data 10-01-2016 to 10-31-2016"
    # dataPathTwo <- "/Users/user//Dropbox/HMIS/R HMIS CSV Set Merger/HMIS Data 11-01-2016 to 11-30-2016"
    # pathForCombinedData <- "/Users/user//Dropbox/HMIS/R HMIS CSV Set Merger/"
    # nameOfMergedDirectory <- "Merged"

    hmisFunctions <- "/Users/user/Dropbox/HMIS/HMIS_R_Functions/HMIS_R_Functions.R"
    dataPathOne <- "/Users/user/Dropbox/HMIS/R HMIS CSV Set Merger/HMIS Data 10-01-2016 to 10-31-2016"
    dataPathTwo <- "/Users/user/Dropbox/HMIS/R HMIS CSV Set Merger/HMIS Data 11-01-2016 to 11-30-2016"
    pathForCombinedData <- "/Users/user/Dropbox/HMIS/R HMIS CSV Set Merger/Merged/"
    nameOfMergedDirectory <- "Merged"

    newExportID <- "12345"

    source(hmisFunctions)

    dir.create(file.path(pathForCombinedData, nameOfMergedDirectory), showWarnings = FALSE)
    setwd(file.path(pathForCombinedData, nameOfMergedDirectory))

    ##################################
    # Merge Functions                #
    ##################################
    mergeHmisCsvsWithUniqueIDAndExport <- function(df1, df2, uniqueIDHeader, exportID){
      # Merge the data
      mergedDf <- rbind(df1, df2)
      mergedDf[,uniqueIDHeader] <- as.factor(mergedDf[,uniqueIDHeader])
      # Drop columns which would resist removing duplicates
      drops <- c(uniqueIDHeader, "ExportID")
      mergedDf <- mergedDf[ , !(names(mergedDf) %in% drops)]
      # Get only unique records
      mergedDf <- unique(mergedDf)
      # Creat a PrimaryKey vector.
      xName <- rownames(mergedDf)
      # Add Primary Key back.
      mergedDf <- cbind(xName=xName, mergedDf)
      # Create an ExportID vector.
      exportIDVector <- rep(exportID,length(mergedDf$xName))
      # Add ExportID vector back.
      mergedDf <- cbind(mergedDf, exportIDVector)
      # Rename newly created PrimaryKey and ExportID appropriately.
      colnames(mergedDf)[ncol(mergedDf)] <- "ExportID"
      colnames(mergedDf)[1] <- uniqueIDHeader
      mergedDf
    }

    mergeHmisCsvsWithExportAndPrimaryKey <- function(df1, df2, primaryKey, exportID){
      # Merge the data
      mergedDf <- rbind(df1, df2)

      # Drop columns which would resist removing duplicates
      drops <- c("ExportID")
      mergedDf <- mergedDf[ , !(names(mergedDf) %in% drops)]

      # Get only unique records
      #mergedDf <- unique(mergedDf, incomparables = FALSE)
      mergedDf <- mergedDf[!duplicated(mergedDf[,c(primaryKey)]),]
      # Create an ExportID vector.
      exportIDVector <- rep(exportID,length(mergedDf[1]))
      # Add ExportID vector back.
      mergedDf <- cbind(mergedDf, exportIDVector)
      # Rename newly created PrimaryKey and ExportID appropriately.
      colnames(mergedDf)[ncol(mergedDf)] <- "ExportID"
      mergedDf
    }

    mergeHmisCsvsWithExportId <- function(df1, df2, exportID){
      # Merge the data
      mergedDf <- rbind(df1, df2)
      # Drop columns which would resist removing duplicates
      drops <- c("ExportID")
      mergedDf <- unique(mergedDf[ , !(names(mergedDf) %in% drops)])
      # Create an ExportID vector.
      exportIDVector <- rep(exportID,length(mergedDf[1]))
      # Add ExportID vector back.
      mergedDf <- cbind(mergedDf, exportIDVector)
      # Rename newly created PrimaryKey and ExportID appropriately.
      colnames(mergedDf)[ncol(mergedDf)] <- "ExportID"
      mergedDf
    }

    #####################
    # Merge Affiliation #
    #####################
    affiliationOne <- loadAffiliation(dataPathOne)
    affiliationTwo <- loadAffiliation(dataPathTwo)
    affiliationCombined <- rbind(affiliationOne, affiliationTwo)
    affiliationCombined <- unique(affiliationCombined)
    remove(list=c("affiliationOne", "affiliationTwo"))

    #####################
    # Merge Client      #
    #####################
    clientOne <- loadClient(dataPathOne)
    clientTwo <- loadClient(dataPathTwo)
    clientCombined <- rbind(clientOne, clientTwo)
    clientCombined <- unique(clientCombined)
    remove(list=c("clientOne", "clientTwo"))

    ######################
    # Merge Disabilities #
    ######################
    disabilitiesOne <- loadDisabilities(dataPathOne)
    disabilitiesTwo <- loadDisabilities(dataPathTwo)
    disabilitiesCombined <- mergeHmisCsvsWithUniqueIDAndExport(disabilitiesOne, disabilitiesTwo, "DisabilitiesID", newExportID)
    remove(list=c("disabilitiesOne", "disabilitiesTwo"))

    ##################################
    # Merge Employment and Education #
    ##################################
    employmentEducationOne <- loadEmployementEducation(dataPathOne)
    employmentEducationTwo <- loadEmployementEducation(dataPathTwo)
    employmentEducationCombined <- mergeHmisCsvsWithUniqueIDAndExport(employmentEducationOne, employmentEducationTwo, "EmploymentEducationID", newExportID)
    remove(list=c("employmentEducationOne", "employmentEducationTwo"))

    #####################
    # Merge Enrollment  #
    #####################
    enrollmentOne <- loadEnrollment(dataPathOne)
    enrollmentTwo <- loadEnrollment(dataPathTwo)
    enrollmentCombined <- mergeHmisCsvsWithExportAndPrimaryKey(enrollmentOne, enrollmentTwo, "ProjectEntryID", newExportID)
    remove(list=c("enrollmentOne", "enrollmentTwo"))

    #######################
    # Merge EnrollmentCoC #
    #######################
    enrollmentCocOne <- loadEnrollmentCoc(dataPathOne)
    enrollmentCocTwo <- loadEnrollmentCoc(dataPathTwo)
    enrollmentCocCombined <- mergeHmisCsvsWithUniqueIDAndExport(enrollmentCocOne,
                                                                enrollmentCocTwo,
                                                                "EnrollmentCoCID",
                                                                newExportID)
    remove(list=c("enrollmentCocOne", "enrollmentCocTwo"))

    #####################
    # Merge Exit        #
    #####################
    exitOne <- loadExit(dataPathOne)
    exitTwo <- loadExit(dataPathTwo)
    exitCombined <- mergeHmisCsvsWithExportAndPrimaryKey(exitOne,
                                                         exitTwo,
                                                         "ExitID",
                                                         newExportID)
    remove(list=c("exitOne", "exitTwo"))

    #####################
    # Merge Expot       #
    #####################
    exportOne <- loadExport(dataPathOne)
    exportTwo <- loadExport(dataPathTwo)
    exportCombined <- exportTwo
    remove(list=c("exportOne", "exportTwo"))

    #####################
    # Merge Funder      #
    #####################
    funderOne <- loadFunder(dataPathOne)
    funderTwo <- loadFunder(dataPathTwo)
    funderCombined <- mergeHmisCsvsWithExportId(funderOne, funderTwo, newExportID)
    remove(list=c("funderOne", "funderTwo"))

    #####################
    # Merge Health & DV #
    #####################
    healthAndDVOne <- loadHealthAndDv(dataPathOne)
    healthAndDVTwo <- loadHealthAndDv(dataPathTwo)
    healthAndDVCombined <- mergeHmisCsvsWithUniqueIDAndExport(healthAndDVOne, healthAndDVTwo, "HealthAndDVID", newExportID)
    remove(list=c("healthAndDVOne", "healthAndDVTwo"))

    #############################
    # Merge Income and Benefits #
    #############################
    incomeBenefitsOne <- loadIncomeBenefits(dataPathOne)
    incomeBenefitsTwo <- loadIncomeBenefits(dataPathTwo)
    incomeBenefitsCombined <- mergeHmisCsvsWithUniqueIDAndExport(incomeBenefitsOne,
                                                                 incomeBenefitsTwo,
                                                                 "IncomeBenefitsID",
                                                                 newExportID)
    remove(list=c("incomeBenefitsOne", "incomeBenefitsTwo"))

    #####################
    # Merge Inventory   #
    #####################
    inventoryOne <- loadInventory(dataPathOne)
    inventoryTwo <- loadInventory(dataPathTwo)
    inventoryCombined <- mergeHmisCsvsWithUniqueIDAndExport(inventoryOne, inventoryTwo,
                                                            "InventoryID",
                                                            newExportID)
    remove(list=c("inventoryOne", "inventoryTwo"))

    ######################
    # Merge Organization #
    ######################
    organizationOne <- loadOrganization(dataPathOne)
    organizationTwo <- loadOrganization(dataPathTwo)
    organizationCombined <- mergeHmisCsvsWithExportId(organizationOne, organizationTwo, newExportID)
    remove(list=c("organizationOne", "organizationTwo"))

    #####################
    # Merge Project     #
    #####################
    projectOne <- loadProject(dataPathOne)
    projectTwo <- loadProject(dataPathTwo)
    projectsCombined <- rbind(projectOne, projectTwo)
    # Get only the highest PIT Count
    projectsCombined <- projectsCombined %>% 
      group_by(ProjectID) %>% 
      filter(PITCount==max(PITCount))
    # Remove ExportID column for flattening
    drops <- c("ExportID")
    projectsCombined <- projectsCombined[ , !(names(projectsCombined) %in% drops)]
    projectsCombined <- unique(projectsCombined)
    # Create an ExportID vector.
    exportIDVector <- rep(newExportID,length(projectsCombined$ProjectID))
    # Add ExportID vector back.
    projectsCombined <- as.data.frame(projectsCombined)
    projectsCombined <- cbind(projectsCombined, exportIDVector)
    colnames(projectsCombined)[ncol(projectsCombined)] <- "ExportID"
    remove(list=c("projectOne", "projectTwo"))

    #####################
    # Merge Project CoC #
    #####################
    projectsCoCOne <- loadProjectCoc(dataPathOne)
    projectsCoCTwo <- loadProjectCoc(dataPathTwo)
    projectCoCCombined <- rbind(projectsCoCOne, projectsCoCTwo)
    # Get only the highest PIT Count
    projectCoCCombined <- projectCoCCombined %>% 
      group_by(ProjectID) %>% 
      filter(PITCount==max(PITCount))
    # Remove ExportID column for flattening
    drops <- c("ExportID")
    projectCoCCombined <- projectCoCCombined[ , !(names(projectCoCCombined) %in% drops)]
    projectCoCCombined <- unique(projectCoCCombined)
    # Create an ExportID vector.
    exportIDVector <- rep(newExportID,length(projectCoCCombined$ProjectID))
    # Add ExportID vector back.
    projectCoCCombined <- as.data.frame(projectCoCCombined)
    projectCoCCombined <- cbind(projectCoCCombined, exportIDVector)
    colnames(projectCoCCombined)[ncol(projectCoCCombined)] <- "ExportID"
    remove(list=c("projectsCoCOne", "projectsCoCTwo"))

    #####################
    # Merge Services    #
    #####################
    servicesOne <- loadServices(dataPathOne)
    servicesTwo <- loadServices(dataPathTwo)
    servicesCombined <- mergeHmisCsvsWithUniqueIDAndExport(servicesOne, servicesTwo, "ServicesID", newExportID)
    remove(list=c("servicesOne", "servicesTwo"))

    #####################
    # Merge Site        #
    #####################
    siteOne <- loadSite(dataPathOne)
    siteTwo <- loadSite(dataPathTwo)
    siteCombined <- mergeHmisCsvsWithExportId(siteOne, siteTwo, newExportID)
    remove(list=c("siteOne", "siteTwo"))

    ############################
    # Write combined HMIS CSVs #
    ############################

    write.csv(affiliationCombined, file = paste(pathForCombinedData, "Affiliation.csv", sep=""), na = "", row.names = FALSE)
    write.csv(clientCombined, file = paste(pathForCombinedData, "Client.csv", sep=""), na = "", row.names = FALSE)
    write.csv(disabilitiesCombined, file = paste(pathForCombinedData, "Disabilities.csv", sep=""), na = "", row.names = FALSE)
    write.csv(employmentEducationCombined, file = paste(pathForCombinedData, "EmploymentEducation.csv", sep=""), na = "", row.names = FALSE)
    write.csv(enrollmentCombined, file = paste(pathForCombinedData, "Enrollment.csv", sep=""), na = "", row.names = FALSE)
    write.csv(enrollmentCocCombined, file = paste(pathForCombinedData, "EnrollmentCoC.csv", sep=""), na = "", row.names = FALSE)
    write.csv(exitCombined, file = paste(pathForCombinedData, "Exit.csv", sep=""), na = "", row.names = FALSE)
    write.csv(exportCombined, file = paste(pathForCombinedData, "Export.csv", sep=""), na = "", row.names = FALSE)
    write.csv(funderCombined, file = paste(pathForCombinedData, "Funder.csv", sep=""), na = "", row.names = FALSE)
    write.csv(healthAndDVCombined, file = paste(pathForCombinedData, "HealthAndDV.csv", sep=""), na = "", row.names = FALSE)
    write.csv(incomeBenefitsCombined, file = paste(pathForCombinedData, "IncomeBenefits.csv", sep=""), na = "", row.names = FALSE)
    write.csv(inventoryCombined, file = paste(pathForCombinedData, "Inventory.csv", sep=""), na = "", row.names = FALSE)
    write.csv(organizationCombined, file = paste(pathForCombinedData, "Organization.csv", sep=""), na = "", row.names = FALSE)
    write.csv(projectsCombined, file = paste(pathForCombinedData, "Project.csv", sep=""), na = "", row.names = FALSE)
    write.csv(projectCoCCombined, file = paste(pathForCombinedData, "ProjectCoC.csv", sep=""), na = "", row.names = FALSE)
    write.csv(servicesCombined, file = paste(pathForCombinedData, "Services.csv", sep=""), na = "", row.names = FALSE)
    write.csv(siteCombined, file = paste(pathForCombinedData, "Site.csv", sep=""), na = "", row.names = FALSE)
    
{% endhighlight %}