---
layout: post
title: Saving Apple HealthKit Data to MySQL
categories: data
series: Self-Sensored
excerpt:
tags: [mysql, business intelligence, data analytics]
image: 
    feature: data-analytics-series/wood-files-jan-antonin-kolar.jpeg
comments: true
custom_css:
custom_js: 
---


# Apple Notes:

1. You have to add the following to `info.plist`
* Privacy - Health Share Usage Description -- String
* Privacy - Health Update Usage Description -- String
* Privacy - Health Records Usage Description -- String

```xml
<?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
    <plist version="1.0">
    <string>So I can reclaim my data, damnit.</string>
</plist>

<?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
    <plist version="1.0">
    <string>So I can reclaim my data, damnit.</string>
</plist>

<?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
    <plist version="1.0">
    <string>So I can reclaim my data, damnit.</string>
</plist>

<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>NSAllowsArbitraryLoads</key>
	<true/>
</dict>
</plist>
```

# MariaDB
1. Make sure you index.
2. If you want to play with start up options, change the settings in `/etc/my.cnf` and make sure they are between `[mysqldf]` and `[mysqld_safe]`.  I made the mistake of putting my settings at the bottom of the file, this fell under the `mysqld_safe` and would not be applied to my normal startup.
3.  