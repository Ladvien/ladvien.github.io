---
layout: post
title: Give me MyFitnessPal Data!
categories: health
excerpt: Using the MyFitnessPal Python library to scrap a public account for health data
tags: [python, health, data, myfitnesspal]
image: 
    feature: myfitnesspal-scraper_fet.png
comments: true
custom_css:
custom_js: 
---

## I want my Data!
I'm fat.  Fatter than I want to be.  I've not always been fat, I got down to 180 at back in 2008.  It took counting calories and weight religiously.  The key piece for me was having a graph which I looked at daily showing my outcomes.  Over the course of a year I lost 40 pounds.  Well, it's time to do it again.  I've gained that 40 back over 10 years--and now it needs to go.

Back in 2008 I was using Google to give me the calories of every item I ate and recording them in an Excel document.  This food journal was great, but a little more work than it probably should have been.

Back then, I wasn't aware of being a hacker.  Now, I plan to throw all my hacker skills at this weight loss plan (hell, I might even go to the gym!)

I signed up for MyFitnessPal.  Counting calories worked once, I figure if it aint broke.  But then I got to looking at how much work it would take to look at my improvement.  I mean, I'd have to actually open the app on my phone and click on the weight loss section.  Shesh--who designed that app?  Two actions to get where I needed--ain't no one got time for that.  

Enter hacker skills.  I discovered there is a Python library which allows scraping of data.  

* [MyFitnessPal Python Library](https://github.com/coddingtonbear/python-myfitnesspal)

This wonderful little library is written and provided by CoddingtonBear.

I figure, I'd write a Python script to scrap the data, save it to a CSV, create an SQL-R script to join the nutrition and weight information, use ggplot to plot the data, save the plot as a PNG, and then copy this plot to a dedicated spot on Ladvien.com.  Lastly, I'd write a bash script to run every night and update the graph.  Simples!

And c'mon, opening a webpage is _a lot_ easier than tapping twice.

Well, after a few hours of coding, I've got the first step of the project complete.

{% highlight python %}
import myfitnesspal
import csv, sys
from datetime import datetime


# Get account info
client = myfitnesspal.Client('cthomasbrittain')
# Set start year
startYear = "2008"
# Get limits
beginningYear = datetime.strptime(startYear, "%Y").date().year
daysInMonth = {1:31, 2:28, 3:31, 4:30, 5:31, 6:30, 7:31, 8:31, 9:30, 10:31, 11:30, 12:31}

print("")
print("################################################")
print("# Scraping MyFitness Pal                       #")
print("# Make sure your account is set to public      #")
print("# and your username and pass are in keychain   #")
print("################################################")
print("")

# Open CSV and write results.
with open('healthData.csv', 'wb') as f:
    writer = csv.writer(f)

    # Write headers for totals
    writer.writerow(["Date", "Sodium", "Carbohydrates", "Calories", "Fat", "Sugar", "Protein"])
    
    today = datetime.now().date()
    currentYear = today.year
    
    for yearIndex in range(beginningYear, currentYear+1):
        sys.stdout.write(str(yearIndex)+": ")
        sys.stdout.flush()
        for monthIndex in range(1, 12+1):
            for dayIndex in range(1, daysInMonth[monthIndex]+1):
                
                fullDateIndex = "%s-%s-%s" % (yearIndex, monthIndex, dayIndex)
                thisDate = datetime.strptime(fullDateIndex, "%Y-%m-%d").date()
                if(thisDate > today):
                    break;

                thisDaysNutritionData = client.get_date(yearIndex, monthIndex, dayIndex)
                thisDaysNutritionDataDict = thisDaysNutritionData.totals
                thisDaysNutritionValues = thisDaysNutritionDataDict.values()
                
                dataRow = [fullDateIndex] + thisDaysNutritionValues
                if dataRow:
                    writer.writerow(dataRow)

            sys.stdout.write("#")
            sys.stdout.flush()
        print(" -- Done")
{% endhighlight %}