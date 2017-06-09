---
layout: post
title: Choropleth and Heatmaps for HMIS Data
categories: HMIS, R, SQL, Choropleth
excerpt: 
tags: [ETO, HMIS, R, SQL]
image: 
    feature: R_SQL.png
comments: true
custom_css:
custom_js: 
---

{% highlight r %}

# Mac PC
nameOfReport <- "Homebase_Report.R"
hmisDataPath <- "C:/Users/Ladvien/Dropbox/HMIS/Warehouse/All Projects 2016 -- 10-01-2013 to 02-17-2017 -- HMIS CSV 5.1"
vispdatDataPath <- "C:/Users/Ladvien/Dropbox/HMIS/Coordinated_Entry_Report/VI-SPDAT and HUD Flat Export for SQL -- 3-6-2017.xlsx"
staffInfoDataPath <- "C:/Users/Ladvien/Dropbox/HMIS/Coordinated_Entry_Report/Staff Contact Info for SQL -- 3-6-2017.xlsx"
executionPath <- "C:/Users/Ladvien/Dropbox/HMIS/Coordinated_Entry_Report"
hmisFunctions <- "C:/Users/Ladvien/Dropbox/HMIS/HMIS_R_Functions/HMIS_R_Functions.R"
hmisGraphsPath <- "C:/Users/Ladvien/Dropbox/HMIS/Warehouse/TX-601_Graphs"
source(hmisFunctions)

enrollment <- loadEnrollment(hmisDataPath)

##############################################
############## Point Map #####################
##############################################

# https://thedhrelay.wordpress.com/2014/04/08/creating-a-density-map-in-r-with-zipcodes/

library(plyr)
library(ggmap)
library(zipcode)

personalIDsAndZips <- sqldf("SELECT PersonalID, LastPermanentZIP FROM enrollment")
rm(list = c("enrollment"))

# Clean zips
data(zipcode)
personalIDsAndZips$LastPermanentZIP <- clean.zipcodes(personalIDsAndZips$LastPermanentZIP)
personalIDsAndZips <- merge(personalIDsAndZips, zipcode, by.x = 'LastPermanentZIP', by.y = 'zip')

# Get density
zipCount <- sqldf("SELECT LastPermanentZIP, COUNT(LastPermanentZIP) As Count FROM personalIDsAndZips GROUP BY LastPermanentZIP")
personalIDsAndZips <- sqldf("SELECT * FROM personalIDsAndZips a LEFT JOIN zipCount b ON a.LastPermanentZIP=b.LastPermanentZIP ")
personalIDsAndZips <- subset(personalIDsAndZips)
zipCounts <- sqldf("SELECT DISTINCT LastPermanentZIP, longitude, latitude, COUNT(LastPermanentZIP) As 'Count' FROM personalIDsAndZips GROUP BY LastPermanentZIP")

texas <- get_map(location = c("dfw"), zoom = 9)
mapOfEntrants <- ggmap(texas) +
    geom_point(data = zipCounts,
    aes(x = longitude,
        y = latitude,
        size = Count,
        alpha = Count), color = "red") +
    ylab("Latitude") +
    xlab("Longitude") +
    labs(title = "Residence Prior to Project Entry", size = "Entrants", alpha = "Entrants")

svg(filename = paste(hmisGraphsPath, "/ResidencePriorToProjectEntry.svg", sep = ""),
    width = 5,
    height = 4,
    pointsize = 12)
plot(mapOfEntrants)
dev.off()

##############################################
############## Heat Map ######################
############## County Partition ##############
##############################################
library(ggmap) #Load libraries
library(ggplot2)
hpars <- read.table("https://sites.google.com/site/arunsethuraman1/teaching/hpars.dat?revision=1") #Read in the density data

ggmap(texas, extent = "device") +
geom_density2d(data = zipCounts, aes(x = longitude, y = latitude), size = 0.3) +
stat_density2d(data = zipCounts,
                 aes(x = longitude, y = latitude, fill = ..level.., alpha = 1), size = 0.01,
                 bins = 16, geom = "polygon") + scale_fill_gradient(low = "green", high = "red") +
  scale_alpha(range = c(0, 0.3), guide = FALSE) #Plot

##############################################
############## Choropleth Map ################
##############################################

# https://blogs.uoregon.edu/rclub/2015/10/27/map-maker-map-maker-make-me-a-map/
# https://www.gislounge.com/mapping-county-demographic-data-in-r/
install.packages(c("choroplethr", "choroplethrMaps"))
library(choroplethr)
library(choroplethrMaps)

# Clean up zipcodes.
valid <- read.csv("C:/Users/Ladvien/Dropbox/HMIS/Warehouse/ValidZips.csv")
zipsAndCount <- sqldf("SELECT DISTINCT(LastPermanentZIP) As 'region', COUNT(LastPermanentZIP) As 'value' FROM personalIDsAndZips GROUP BY LastPermanentZIP")
zipsAndCount <- na.omit(zipsAndCount)
zipsAndCount$value <- clean.zipcodes(zipsAndCount$value)
zipsAndCount <- sqldf("SELECT a.* FROM zipsAndCount a INNER JOIN valid b ON a.region=b.ValidZip")
zipsAndCount$value <- as.numeric(zipsAndCount$value)
#zipsAndCount$region <- as.numeric(zipsAndCount$region)

# http://stackoverflow.com/questions/30787877/making-a-zip-code-choropleth-in-r-using-ggplot2-and-ggmap
install.packages("devtools")
library(devtools)
install_github('arilamstein/choroplethrZip@v1.5.0')
library(choroplethrZip)

dallas_zips <- c("75019", "75039", "75038", "75041", "75040", "75043", "75042", "75044", "75049", "75048", "75051", "75050", "75052", "75054", "75061", "75060", "75063", "75062", "75080", "75082", "75081", "75089", "75088", "75099", "75104", "75106", "75115", "75116", "75125", "75134", "75137", "75141", "75146", "75150", "75149", "75154", "75159", "75172", "75181", "75180", "75182", "75202", "75201", "75204", "75203", "75206", "75205", "75208", "75207", "75210", "75209", "75212", "75211", "75215", "75214", "75217", "75216", "75219", "75218", "75220", "75223", "75222", "75225", "75224", "75227", "75226", "75229", "75228", "75231", "75230", "75233", "75232", "75235", "75234", "75237", "75236", "75238", "75241", "75240", "75243", "75242", "75244", "75247", "75246", "75249", "75248", "75251", "75250", "75253", "75254", "75260", "75275", "75283", "75284", "75326", "75359", "75381", "75001", "75390", "75006", "75007", "75397", "75015", "75014", "75016")
dallas_zips <- unique(dallas_zips)
# ec = east coast
texas = c("texas")
zip_choropleth(zipsAndCount,
               state_zoom = texas,
               title = "Residence Prior to Entry",
               legend = "Entrants",
               num_color = 5,
               reference_map = TRUE
               ) +
               coord_map()

############## Get Dallas ZIP codes ######################
dallasClients <- sqldf("SELECT * FROM enrollment 
                        WHERE 
        LastPermanentZIP = '75019' OR
        LastPermanentZIP = '75039' OR
        LastPermanentZIP = '75038' OR
        LastPermanentZIP = '75041' OR
        LastPermanentZIP = '75040' OR
        LastPermanentZIP = '75043' OR
        LastPermanentZIP = '75042' OR
        LastPermanentZIP = '75044' OR
        LastPermanentZIP = '75049' OR
        LastPermanentZIP = '75048' OR
        LastPermanentZIP = '75051' OR
        LastPermanentZIP = '75050' OR
        LastPermanentZIP = '75052' OR
        LastPermanentZIP = '75054' OR
        LastPermanentZIP = '75061' OR
        LastPermanentZIP = '75060' OR
        LastPermanentZIP = '75063' OR
        LastPermanentZIP = '75062' OR
        LastPermanentZIP = '75080' OR
        LastPermanentZIP = '75082' OR
        LastPermanentZIP = '75081' OR
        LastPermanentZIP = '75089' OR
        LastPermanentZIP = '75088' OR
        LastPermanentZIP = '75099' OR
        LastPermanentZIP = '75104' OR
        LastPermanentZIP = '75106' OR
        LastPermanentZIP = '75115' OR
        LastPermanentZIP = '75116' OR
        LastPermanentZIP = '75125' OR
        LastPermanentZIP = '75134' OR
        LastPermanentZIP = '75137' OR
        LastPermanentZIP = '75141' OR
        LastPermanentZIP = '75146' OR
        LastPermanentZIP = '75150' OR
        LastPermanentZIP = '75149' OR
        LastPermanentZIP = '75154' OR
        LastPermanentZIP = '75159' OR
        LastPermanentZIP = '75172' OR
        LastPermanentZIP = '75181' OR
        LastPermanentZIP = '75180' OR
        LastPermanentZIP = '75182' OR
        LastPermanentZIP = '75202' OR
        LastPermanentZIP = '75201' OR
        LastPermanentZIP = '75204' OR
        LastPermanentZIP = '75203' OR
        LastPermanentZIP = '75206' OR
        LastPermanentZIP = '75205' OR
        LastPermanentZIP = '75208' OR
        LastPermanentZIP = '75207' OR
        LastPermanentZIP = '75210' OR
        LastPermanentZIP = '75209' OR
        LastPermanentZIP = '75212' OR
        LastPermanentZIP = '75211' OR
        LastPermanentZIP = '75215' OR
        LastPermanentZIP = '75214' OR
        LastPermanentZIP = '75217' OR
        LastPermanentZIP = '75216' OR
        LastPermanentZIP = '75219' OR
        LastPermanentZIP = '75218' OR
        LastPermanentZIP = '75220' OR
        LastPermanentZIP = '75223' OR
        LastPermanentZIP = '75222' OR
        LastPermanentZIP = '75225' OR
        LastPermanentZIP = '75224' OR
        LastPermanentZIP = '75227' OR
        LastPermanentZIP = '75226' OR
        LastPermanentZIP = '75229' OR
        LastPermanentZIP = '75228' OR
        LastPermanentZIP = '75231' OR
        LastPermanentZIP = '75230' OR
        LastPermanentZIP = '75233' OR
        LastPermanentZIP = '75232' OR
        LastPermanentZIP = '75235' OR
        LastPermanentZIP = '75234' OR
        LastPermanentZIP = '75237' OR
        LastPermanentZIP = '75236' OR
        LastPermanentZIP = '75238' OR
        LastPermanentZIP = '75241' OR
        LastPermanentZIP = '75240' OR
        LastPermanentZIP = '75243' OR
        LastPermanentZIP = '75242' OR
        LastPermanentZIP = '75244' OR
        LastPermanentZIP = '75247' OR
        LastPermanentZIP = '75246' OR
        LastPermanentZIP = '75249' OR
        LastPermanentZIP = '75248' OR
        LastPermanentZIP = '75251' OR
        LastPermanentZIP = '75250' OR
        LastPermanentZIP = '75253' OR
        LastPermanentZIP = '75254' OR
        LastPermanentZIP = '75260' OR
        LastPermanentZIP = '75275' OR
        LastPermanentZIP = '75283' OR
        LastPermanentZIP = '75284' OR
        LastPermanentZIP = '75326' OR
        LastPermanentZIP = '75359' OR
        LastPermanentZIP = '75381' OR
        LastPermanentZIP = '75001' OR
        LastPermanentZIP = '75390' OR
        LastPermanentZIP = '75006' OR
        LastPermanentZIP = '75007' OR
        LastPermanentZIP = '75397' OR
        LastPermanentZIP = '75015' OR
        LastPermanentZIP = '75014' OR
        LastPermanentZIP = '75016'
")

# Clean up zipcodes.
valid <- read.csv("C:/Users/Ladvien/Dropbox/HMIS/Warehouse/ValidZips.csv")
zipsAndCount <- sqldf("SELECT DISTINCT(LastPermanentZIP) As 'region', COUNT(LastPermanentZIP) As 'value' FROM dallasClients GROUP BY LastPermanentZIP")
zipsAndCount <- na.omit(zipsAndCount)
zipsAndCount$value <- clean.zipcodes(zipsAndCount$value)
zipsAndCount <- sqldf("SELECT DISTINCT a.* FROM zipsAndCount a INNER JOIN valid b ON a.region=b.ValidZip")
zipsAndCount$value <- as.numeric(zipsAndCount$value)

zipsOfInterest <- sqldf("SELECT DISTINCT(region) FROM zipsAndCount")
zipsOfInterest <- unique(zipsOfInterest$region)

library(choroplethrZip)
# ec = east coast
texas = c("dallas")
zip_choropleth(zipsAndCount,
               zip_zoom = zipsOfInterest,
               title = "Residence Prior to Entry",
               legend = "Entrants",
               num_color = 5,
               reference_map = TRUE
               ) + coord_map()
{% endhighlight %}