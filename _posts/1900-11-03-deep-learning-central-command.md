---
layout: post
title: Using Python, NodeJS, Angular and SQL to Create a Machine Learning System
desription: TBD
categories: data
excerpt:
tags: [Node, Python, Angular, Machine Learning, MySQL]
series: PANS Stack
image: 
    feature: louis-reed-747361-unsplash.jpg
    credit: Louis Reed
comments: true
custom_css: 
custom_js: 
---

I've started designing a system to manage data analysis tools I build.  

1. A RESTful interface
2. Interface for existing Python scripts
3. Process for creating micro-services from Python scripts
4. Interface for creating machine learning jobs to be picked up my free machines.
5. Manage a job queue for work machines to systematically tackle machine learning jobs
6. Data storage and access
7. Results access and job meta data
8. A way to visualize results

I've landed on a fairly complicated process of handling the above.  I've tried cutting the number of frameworks down, as I know it'll be a nightmare to maintain, but I'm not seeing it.

* Node for creating RESTful interfaces between the `HQ Machine` and the `Worker Nodes`
* Node on the workers to ping the HQ machine periodically to see if their are jobs to run
* MongoDB on the `HQ Machine` to store the job results data, paths to datasets, and possibly primary data
* Angular to interact with the `HQ Node` for creating job creation and results viewing UI.
* [ngx-datatables](https://github.com/swimlane/ngx-datatable) for viewing tabular results.
* [ngx-charts](https://github.com/swimlane/ngx-charts) for viewing job results (e.g., visualizing variance and linearity )
* Python for access to all the latest awesome ML frameworks
* [python-shell (npm)](https://www.npmjs.com/package/python-shell) for creating an inteface between Node and Python.


```
+-Local------------------------------------------------------+
|                                                            |
|        ____                   ____      Each machine runs  |
|        |""|                   |""|      Node and Express   |
|  HQ    |__|             #1    |__|      server, creating   |
|       [ ==.]`)               [ ==.]`)   routes to Python   |
|       ====== 0               ====== 0   scripts using      |
|  The HQ machine runs          ____      stdin and stdout   |
|  Node and Express, but        |""|                         |
|  the routes are for     #2    |__|                         |
|  storing results in a        [ ==.]`)                      |
|  database.                   ====== 0                      |
|                               ____                         |
|                               |""|                         |
|                         #3    |__|        Worker           |
|                              [ ==.]`)     Nodes            |
|                              ====== 0                      |
|                                                            |
+------------------------------------------------------------+
```


```
+-Local------------------------------------------------------+
|                 Each worker Node checks         Workers    |
|        ____    with HQ on a set interval         ____      |
|        |""|       for jobs to run                |""|      |
|  HQ    |__|   <--------------------------+ #1    |__|      |
|       [ ==.]`)                                  [ ==.]`)   |
|       ====== 0                                  ====== 0   |
|       ^ |                                        ____      |
|       | |                                  #2    |""|      |
|       | +--------------------------------------->|__|      |
|       |             If there is a job, the      [ ==.]`)   |
|       |             Worker will send a GET      ====== 0   |
|       |              request for the job         ____      |
|       |                  parameters              |""|      |
|       |                                    #3    |__|      |
|       +-----------------------------------------[ ==.]`)   |
|         Once completed, the Worker updates HQ   ====== 0   |
|              with the job results.                         |
+------------------------------------------------------------+
```