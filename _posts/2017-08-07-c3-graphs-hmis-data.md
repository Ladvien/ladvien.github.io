---
layout: post
title: C3 HMIS Graph Gallery
categories: Graphing
series: C3
excerpt: Using C3 JavaScript library to quickly create interactive graphs.
tags: [graphing, data, data-visualization, hmis]
image: 
    feature: 
comments: true
custom_css:
custom_js: 
---

## Trends of Homelessness, Rapid Rehousing, and Permanent Supportive Housing


<link href="https://ladvien.com/projects/d3/practice/c3-0.4.15/c3.css" rel="stylesheet">  
<script src="https://d3js.org/d3.v3.min.js"></script>
<script src="https://ladvien.com/projects/d3/practice/c3-0.4.15/c3.min.js"></script>
<script src="https://ladvien.com/projects/d3/tx-601/trends-tx-601.js"></script>

<div id="chartOne"></div>

### Individuals Experiencing Homelessness
This graph shows the trend of those homeless in Tarrant County, week-to-week who meet the following conditions:

1. The person counted has stayed at least one night in a Night-by-nNight shelter within 90-days of the week counted.
2. Or the person counted has been contacted by Street Outreach within 90-days of the week counted.
3. Or the person was active in an Entry / Exit shelter program within the week of the count.

Most likely the count is inflated approximately 33%, given there is a large known number of duplicates in the count.  The software used to generate the data has no administrator option to merge duplicates.  A request has been made for mass merger.

### Active in Rapid Rehousing
Another trend found in the graph is a week-to-week count of those homeless who are active in a Rapid Rehousing (RRH) project.

The duplicate issue should not be as pronounced here, as even if a duplicate where created during the sheltered phase of a participant's stay in homelessness, then only one of the pair would be enrolled into the housing project.  Therefore, enrollment into housing is a natural filter.

### Active in Permanent Supportive Housing
This trend is similar to the RRH trend.  

Notice the line is flat.  This is to be expected, as entry and exits are rare in Permanent Supportive Housing projects.

## Subpopulations

<script src="https://ladvien.com/projects/d3/tx-601/actively-homeless-subpopulations.js"></script>

<div id="chartTwo"></div>

This graph relates to the **Trends of Homelessness, Rapid Rehousing, and Permanent Supportive Housing** graph.  It looks at the last week of the same data.  Of those participants who are still actively homeless (and therefore eligible for housing), what sorts of barriers do these individuals face.  HUD refers to these groups of individuals with particular difficulties as "subpopulations."

It is important to understand these barriers are not mutually exclusive.  For example, **Jane** could report both a **Mental Health Problem** and **Substance Abuse Disorder** and she would therefore be counted in both sub-populations. 

The three are categories defined as follows:

* ***Eligible for Rapid Rehousing*** are individuals who are actively in a homeless situation and are not met the **chronically homeless** threshold.
* ***Eligible for Permanent Supportive Housing*** are individuals who are actively in a homeless situation are ***have*** met the threshold of **chronically homeless**
* ***All Eligible for Housing*** is the sum of both **Eligible for Rapid Rehousing** and **Eligible for Permanent Supportive Housing**
* It should be noted, **Eligible for Rapid Rehousing** and **Eligible for Permanent Supportive Housing** are mutually exclusive.  Therefore, the **All Eligible for Housing** is an accurate count save the duplicates described above.

### Trend of Subpopulations
<script src="https://ladvien.com/projects/d3/tx-601/trend-actively-homeless-subpopulations.html"></script>

<div id="trend-of-subpops"></div>



