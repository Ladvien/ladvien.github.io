---
layout: post
title: Annualized Count
categories: HMIS, R, SQL, Choropleth
excerpt: 
tags: [ETO, HMIS, R, SQL]
image: 
    feature: SQL-HMIS-R3_0_0.png
comments: true
custom_css:
custom_js: 
---

{% highlight r %}
source(hmisFunctions)

# Time period: 1/1/2016-12/31/2016
# Include 
# Active in emergency shelter
# Active in transitional housing

setwd(hmisDataPath)
client <- loadClient()
enrollment <- loadEnrollment()
project <- loadProject()
exit <- loadExit()

enrollment$EntryDate <- as.character(enrollment$EntryDate)
exit$ExitDate <- as.character(exit$ExitDate)

targetEnrollments <- sqldf("SELECT *
                        FROM enrollment
                        WHERE EntryDate < '2016-12-31'
                        ")

targetExits <- sqldf("SELECT *
                    FROM exit
                     WHERE ExitDate < '2016-01-01'
                     ")

activeEnrollment <- getActiveHudEnrollments(targetEnrollments, targetExits, project)
activeEnrollmentSelect <- sqldf("SELECT PersonalID, ProjectEntryID, ProjectType, EntryDate, ExitDate FROM activeEnrollment")

transitionalHousing <- sqldf("SELECT *
                                  FROM activeEnrollmentSelect
                                  WHERE ProjectType = 2
                                  ")

thPersonalIDs <- sqldf("SELECT DISTINCT(PersonalID) FROM transitionalHousing")

remove(list=c("targetEnrollments", "targetExits", "activeEnrollment", "activeEnrollmentSelect", "transitionalHousing"))

################
# ES LTB Count #
################
ltbESEnrollment <- sqldf("SELECT *
                        FROM enrollment
                         WHERE EntryDate < '2016-12-31'
                         ")

ltbESEnrollment <- addProjectInfoToEnrollment(ltbESEnrollment, project)
ltbESEnrollment <- sqldf("SELECT *
                         FROM ltbESEnrollment
                         WHERE TrackingMethod = 0
                         ")

ltbESExits <- sqldf("SELECT *
                     FROM exit
                     WHERE ExitDate < '2016-01-01'
                     ")

activeltbESEnrollments <- getActiveHudEnrollments(ltbESEnrollment, ltbESExits, project)
activeltbESEnrollments <- sqldf("SELECT PersonalID, ProjectEntryID, ProjectType, EntryDate, ExitDate FROM activeltbESEnrollments")

ltbESPersonalIDs <- sqldf("SELECT DISTINCT(PersonalID) FROM activeltbESEnrollments")

remove(list=c("ltbESEnrollment", "ltbESExits", "activeltbESEnrollments"))

################
# NBN  Count   #
################

services <- loadServices()

nbnServices <- sqldf("SELECT * 
                     FROM services
                     WHERE RecordType = 200
                     ")

nbnServices$DateProvided <- as.character(nbnServices$DateProvided)

nbnServicesInRange <- sqldf("SELECT *
                            FROM nbnServices
                            WHERE DateProvided > '2016-01-01'
                            AND DateProvided < '2016-12-31'
                            ")

nbnPersonalIDs <- sqldf("SELECT DISTINCT(PersonalID) FROM nbnServicesInRange")

###################
# Outreach  Count #
###################

outreachServices <- sqldf("SELECT * 
                     FROM services
                     WHERE RecordType = 12
                     ")

outreachServices$DateProvided <- as.character(outreachServices$DateProvided)

outreachServicesInRange <- sqldf("SELECT *
                            FROM outreachServices
                            WHERE DateProvided > '2016-01-01'
                            AND DateProvided < '2016-12-31'
                            ")

outreachPersonalIDs <- sqldf("SELECT DISTINCT(PersonalID) FROM outreachServicesInRange")

remove(list=c("outreachServicesInRange", "outreachServices"))

##########
# Totals #
##########

totalHomelessInRange <- rbind(ltbESPersonalIDs, thPersonalIDs, nbnPersonalIDs, outreachPersonalIDs)

totalHomelessInRange <- sqldf("SELECT DISTINCT(PersonalID)
                              FROM totalHomelessInRange
                              ")

#############
# PH Counts #
#############

phTargetEnrollments <- sqldf("SELECT *
                        FROM enrollment
                           WHERE EntryDate < '2016-12-31'
                           ")

phTargetExits <- sqldf("SELECT *
                     FROM exit
                     WHERE ExitDate < '2016-01-01'
                     ")

phActiveEnrollment <- getActiveHudEnrollments(phTargetEnrollments, phTargetExits, project)
phActiveEnrollmentSelect <- sqldf("SELECT PersonalID, ProjectEntryID, ProjectType, EntryDate, ExitDate FROM phActiveEnrollment")

totalPhHousing <- sqldf("SELECT *
                             FROM phActiveEnrollmentSelect
                             WHERE ProjectType = 3
                             OR ProjectType = 13
                             ")

rrhHousing <- sqldf("SELECT *
                    FROM phActiveEnrollmentSelect
                    WHERE ProjectType = 13
                    ")

psh <- sqldf("SELECT *
             FROM phActiveEnrollmentSelect
             WHERE ProjectType = 3
             ")

setwd(executionPath)
{% endhighlight %}