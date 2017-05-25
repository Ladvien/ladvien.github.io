---
layout: post
title: Veteran's Report 2.0
categories: HMIS, R, SQL
excerpt: 
tags: [ETO, HMIS, R, SQL]
image: 
    feature: SQL-HMIS-R3_0_0.png
comments: true
custom_css:
custom_js: 
---

{% highlight r %}
#homebaseFunctionFilePath <- "C:/Users/Ladvien/Dropbox/HMIS/Homebase_Function/Homebase_Function.R"
#nameOfReport <- "Homebase_Report.R"
#hmisDataPath <- "C:/Users/Ladvien/Dropbox/HMIS/Warehouse/All Programs -- 5.1 -- 12-1-2016 to 2-28-2017"
#vispdatDataPath <- "C:/Users/Ladvien/Dropbox/HMIS/Coordinated_Entry_Report/VI-SPDAT and HUD Flat Export for SQL -- 3-6-2017.xlsx"
#staffInfoDataPath <- "C:/Users/Ladvien/Dropbox/HMIS/Coordinated_Entry_Report/Staff Contact Info for SQL -- 3-6-2017.xlsx"
#executionPath <- "C:/Users/Ladvien/Dropbox/HMIS/Coordinated_Entry_Report"
#hmisFunctionsFilePath <- "C:/Users/Ladvien/Dropbox/HMIS/HMIS_R_Functions/HMIS_R_Functions.R"
#homebaseFunctionFilePath <- "C:/Users/Ladvien/Dropbox/HMIS/Homebase_Function/Homebase_Function.R"
#outputPath <- "C:/Users/Ladvien/Dropbox/HMIS/Warehouse"
#veteranMasterListTemplateFilePath <- "C:/Users/Ladvien/Dropbox/HMIS/Veteran Report 2.0/Veteran_Report_v2/Master-List-Template.csv"

# PC
nameOfReport <- "Homebase_Report.R"
hmisDataPath <- "C:/Users/Ladvien/Dropbox/HMIS/Warehouse/All Program 2016 Program Group, 1012013 - 2172017"
vispdatDataPath <- "C:/Users/Ladvien/Dropbox/HMIS/Warehouse/VI-SPDAT 1/VI-SPDAT and HUD Flat Export for SQL -- 3-6-2017.xlsx"
vispdat2DataPath <- "C:/Users/Ladvien/Dropbox/HMIS/Warehouse/VI-SPDAT 2/VI-SPDAT v2.0 -- 04-05-17 -- TB.xlsx"
staffInfoDataPath <- "C:/Users/Ladvien/Dropbox/HMIS/Warehouse/Staff Info/Staff Contact Info for SQL -- 3-6-2017.xlsx"
executionPath <- "C:/Users/Ladvien/Dropbox/HMIS/Veteran Report 2.0"
hmisFunctionsFilePath <- "C:/Users/Ladvien/Dropbox/HMIS/HMIS_R_Functions/HMIS_R_Functions.R"
homebaseFunctionFilePath <- "C:/Users/Ladvien/Dropbox/HMIS/Homebase_Function/Homebase_Function.R"
outputPath <- "C:/Users/Ladvien/Dropbox/HMIS/Warehouse"
veteranMasterListTemplateFilePath <- "C:/Users/Ladvien/Dropbox/HMIS/Veteran Report 2.0/Veteran_Report_v2/Master-List-Template.csv"
outputPath <- "C:/Users/Ladvien/Dropbox/HMIS/Warehouse/Veteran Report Master List/"

# Load HMIS Functions
source(hmisFunctionsFilePath)
# Load Homebase function
source(homebaseFunctionFilePath)

homebase <- homebase(hmisDataPath,
                 vispdatDataPath,
                 staffInfoDataPath,
                 executionPath,
                 hmisFunctionsFilePath,
                 vispdat2DataPath
                 )

client <- loadClient(hmisDataPath)
enrollment <- loadEnrollment(hmisDataPath)
exit <- loadExit(hmisDataPath)
project <- loadProject(hmisDataPath)
projectCoc <- loadProjectCoc(hmisDataPath)

# Elements for the BFZ Veteran's Master List:

    #E1  Veteran Last Name
    #E2  Veteran First Name
    #E3  Veteran HMIS Client Identifier
    #E4  Veterans HOMES Client Identifier
    #E5  List Status
    #E6  Date Veteran Identified
    #E7  Last Review / Update on Master List
    #E8  Last known Location / Provider
    #E9  Confirmed Veteran Status?
    #E10 VHA Eligible
    #E11 SSVF Eligible
    #E12 Permant Housing Plan / Track
    #E13 Expected Permanent Housing Date
    #E14 Client Phone or Email if known
    #E15 Veteran DoB
    #E16 Assessment Score
    #E17 Chronic Status
    #E18 Provider Name and Contact
    #E19 Current Project Enrollment Type
    #E20 Date Permanent Housing Plan Created
    #E21 Permanent Housing Plan Notes
    #E22 Date of Move to TH, including GPD
    #E23 Exit Destination - Permanent Housing
    #E24 Date of Permanent Housing Placement / Exit from Literal Homelessness
    #E25 Exit Destination – Other(non - PH, non - literal homeless exits)
    #E26 Date of Other Exit

    ## Below are elements which will need to be added and rolled from month-to-month.

    #E27 Notes and Additional Information
    #E28 Date of Permanent Housing Intervention Offer
    #E29 Type of PH Intervention Offered
    #E30 Accept or Decline Offer
    #E31 Date of Accept or Decline
    #E32 Date of Permanent Housing Intervention Offer
    #E33 Type of PH Intervention Offered
    #E34 Accept or Decline Offer
    #E35 Date of Accept or Decline
    #E36 Date of Permanent Housing Intervention Offer
    #E37 Type of PH Intervention Offered
    #E38 Accept or Decline Offer
    #E39 Date of Accept or Decline
    #E40 Date of Permanent Housing Intervention Offer
    #E41 Type of PH Intervention Offered
    #E42 Accept or Decline Offer
    #E43 Date of Accept or Decline
    #E44 Date of Permanent Housing Intervention Offer
    #E45 Type of PH Intervention Offered
    #E46 Accept or Decline Offer
    #E47 Date of Accept or Decline
    #E48 Date of Permanent Housing Intervention Offer
    #E49 Type of PH Intervention Offered
    #E50 Accept or Decline Offer
    #E51 Date of Accept or Decline
    #E52 Date of Permanent Housing Intervention Offer
    #E53 Type of PH Intervention Offered
    #E54 Accept or Decline Offer
    #E55 Date of Accept or Decline
    #E56 Days Since Veteran Identified
    #E57 Days from Veteran Identification to Housing Plan Creation
    #E58 Days Since Veteran Permanent Housing Plan Created
    #E59 Days from Identification to Permanent Housing
    #E60 Days Since Permanent Housing Placement / Exit from Literal Homelessness

homebase_vets <- sqldf("SELECT *
                        FROM homebase
                        WHERE VeteranStatus = 'Yes'
                        ")
remove(list = c("homebase"))

# Get the whether the participant is actively homeless.

#E5  List Status
master_list_builder <- sqldf("SELECT *, CASE LastProjectTypeContacted
                        WHEN 'PH - Permanent Supportive Housing' THEN 'Inactive (Permanently Housed)'
                        WHEN 'Emergency Shelter' OR 'Transitional Housing' THEN 'Active - ES/TH'
                        WHEN 'Street Outreach' THEN 'Active - unsheltered'
                        END As ListStatus
                        FROM homebase_vets")

#E12 Permant Housing Plan / Track
master_list_builder <- sqldf("SELECT *, CASE 
              WHEN ChronicallyHomeless = 'Yes' THEN 'Permanent Supportive Housing'
              ELSE 'Rapid Rehousing'
              END As'Permanent Housing Plan / Track'
              FROM master_list_builder
              ")

#E22 Date of Move to TH, including GPD
master_list_builder <- sqldf("SELECT *, CASE
                              WHEN LastProjectTypeContacted = 'Transitional Housing' THEN RecentHUDEntryDate
                              ELSE ''
                              END As THMoveIn
                              FROM master_list_builder
                              ")

#E24 Date of Permanent Housing Placement / Exit from Literal Homelessness
master_list_builder <- sqldf("SELECT *, CASE
                              WHEN ActiveInPH = 'Yes' THEN RecentHUDEntryDate
                              ELSE ''
                              END As PHMoveIn
                              FROM master_list_builder
                              ")
master_list_builder <- subset(master_list_builder)

############ FILTERING ##################

####################################
# Filter:                          #
# Active (in 90 days) in NBN ES    #
####################################
services <- loadServices(hmisDataPath)

# Filter out NBN at TCES, get active NBN list, add them back in.
master_list_builder_bfr <- sqldf("SELECT *
                              FROM master_list_builder
                              WHERE LastProgramInContact != 'Salvation Army' 
                              AND LastProgramInContact != 'Presbyterian Night Shelter'
                              AND LastProgramInContact != 'Day Resource Center'
    ")

nbnServices <- sqldf("SELECT * 
                      FROM services
                      WHERE RecordType = 200
    ")

activeNbnSerivces <- activeFilter(nbnServices, 'DateProvided', 'DateProvided', as.character(Sys.Date() - 90), as.character(Sys.Date()))
filter_Active_in_90_NBN <- sqldf("SELECT DISTINCT(PersonalID) FROM activeNbnSerivces")

activeNbnRecords <- sqldf("SELECT b.*
                           FROM filter_Active_in_90_NBN a
                           INNER JOIN master_list_builder b
                           ON a.PersonalID=b.PersonalID
                        ")

master_list_builder <- rbind(master_list_builder_bfr, activeNbnRecords)

####################################
# Filter:                          #
# Active (in 90 days) in Outreach  #
####################################

# Filter out Outreach, get active Outreach, then add back in.
master_list_builder_bfr <- sqldf("SELECT *
                              FROM master_list_builder
                              WHERE LastProgramInContact != 'SOS' 
                              AND LastProgramInContact != 'SOS Night Time Outreach'
                              AND LastProgramInContact != 'PATH'
    ")

outreachServices <- sqldf("SELECT * 
                      FROM services
                      WHERE RecordType = 12
    ")

activeOutreachSerivces <- activeFilter(outreachServices, 'DateProvided', 'DateProvided', as.character(Sys.Date() - 90), as.character(Sys.Date()))
filter_Active_in_90_Outreach <- sqldf("SELECT DISTINCT(PersonalID) FROM activeOutreachSerivces")

activeOutreachRecords <- sqldf("SELECT b.*
                           FROM filter_Active_in_90_Outreach a
                           INNER JOIN master_list_builder b
                           ON a.PersonalID=b.PersonalID
                        ")

remove(list = c("services"))

master_list_builder <- rbind(master_list_builder_bfr, activeOutreachRecords)
master_list_builder <- sqldf("SELECT DISTINCT * FROM master_list_builder")

#######################################
# Reload Data for Entry / Exit Filter #
#######################################
enrollment <- loadEnrollment(hmisDataPath)
exit <- loadExit(hmisDataPath)
project <- loadProject(hmisDataPath)

####################################
# Filter:                          #
# Active in a Entry Exit ES        #
####################################

activeEEESProgramsFilter_builder <- sqldf("SELECT a.ProjectEntryID, a.PersonalID, a.EntryDate, b.ProjectName, b.ProjectType 
                               FROM enrollment a
                               LEFT JOIN project b
                               ON a.ProjectID=b.ProjectID 
    ")

# 1 = Emergency Shelter
# 11 = Day Shelter
activeEEESProgramsFilter_builder <- sqldf("SELECT * 
                               FROM activeEEESProgramsFilter_builder 
                               WHERE (ProjectType = 1 OR ProjectType = 11)
                               AND (ProjectName != 'Salvation Army' 
                                   AND ProjectName != 'Presbyterian Night Shelter'
                                   AND ProjectName != 'Day Resource Center'
                                   AND ProjectName != 'SOS'
                                   AND ProjectName != 'SOS Night Time Outreach'
                                   AND ProjectName != 'PATH')")

activeEEESProgramsFilter_builder <- sqldf("SELECT a.*, b.ExitDate
                                       FROM activeEEESProgramsFilter_builder a
                                       LEFT JOIN exit b
                                       ON a.ProjectEntryID=b.ProjectEntryID
    ")

activeEEESProgramsFilter_builder <- subset(activeEEESProgramsFilter_builder)
filter_Active_in_EEES <- sqldf("SELECT DISTINCT PersonalID FROM activeEEESProgramsFilter_builder WHERE ExitDate IS NULL")

remove(list = c("activeEEESProgramsFilter_builder"))

####################################
# Filter:                          #
# Active in a Transitional Housing #
####################################

activeTHProgramFilter_builder <- sqldf("SELECT a.ProjectEntryID, a.PersonalID, a.EntryDate, b.ProjectName, b.ProjectType 
                               FROM enrollment a
                               LEFT JOIN project b
                               ON a.ProjectID=b.ProjectID 
    ")

# 2 = Transitional Housing
activeTHProgramFilter_builder <- sqldf("SELECT * 
                               FROM activeTHProgramFilter_builder 
                               WHERE (ProjectType = 2)")

activeTHProgramFilter_builder <- sqldf("SELECT a.*, b.ExitDate
                                       FROM activeTHProgramFilter_builder a
                                       LEFT JOIN exit b
                                       ON a.ProjectEntryID=b.ProjectEntryID
    ")

activeTHProgramFilter_builder <- subset(activeTHProgramFilter_builder)
filter_Active_in_TH <- sqldf("SELECT DISTINCT PersonalID FROM activeTHProgramFilter_builder WHERE ExitDate IS NULL")

remove(list = c("activeTHProgramFilter_builder"))

####################################
# Get First Date in Homelessness   #
####################################

project <- loadProject(hmisDataPath)
enrollment <- loadEnrollment(hmisDataPath)

enrollmentAndProject <- sqldf("SELECT a.PersonalID, a.EntryDate, b.ProjectName, b.ProjectType 
                               FROM enrollment a
                               LEFT JOIN project b
                               ON a.ProjectID=b.ProjectID 
    ")

# 1 = Emergency Shelter, 2 = Transitional Housing, 4 = Street Outreach, 8 = Safe Haven, 11 = Day Shelter, 14 = Coordinated Assessment
startDateInHomelessnessByPersonalID <- sqldf("SELECT PersonalID, MAX(EntryDate) As 'FirstContactDate' 
                                              FROM enrollmentAndProject
                                              WHERE ProjectType = 1 OR ProjectType = 2 OR ProjectType = 4 OR ProjectType = 8 OR ProjectType = 11 OR ProjectType = 14
                                              GROUP BY PersonalID
    ")

# Add FirstContactDate to master list.
master_list_builder <- sqldf("SELECT a.*, b.FirstContactDate As 'DateVeteranIdentified'
                              FROM master_list_builder a
                              LEFT JOIN startDateInHomelessnessByPersonalID b
                              ON a.PersonalID=b.PersonalID
    ")

####################################
# Get Exit Destination Information #
####################################

# Get Homebase information tied back to the record
master_list <- sqldf("SELECT FirstName As 'VeteransLastName',
                              LastName As 'VeteransFirstName',
                              PersonalID As 'Veteran HMIS Client Identifier',
                              'Unknown' As 'Veterans HOMES Client Identifier',
                              ListStatus As 'List Status',
                              DateVeteranIdentified,
                              'Unknown' As 'Last Review / Update On Master List',
                              LastProgramInContact As 'Last Known Location / Provider',
                              'Unknown' As 'Confirmed Veteran Status',
                              'Unknown' As 'VHA Eligible',
                              'Unknown' As 'SSVF Eligible',
                              'Unknown' As 'Permanent Housing Plan',
                              'Unknown' As 'Permanent Housing Plan / Track',
                              'Unknown' As 'Permanent Housing Date',
                              'Unknown' As 'Client Phone or Email',
                              DOB,
                              scoreVISPDAT As 'Assessment Score',
                              ChronicallyHomeless As 'Chronically Homeless',
                              LastProgramInContact As 'Provider Name',
                              StaffName As 'Provider: StaffName',
                              StaffEmail As 'Provider: Staff Email',
                              LastProjectTypeContacted As 'Current Project Enrollment Type',
                              'Unknown' As 'Date Permanent Housing Plan Created',
                              'Unknown' As 'Permanent Housing Plan Notes',
                              THMoveIn As 'Date of Move to TH, including GPD',
                              'Unknown' As 'Exit Destination - Permanent Housing',
                              PHMoveIn As 'Date of Permanent Housing Placement / Exit from Literal Homelessness',
                              'Unknown' As 'Exit Destination – Other(non - PH, non - literal homeless exits)',
                              'Unknown' As 'Date of Other Exit'
                              FROM master_list_builder
") 

master_list_ph <- sqldf("SELECT * FROM master_list_builder WHERE LastProjectTypeContacted = 'PH - Rapid Re-Housing' OR LastProjectTypeContacted = 'PH - Permanent Supportive Housing'")
master_list_es_and_so <- sqldf("SELECT * FROM master_list_builder WHERE LastProjectTypeContacted = 'Day Shelter' OR LastProjectTypeContacted = 'Emergency Shelter' OR LastProjectTypeContacted = 'Street Outreach'")

filter_active_homeless <- rbind(filter_Active_in_90_NBN, filter_Active_in_90_Outreach)
filter_active_homeless <- rbind(filter_active_homeless, filter_Active_in_EEES)
filter_active_homeless <- rbind(filter_active_homeless, filter_Active_in_TH)
filter_active_homeless <- unique(filter_active_homeless)
master_list_es_and_so_and_th <- sqldf("SELECT a.* 
                                       FROM master_list a
                                       INNER JOIN filter_active_homeless b
                                       ON a.'Veteran HMIS Client Identifier'=b.PersonalID")

colnames(master_list_es_and_so_and_th)[5] <- "ListStatus"
master_list_es_and_so_and_th <- sqldf("SELECT * FROM master_list_es_and_so_and_th WHERE ListStatus IS NOT 'Inactive (Permanently Housed)'")
colnames(master_list_es_and_so_and_th)[5] <- "List Status"

filter_active_houseless <- rbind(filter_Active_in_90_NBN, filter_Active_in_90_Outreach)
filter_active_houseless<- rbind(filter_active_houseless, filter_Active_in_EEES)
master_list_es_and_so <- sqldf("SELECT a.* 
                                       FROM master_list a
                                       INNER JOIN filter_active_houseless b
                                       ON a.'Veteran HMIS Client Identifier'=b.PersonalID
                                       ")
colnames(master_list_es_and_so)[5] <- "ListStatus"
master_list_es_and_so <- sqldf("SELECT * FROM master_list_es_and_so WHERE ListStatus IS NOT 'Inactive (Permanently Housed)'")
colnames(master_list_es_and_so)[5] <- "List Status"

detach("package:XLConnect", unload = TRUE)
library(xlsx)
outputPath <- paste(outputPath, "Veteran_Master_List_", Sys.Date(), ".xlsx", sep = "")
masterListSheetName <- paste("TX-601_Master_List_", Sys.Date(), paste = "")
masterListPhName <- paste("PSH_", Sys.Date(), paste = "")
masterListESName <- paste("ES_DS_SO_", Sys.Date(), paste = "")
masterListEAndThSName <- paste("ES_DS_SO_TH_", Sys.Date(), paste = "")

###############################
# Write Sheets                #
###############################

write.xlsx(master_list, file = outputPath, sheetName = masterListSheetName, row.names = FALSE, showNA = FALSE)
write.xlsx(master_list_ph, file = outputPath, sheetName = masterListPhName, row.names = FALSE, showNA = FALSE, append = TRUE)
write.xlsx(master_list_es_and_so, file = outputPath, sheetName = masterListESName, row.names = FALSE, showNA = FALSE, append = TRUE)
write.xlsx(master_list_es_and_so_and_th, file = outputPath, sheetName = masterListEAndThSName, row.names = FALSE, showNA = FALSE, append = TRUE)

ch <- sqldf("SELECT 'NumberOfCH', COUNT(PersonalID) FROM master_list_builder WHERE ChronicallyHomeless = 'Yes' AND LastProjectTypeContacted = 'Emergency Shelter'")

{% endhighlight %}