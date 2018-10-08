---
layout: post
title: Using Python, NodeJS, Angular, and MongoDB to Create a Machine Learning System
desription: TBD
categories: data
excerpt:
tags: [Node, Python, Angular, Machine Learning, MongoDB]
series: Mad Datum
image: 
    feature: louis-reed-747361-unsplash.jpg
    credit: Louis Reed
comments: true
custom_css: 
custom_js: 
---

I've started designing a system to manage data analysis tools I build.  

1. An illegitimate REST interface
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
* [python-shell (npm)](https://www.npmjs.com/package/python-shell) for creating an interface between Node and Python.

### Utilizing all Machines in the House
Machine learning is a new world for me.  But, it's pretty dern cool.  I'm a lover of making machines do the hard stuff while I'm off doing other work.  It makes me feel productive--like, I created that machine, so any work it does I get credit for.  _And_! The work I did while it as doing its work.  This is the reason I own two 3D-printers.  And I'm noticing there is a possibility of utilizing old computers I've lying around the house.  The plan is to abstract a neural network script, install it on all the computers I've sitting around the house, and then create a `HQ Computer` where I can create a set of hyperparameters passed to the `Worker Nodes` throughout the house.

Why?  Glad I asked for you. I feel guilty there are computers sitting not being used.  There's an old AMD desktop with a GFX1060 in it, a 2013 MacBook Pro (my sons), and my 2015 MacBook Pro.  All of these don't see much use anymore, since my employer has provided an iMac to work on.  They need to earn their keep.

How? Again, glad to ask for you.  I'll create a system to make deep-learning jobs from hyperparameter sets and send them to these idle machines, thus, trying to get them to solve problems throughout the day, while I'm working on paying the bills.  This comes from the power of NNs.  They need little of manual tweaking.  You simply provide them with hyperparameters and let them run.

Here are my napkin doodles:
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

### Worker Nodes
The `Worker Nodes` code is pretty straightforward.  It uses Node, Express, and python-shell to create a bastardized REST interface to create simple interactions between the `HQ Node` controlling the job queue.

Here's the proof-of-concept NodeJS code.
```js
var express = require('express');
var bodyParser = require('body-parser');
var pythonRunner = require('./preprocessing-services/python-runner');

var app = express();
const port = 3000;

app.use(bodyParser.json())

// Python script runner interface
app.post('/scripts/run', (req, res) => {
    try {
        let pythonJob = req.body;
        pythonRunner.scriptRun(pythonJob)
        .then((response, rejection) => {
            res.send(response);
        });
    } catch (err) {
        res.send(err);
    }
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});
```

Here's the `python-runner.js`

```js
let {PythonShell} = require('python-shell')
var scriptRun = function(pythonJob){    
    return new Promise((resolve, reject) => {
        try {
            let options = {
                mode: 'text',
                pythonOptions: ['-u'], // get print results in real-time
                scriptPath: pythonJob.scriptsPath,
                args: [pythonJob.jobParameters.dataFileName, 
                       pythonJob.jobParameters.dataPath, 
                       pythonJob.jobParameters.writePath]
            };
            PythonShell.run(pythonJob.scriptName, options, function (err, results) {
                if (err) throw err;
                result = JSON.parse(results[0]);
                if(result) {
                    resolve(results);
                } else {
                    reject({'err': ''})
                }
            });
        } catch (err) {
            reject(err)
        }
    });
}
module.exports = {scriptRun}
```