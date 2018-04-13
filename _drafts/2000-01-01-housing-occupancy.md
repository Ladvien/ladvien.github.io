---
layout: post
title: Project Occupancy by Project Name and Organization Name 
categories: robots
tags: []
color: "#152a55"
image:
  feature: 
  teaser: 
  thumb:
comments: true
---
{% highlight r %}
##################################################
# Create Occupancy Trends for Emergency Shelters #
# Rapid Rehousing, and Permanet Housing programs #
# by ProjectName and OrganizationName.           #
##################################################
trendsOfOccupancyByProjectAndOrganization <- function(allDataPath, 
                                                      outputFolder, 
                                                      interval = "week", 
                                                      startDate = "2014-01-01"){
  
  library(plyr)
  
  client <- loadClient(allDataPath)
  
  primaryPersonalIDs <- getPrimaryPersonalID(client)
  primaryPersonalIDs <- sqldf("
                            SELECT
                              PrimaryPersonalID,
                              PersonalID 
                            FROM
                              primaryPersonalIDs")
  
  client <- sqldf("
                  SELECT
                    a.PrimaryPersonalID,
                    b.* 
                  FROM
                    primaryPersonalIDs a 
                  LEFT JOIN
                    client b 
                      ON a.PersonalID=b.PersonalID")
  
  client <- within(client, rm(PersonalID))
  colnames(client)[1] <- "PersonalID"
  client <- unique(client)
  
  enrollment <- loadEnrollment(allDataPath)
  enrollment <- sqldf("SELECT
                        a.PrimaryPersonalID,
                        b.* 
                      FROM
                        primaryPersonalIDs a 
                      LEFT JOIN
                        enrollment b 
                          ON a.PersonalID=b.PersonalID")
  
  enrollment <- within(enrollment, rm(PersonalID))
  colnames(enrollment)[1] <- "PersonalID"
  enrollment <- unique(enrollment)
  
  exit <- loadExit(allDataPath)
  exit <- sqldf("SELECT 
                  a.PrimaryPersonalID, 
                  b.* 
                FROM 
                  primaryPersonalIDs a 
                LEFT JOIN 
                  exit b 
                    ON a.PersonalID=b.PersonalID")
  
  exit <- within(exit, rm(PersonalID))
  colnames(exit)[1] <- "PersonalID"
  exit <- unique(exit)
  
  project <- loadProject(allDataPath)
  inventory <- loadInventory(allDataPath)

  organization <- loadOrganization(allDataPath)
  
  # Add all bed inventories into one (HH without children, HH with children, and HH of children only)
  inventory <- sqldf("
                      SELECT
                        ProjectID,
                        SUM(BedInventory) As 'BedInventory' 
                      FROM
                        inventory 
                      GROUP BY
                        ProjectID
                     ")
  
  allData <- sqldf("
                    SELECT  
                      DISTINCT a.PersonalID, 
                      a.EnrollmentID, 
                      c.ProjectName, 
                      a.EntryDate, 
                      b.ExitDate, 
                      c.ProjectType, 
                      d.BedInventory, 
                      e.OrganizationName
                    FROM 
                      enrollment a
                    LEFT JOIN 
                        exit b
                          ON a.EnrollmentID=b.EnrollmentID
                    LEFT JOIN 
                        project c
                          ON a.ProjectID=c.ProjectID
                    LEFT JOIN 
                        inventory d
                          ON c.ProjectID=d.ProjectID
                    LEFT JOIN 
                        organization e
                          ON c.OrganizationID=e.OrganizationID
                    WHERE RelationshipToHoH != 'NA'")
  
  remove(client, enrollment, exit, project, primaryPersonalIDs)
  
  # Gets max and min date
  bfr <- sqldf("
                SELECT 
                  MIN(EntryDate) As MinimumDate
                FROM 
                  allData
               ")
  
  min_date <- ""
  if(startDate == ""){
    min_date <- as.character(bfr[1,1])  
  } else {
    min_date <- startDate
  }
  bfr <- sqldf("
                SELECT 
                  MAX(EntryDate) As MaximumDate 
               FROM 
                  allData
               ")

  max_date <- as.character(bfr)
  
  intervalConstant <- switch(interval,
                             week = 7,
                             month = 30,
                             quarter = 120)
  
  numberOfIntervals <- switch(interval,
                              week = as.integer(getWeeksBetween(min_date, max_date)),
                              month = as.integer(getMonthsBetween(min_date, max_date)),
                              quarter = as.integer(getQuartersBetween(min_date, max_date)))
  
  allData$EntryDate <- as.Date(allData$EntryDate)
  allData$ExitDate <- as.Date(allData$ExitDate)

  projectTypeList <- unique(allData$ProjectType[!is.na(allData$ProjectType)])

  # Calculate occupancy by ProjectName
  for(projectType in projectTypeList) {
    
    projectTypeName <- as.character((makeProjectTypeReadableVector(list(projectType))))
    
    thisProjectTypeData <- allData[allData$ProjectType == projectType,]
    
    # Inialize dataframe with all ProjectNames
    projectEnrollmentsTrend <- unique(data.frame(thisProjectTypeData$ProjectName))
    colnames(projectEnrollmentsTrend)[1] <- "ProjectName"
    
    # Attach project bed data 
    thisProjectBedData <- unique(data.frame(allData$ProjectName, allData$BedInventory))
    colnames(thisProjectBedData)[1] <- "ProjectName"
    colnames(thisProjectBedData)[2] <- "BedInventory"
    
    for(i in 0:numberOfIntervals) {
      intervalStartDate <- as.Date(min_date) + i * intervalConstant
      intervalEndDate <- as.Date(min_date) + (i + 1) * intervalConstant
      
      activeEnrollment <- subset(thisProjectTypeData, 
                                 EntryDate <= as.Date(intervalStartDate) &
                                   (ExitDate >= as.Date(intervalEndDate) |
                                      is.na(ExitDate)))
      
      projectCount <- count(activeEnrollment, ProjectName)
      colnames(projectCount)[2] <- as.character(intervalStartDate)
    
      thisCountWithBeds <- merge(x = projectCount, y = thisProjectBedData, by = "ProjectName", all.x = TRUE)
      thisCountWithBeds$OccupancyPercentage <- round(thisCountWithBeds[,2] / thisCountWithBeds[,3], digits = 4)
      projectCount <- data.frame(thisCountWithBeds$ProjectName, thisCountWithBeds$OccupancyPercentage)
      colnames(projectCount)[1] <- "ProjectName"
      colnames(projectCount)[2] <- "Occupancy"
      
      averageDf <- sqldf("
                         SELECT 
                            'Average' As 'ProjectName',
                            AVG(Occupancy) As 'Occupancy'
                         FROM 
                            projectCount
                         ")
      
      projectCount <- rbind(projectCount, averageDf)
      colnames(projectCount)[2] <- as.character(intervalStartDate)

      projectEnrollmentsTrend <- merge(x = projectEnrollmentsTrend, y = projectCount, by = "ProjectName", all.x = TRUE)
    }

    tmpColMeans <- numcolwise(mean, na.rm = TRUE)(projectEnrollmentsTrend)
    tmpColMeans$ProjectName <- "Average"
    projectEnrollmentsTrend <- rbind(projectEnrollmentsTrend, tmpColMeans)

    projectEnrollmentsTrend <- t(projectEnrollmentsTrend)
    colnames(projectEnrollmentsTrend) <- projectEnrollmentsTrend[1,]
    projectEnrollmentsTrend <- projectEnrollmentsTrend[-1,]
    
    write.csv(projectEnrollmentsTrend, 
              paste(outputPublicPath, 
                    "/ProjectsEnrollmentsTrend_ProjectType_", 
                    projectTypeName, 
                    ".csv", 
                    sep=""), 
              na = "", row.names = TRUE) 
  }


  # Bed occupancy by OrganizationName 
  for(projectType in projectTypeList) {
    
    projectTypeName <- as.character((makeProjectTypeReadableVector(list(projectType))))
    
    thisOrganizationData <- allData[allData$ProjectType == projectType,]
    organizationEnrollmentsTrend <- unique(data.frame(thisOrganizationData$OrganizationName))
    colnames(organizationEnrollmentsTrend)[1] <- "OrganizationName"
    
    thisOrganizationBedData <- unique(data.frame(allData$OrganizationName, allData$BedInventory))
    colnames(thisOrganizationBedData)[1] <- "OrganizationName"
    colnames(thisOrganizationBedData)[2] <- "BedInventory"
    
    for(i in 0:numberOfIntervals) {
      intervalStartDate <- as.Date(min_date) + i * intervalConstant
      intervalEndDate <- as.Date(min_date) + (i + 1) * intervalConstant
      
      activeEnrollment <- subset(thisOrganizationData, 
                                 EntryDate <= as.Date(intervalStartDate) &
                                   (ExitDate >= as.Date(intervalEndDate) |
                                      is.na(ExitDate)))
      
      projectCount <- count(activeEnrollment, OrganizationName)
      colnames(projectCount)[2] <- as.character(intervalStartDate)
    
      thisCountWithBeds <- merge(x = projectCount, y = thisOrganizationBedData, by = "OrganizationName", all.x = TRUE)
      thisCountWithBeds$OccupancyPercentage <- round(thisCountWithBeds[,2] / thisCountWithBeds[,3], digits = 4)
      projectCount <- data.frame(thisCountWithBeds$OrganizationName, thisCountWithBeds$OccupancyPercentage)
      colnames(projectCount)[1] <- "OrganizationName"
      colnames(projectCount)[2] <- "Occupancy"

      projectCount <- sqldf("SELECT 
                              OrganizationName, 
                              AVG(Occupancy) As 'Occupancy'
                            FROM 
                              projectCount 
                            GROUP BY 
                              OrganizationName")
      
      colnames(projectCount)[2] <- as.character(intervalStartDate)

      organizationEnrollmentsTrend <- merge(x = organizationEnrollmentsTrend, y = projectCount, by = "OrganizationName", all.x = TRUE)
    }

    tmpColMeans <- numcolwise(mean, na.rm = TRUE)(organizationEnrollmentsTrend)
    tmpColMeans$OrganizationName <- "Average"
    organizationEnrollmentsTrend <- rbind(organizationEnrollmentsTrend, tmpColMeans)

    organizationEnrollmentsTrend <- t(organizationEnrollmentsTrend)
    colnames(organizationEnrollmentsTrend) <- organizationEnrollmentsTrend[1,]
    organizationEnrollmentsTrend <- organizationEnrollmentsTrend[-1,]
    
    write.csv(organizationEnrollmentsTrend, paste(outputPublicPath, "/OrganizationEnrollmentsTrend_ProjectType_", projectTypeName, ".csv", sep=""), na = "", row.names = TRUE) 
  }
}

trendsOfOccupancyByProjectAndOrganization(allDataPath, outputPublicPath)

{% endhighlight %}