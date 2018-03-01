---
layout: post
title: Lag and Lead before MySQL 10.2
categories: MySQL
tags: [mysql, lag, lead, dates]
color: "#152a55"
image:
  feature: 
  teaser: 
  thumb:
comments: true
---

[Advanced MySQL User Variable Techniques](https://www.xaprb.com/blog/2006/12/15/advanced-mysql-user-variable-techniques/)

{% highlight sql %}
CREATE TABLE attendance(
   id   INTEGER  NOT NULL
  ,date DATE  NOT NULL
);
INSERT INTO attendance(id,date) VALUES (1,'2012-09-10');
INSERT INTO attendance(id,date) VALUES (1,'2012-09-11');
INSERT INTO attendance(id,date) VALUES (1,'2012-09-12');
INSERT INTO attendance(id,date) VALUES (1,'2012-09-13');
INSERT INTO attendance(id,date) VALUES (1,'2012-09-14');
INSERT INTO attendance(id,date) VALUES (1,'2012-10-11');
INSERT INTO attendance(id,date) VALUES (1,'2012-10-12');
INSERT INTO attendance(id,date) VALUES (1,'2012-10-13');
INSERT INTO attendance(id,date) VALUES (2,'2012-08-09');
INSERT INTO attendance(id,date) VALUES (2,'2012-08-10');
INSERT INTO attendance(id,date) VALUES (2,'2012-08-11');
INSERT INTO attendance(id,date) VALUES (2,'2012-08-12');
INSERT INTO attendance(id,date) VALUES (2,'2012-08-17');
INSERT INTO attendance(id,date) VALUES (2,'2012-08-22');
INSERT INTO attendance(id,date) VALUES (2,'2012-09-23');
INSERT INTO attendance(id,date) VALUES (4,'2012-10-01');
INSERT INTO attendance(id,date) VALUES (4,'2012-10-02');
INSERT INTO attendance(id,date) VALUES (4,'2012-10-03');
INSERT INTO attendance(id,date) VALUES (4,'2012-10-04');
INSERT INTO attendance(id,date) VALUES (4,'2012-11-01');
INSERT INTO attendance(id,date) VALUES (4,'2012-11-02');
INSERT INTO attendance(id,date) VALUES (4,'2012-11-03');
INSERT INTO attendance(id,date) VALUES (4,'2012-11-22');
INSERT INTO attendance(id,date) VALUES (5,'2012-11-01');
INSERT INTO attendance(id,date) VALUES (5,'2012-12-01');
INSERT INTO attendance(id,date) VALUES (5,'2012-12-02');
INSERT INTO attendance(id,date) VALUES (5,'2012-12-03');
INSERT INTO attendance(id,date) VALUES (5,'2012-12-04');
INSERT INTO attendance(id,date) VALUES (5,'2012-12-05');
INSERT INTO attendance(id,date) VALUES (5,'2012-12-06');
INSERT INTO attendance(id,date) VALUES (5,'2012-12-07');
INSERT INTO attendance(id,date) VALUES (5,'2013-01-23');
INSERT INTO attendance(id,date) VALUES (5,'2013-01-24');
INSERT INTO attendance(id,date) VALUES (5,'2013-01-28');
INSERT INTO attendance(id,date) VALUES (5,'2013-02-02');
INSERT INTO attendance(id,date) VALUES (5,'2013-02-03');
INSERT INTO attendance(id,date) VALUES (5,'2013-02-04');
INSERT INTO attendance(id,date) VALUES (5,'2013-02-05');
INSERT INTO attendance(id,date) VALUES (5,'2013-02-06');
INSERT INTO attendance(id,date) VALUES (5,'2013-02-07');
{% endhighlight %}

After inserting these data you should have a table like this:

| id | date     | 
|-|-|
| 1  | 09/10/12 | 
| 1  | 09/11/12 | 
| 1  | 09/12/12 | 
| 1  | 09/13/12 | 
| 1  | 09/14/12 | 
| 1  | 10/11/12 | 
| 1  | 10/12/12 | 
| 1  | 10/13/12 | 
| 2  | 08/09/12 | 
| 2  | 08/10/12 | 
| 2  | 08/11/12 | 
| 2  | 08/12/12 | 
| 2  | 08/17/12 | 
| 2  | 08/22/12 | 
| 2  | 09/23/12 | 
| 4  | 10/01/12 | 
| 4  | 10/02/12 | 
| 4  | 10/03/12 | 
| 4  | 10/04/12 | 
| 4  | 11/01/12 | 
| 4  | 11/02/12 | 
| 4  | 11/03/12 | 
| 4  | 11/22/12 | 
| 5  | 11/01/12 | 
| 5  | 12/01/12 | 
| 5  | 12/02/12 | 
| 5  | 12/03/12 | 
| 5  | 12/04/12 | 
| 5  | 12/05/12 | 
| 5  | 12/06/12 | 
| 5  | 12/07/12 | 
| 5  | 01/23/13 | 
| 5  | 01/24/13 | 
| 5  | 01/28/13 | 
| 5  | 02/02/13 | 
| 5  | 02/03/13 | 
| 5  | 02/04/13 | 
| 5  | 02/05/13 | 
| 5  | 02/06/13 | 
| 5  | 02/07/13 | 
