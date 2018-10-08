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

#### Node Side
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

The above code is a dead simple NodeJS server using Express. It is using `body-parser` middleware to shape JSON objects.  The `pythonJob` object looks something like this (real paths names have been changed to help protect their anonymity).

```json
{
    "scriptsPath": "/home/dirky-dork/dl-principal/python-scripts/",
    "scriptName": "data_prep.py",
    "jobParameters": {
        "dataFileName": "wine_quality.csv",
        "dataPath": "/home/dirky-dork/dl-data/",
        "writePath": "/home/dirky-dork/dl-data/encoded/"

    }
}
```
Each of these attributes will be passed to the Python shell in order to execute `data_prep.py`.  They are passed to the shell as system arguments.

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

#### Python Side
Here's the Python script in the above example.  It is meant to detect what type of data is in a table.  If it's is continuous it leaves it alone (I'll probably add normalization option as some point), if it is categorical, it converts it to a [dummy variable](https://en.wikipedia.org/wiki/Dummy_variable_(statistics)).  It then saves this encoded data on the `Worker Node` side (right now).  Lastly, it returns a `JSON` string back to the `node` side.

```python
"""
Created on Mon Jun 11 21:12:10 2018
@author: cthomasbrittain
"""

import sys
import json
#
filename = sys.argv[1]
filepath = sys.argv[2]
pathToWriteProcessedFile = sys.argv[3]

# TEST ###########
#filename = 'wine_quality_test_data.csv'
#filepath = '/Users/cthomasbrittain/dl-data/'
#pathToWriteProcessedFile = '/Users/cthomasbrittain/dl-data/encoded/'
#################

pathToData = filepath + filename

# Clean Data --------------------------------------------------------------------
# -------------------------------------------------------------------------------

# Importing data transformation libraries
import pandas as pd

# The following method will do the following:a
#   1. Add a prefix to columns based upon datatypes (cat and con)
#   2. Convert all continuous variables to numeric (float64)
#   3. Convert all categorical variables to objects
#   4. Rename all columns with prefixes, convert to lower-case, and replace
#      spaces with underscores.
#   5. Continuous blanks are replaced with 0 and categorical 'not collected'
# This method will also detect manually assigned prefixes and adjust the 
# columns and data appropriately.  
# Prefix key:
# a) con = continuous
# b) cat = categorical
# c) rem = removal (discards entire column)

def add_datatype_prefix(df, date_to_cont = True):    
    import pandas as pd
    # Get a list of current column names.
    column_names = list(df.columns.values)
    # Encode each column based with a three letter prefix based upon assigned datatype.
    # 1. con = continuous
    # 2. cat = categorical
    
    for name in column_names:
        if df[name].dtype == 'object':
            try:
                df[name] = pd.to_datetime(df[name])
                if(date_to_cont):
                    new_col_names = "con_" + name.lower().replace(" ", "_").replace("/", "_")
                    df = df.rename(columns={name: new_col_names})
                else:
                    new_col_names = "date_" + name.lower().replace(" ", "_").replace("/", "_")
                    df = df.rename(columns={name: new_col_names})                    
            except ValueError:
                pass
    
    column_names = list(df.columns.values)
    
    for name in column_names:
        if name[0:3] == "rem" or "con" or "cat" or "date":
            pass
        if df[name].dtype == 'object':
            new_col_names = "cat_" + name.lower().replace(" ", "_").replace("/", "_")
            df = df.rename(columns={name: new_col_names})
        elif df[name].dtype == 'float64' or df[name].dtype == 'int64' or df[name].dtype == 'datetime64[ns]':
            new_col_names = "con_" + name.lower().replace(" ", "_").replace("/", "_")
            df = df.rename(columns={name: new_col_names})
    column_names = list(df.columns.values)
    
    # Get lists of coolumns for conversion
    con_column_names = []
    cat_column_names = []
    rem_column_names = []
    date_column_names = []
    
    for name in column_names:
        if name[0:3] == "cat":
            cat_column_names.append(name)
        elif name[0:3] == "con":
            con_column_names.append(name)
        elif name[0:3] == "rem":
            rem_column_names.append(name)
        elif name[0:4] == "date":
            date_column_names.append(name)
            
    # Make sure continuous variables are correct datatype. (Otherwise, they'll be dummied).
    for name in con_column_names:
        df[name] = pd.to_numeric(df[name], errors='coerce')
        df[name] = df[name].fillna(value=0)
    
    for name in cat_column_names:
        df[name] = df[name].apply(str)
        df[name] = df[name].fillna(value='not_collected')
    
    # Remove unwanted columns    
    df = df.drop(columns=rem_column_names, axis=1)
    return df

# ------------------------------------------------------
# Encoding Categorical variables
# ------------------------------------------------------

# The method below creates dummy variables from columns with
# the prefix "cat".  There is the argument to drop the first column
# to avoid the Dummy Variable Trap.
def dummy_categorical(df, drop_first = True):
    # Get categorical data columns.
    columns = list(df.columns.values)
    columnsToEncode = columns.copy() 

    for name in columns:
        if name[0:3] != 'cat':          
            columnsToEncode.remove(name)

    # if there are no columns to encode, return unmutated.
    if not columnsToEncode:
        return df


    # Encode categories
    for name in columnsToEncode:

        if name[0:3] != 'cat':
            continue

        tmp = pd.get_dummies(df[name], drop_first = drop_first)
        names = {}

        # Get a clean column name.
        clean_name = name.replace(" ", "_").replace("/", "_").lower()
        # Get a dictionary for renaming the dummay variables in the scheme of old_col_name + response_string
        if clean_name[0:3] == "cat":
            for tmp_name in tmp:
                tmp_name = str(tmp_name)
                new_tmp_name = tmp_name.replace(" ", "_").replace("/", "_").lower()
                new_tmp_name = clean_name + "_" + new_tmp_name
                names[tmp_name] = new_tmp_name
        
        # Rename the dummy variable dataframe
        tmp = tmp.rename(columns=names)

        # join the dummy variable back to original dataframe.
        df = df.join(tmp)

    # Drop all old categorical columns
    df = df.drop(columns=columnsToEncode, axis=1)
    return df

df = pd.read_csv(pathToData)
df = add_datatype_prefix(df)
df = dummy_categorical(df)

filename = filename.replace(".csv", "")
import os
if not os.path.exists(pathToWriteProcessedFile):
    os.makedirs(pathToWriteProcessedFile)

writeFile = pathToWriteProcessedFile + filename + "_encoded.csv"
df.to_csv(path_or_buf=writeFile, sep=',')

# Process the results and return JSON results object
result = {'status': 200, 'message': 'encoded data', 'path': writeFile}
print(str(json.dumps(result)))
```