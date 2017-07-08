---
layout: post
title: HMIS, R, and SQL -- Basics
series: SQL-R
categories: HMIS
excerpt:
tags: [ETO, HMIS, R, SQL]
image: 
    feature: R_SQL.png
comments: true
custom_css:
custom_js: 
---

## Hacker Introduction

![](/../../images/Screenshot%202016-12-27%2007.39.30.png)I'm a _hacker_.  If you find errors, please leave comments below.  If you have an opinion I'll hear it, but I'm often not likely to agree without some argument.  

### Joins (Merging Data)

Probably the best part of R and SQL is their ability to quickly combine data around a key.  For example, in HMIS CSVs the Client.csv contains a lot of demographic information and the Enrollment.csv contains a lot of assessment information.  This makes it difficult when needing a count of the total participants who are veterans and disabled, since the veteran information is in Client.csv and disability information is in the Enrollment.csv.  However, both R and SQL contain the join functions.    

Joins are a hughely expansive topic; I'm not going to try to cover all their quirks, but here's some videos I found helpful:  

<iframe allowfullscreen="" frameborder="0" height="180" src="//www.youtube.com/embed/KTvYHEntvn8" width="320"></iframe>  

The two useful joins for HMIS data are LEFT JOIN and INNER JOIN.  The left join keeps all the data in the left table and data matching from the right table and the inner join keeps only data which matches.  

Here's an example in the context of the Client.csv and Enrollment.csv:  

Client.csv

<table border="1" cellpadding="1" cellspacing="1" style="width: 312px;">

<tbody>
<tr>
<td>PersonalID</td>
<td>FirstName</td>
<td>VeteranStatus</td>
</tr>
<tr>
<td>12345</td>
<td>Jane</td>
<td>Yes</td>
</tr>
<tr>
<td>54321</td>
<td>Joe</td>
<td>No</td>
</tr>
</tbody>
</table>

Enrollment.csv
<table border="1" cellpadding="1" cellspacing="1" style="width: 312px;">
<tbody>
<tr>
<td>PersonalID</td>
<td>FirstName</td>
<td>DisablingCondition</td>
</tr>
<tr>
<td>12345</td>
<td>Jane</td>
<td>Yes</td>
</tr>
<tr>
<td>54321</td>
<td>Joe</td>
<td>No</td>
</tr>
<tr>
<td>45321</td>
<td>Sven</td>
<td>Yes</td>
</tr>
</tbody>
</table>

Here are the two join statements and their results for the data above

{% highlight sql %}
SELECT * 
   FROM client a 
   LEFT JOIN enrollment b ON a.Personal=b.PersonalID
{% endhighlight %}

This join should result in the following:

<table border="1" cellpadding="1" cellspacing="1" style="width: 312px;">

<tbody>

<tr>

<td>PersonalID</td>

<td>FirstName</td>

<td>VeteranStatus</td>

<td>DisablingCondition</td>

</tr>

<tr>

<td>12345</td>

<td>Jane</td>

<td>Yes</td>

<td>Yes</td>

</tr>

<tr>

<td>54321</td>

<td>Joe</td>

<td>No</td>

<td>No</td>

</tr>

<tr>

<td>45321</td>

<td>Sven</td>

<td>NULL</td>

<td>Yes</td>

</tr>

</tbody>

</table>

Notice Sven was kept, even though he had no entry the Client.csv.  After the join, since he had no   
And the inner join would look like this:

{% highlight sql %}
SELECT * 
       FROM client a 
       INNER JOIN enrollment b ON a.Personal=b.PersonalID
{% endhighlight %}

This join should result in the following:

<table border="1" cellpadding="1" cellspacing="1" style="width: 312px;">

<tbody>

<tr>

<td>PersonalID</td>

<td>FirstName</td>

<td>VeteranStatus</td>

<td>DisablingCondition</td>

</tr>

<tr>

<td>12345</td>

<td>Jane</td>

<td>Yes</td>

<td>Yes</td>

</tr>

<tr>

<td>54321</td>

<td>Joe</td>

<td>No</td>

<td>No</td>

</tr>

</tbody>

</table>

### Counts

{% highlight r %}
PersonalID <- sqldf("SELECT DISTINCT PersonalID FROM client")
{% endhighlight %}

Method above creates a vector of all the PersonalIDs in the client data-frame, which came from the Client.csv.  The DISTINCT command takes only one ID if there are more than two which are identical.  In short, it create a de-duplicaed list of participants.  

For example,

<table border="1" cellpadding="1" cellspacing="1" style="width:500px;">

<tbody>

<tr>

<td>PersonalID</td>

<td> OtherData</td>

</tr>

<tr>

<td>12345</td>

<td>xxxxxxxxx</td>

</tr>

<tr>

<td>56839</td>

<td>xxxxxxxxx</td>

</tr>

<tr>

<td>12345</td>

<td>xxxxxxxxx</td>

</tr>

<tr>

<td>32453</td>

<td>xxxxxxxxx</td>

</tr>

</tbody>

</table>

Should result in the following,

<table border="1" cellpadding="1" cellspacing="1" style="width: 253px;">

<tbody>

<tr>

<td style="width: 245px;">PersonalID</td>

</tr>

<tr>

<td style="width: 245px;">12345</td>

</tr>

<tr>

<td style="width: 245px;">56839</td>

</tr>

<tr>

<td style="width: 245px;">32453</td>

</tr>

</tbody>

</table>

This is useful in creating a key vector, given other CSVs have a one-to-many relationship for the PersonalID.  For example,  

The Enrollment.csv looks something like this

<table border="1" cellpadding="1" cellspacing="1" style="width:500px;">

<tbody>

<tr>

<td>PersonalID</td>

<td>ProjectEntryID</td>

<td> EntryDate</td>

</tr>

<tr>

<td>12345</td>

<td>34523</td>

<td>2016-12-01</td>

</tr>

<tr>

<td>56839</td>

<td>24523</td>

<td>2015-09-23</td>

</tr>

<tr>

<td>12345</td>

<td>23443</td>

<td>2014-01-10</td>

</tr>

<tr>

<td>32453</td>

<td>32454</td>

<td>2015-12-30</td>

</tr>

</tbody>

</table>

This reflects a client (i.e., 12345) entering a project twice, once on 2014-01-10 and the other 2016-12-01.

### Count of Total Participants:

{% highlight sql %}
SELECT COUNT(PersonalID) as 'Total Participants' FROM client
{% endhighlight %}

This query should give a on row output, counting the number of clients in the data-frame.

<table border="1" cellpadding="1" cellspacing="1" style="width: 181px;">

<tbody>

<tr>

<td style="width: 121px;">Total Participants</td>

</tr>

<tr>

<td>1</td>

<td class="rtecenter" style="width: 121px;">1609</td>

</tr>

</tbody>

</table>

However, if there are duplicate PersonalIDs it'll count each entry as an ID.  To get a count of unique clients in a data-frame add the DISTINCT command.

{% highlight sql %}
SELECT COUNT(DISTINCT(PersonalID)) as 'Unique Total Participants' FROM client
{% endhighlight %}
### Conditional Data

Often in HMIS data it is necessary to find a collection of participants which meet a specific requirement.  For example, "How many people in this data-set are disabled?"  This is where the WHERE statement helps a lot.

{% highlight sql %}
SELECT PersonlID FROM clientAndEnrollment WHERE disability = 'Yes'
{% endhighlight %}

This statement will return a vector of all the PersonalID's of participants who stated they were disabled.  The total participant query could be used, but there is an alternative method.  

{% highlight sql %}
SELECT SUM(CASE WHEN 
               disability = 'Yes' THEN 1 ELSE 0 
           END) as DisabledCount
{% endhighlight %}

The above statement uses the CASE WHEN END statement, which I understand as SQL's version of the IF statement.  Here's C equivalent:

{% highlight c %}
for(int i = 0; i < total_participants; i++)
    if(disability == true){
       disabilityCounter++;
    }
}
{% endhighlight %}

### BOOL!

Boolean operaters can be used to get more complex conditional data:

{% highlight sql %}
SELECT PersonalID FROM clientAndEnrollment 
       WHERE disability = 'Yes' 
       AND gender = 'Female'
{% endhighlight %}

This statement will provide a vector of all the PersonalID's for clients who are disabled and female.  

Ok, good stopping point for now.