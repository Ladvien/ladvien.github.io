---
layout: post
title: How to Build a Robotics Digital-Hackerspace
categories: robots
excerpt:
tags: [robots, hacker]
image: 
    feature: a1.JPG
comments: true
custom_css:
custom_js: 
---

### Some HTML

<u>Why the Hell?</u>

![LeavingLMR.jpg](/https://ladvien.com/images/LeavingLMR.jpg)Wow, it's been awhile since I've actually written anything in Drupal based text editor.  Feels like home.

Honestly, I'm not going to go into the "Why" of building this site.  Maybe I'll do that later.  Let's just say, there was an impetus to recreate the home we were forced to leave.

<u>How the Blink?</u>

Spinning Up a Server:

The first thing was deciding on a server.  I didn't have much (um, any) experiencing in spinning up a server.  But after a bit of reading, checking the bank account, and finding what would work for Drupal site, I chose [Linode](https://www.linode.com/). 

Definitely happy so far.  Their business model seems to be no frills Linux servers which are fast to spin up--if you know what you are doing.  Of course, I didn't.  Still, they had a lot of fairly up to date walkthroughs.

Here are the walkthroughs I used (in order) to spin up this server:

1.  [Getting Started](https://www.linode.com/docs/getting-started)
2.  [Securing your Server](https://www.linode.com/docs/security/securing-your-server)
3.  [Hosting a Website](https://www.linode.com/docs/websites/hosting-a-website)
4.  [Installing Drupal 7](https://www.linode.com/docs/websites/cms/managing-web-content-with-drupal-7)

This almost all the information needed to create this site's based.  A couple of caveats:

    sudo apt-get install php5 php-pear sudo apt-get install php5-mysql

Needs to be replaced with:

    sudo apt-get install php php-pear sudo apt-get install php-mysql

This will install the latest version of PHP, for me, that was PHP7.

Also, the install directory is different for PHP7\.  This is important, since the php.ini file needs to be edited.  In 7 it may be found:

    /etc/php/7.0/cli

The last thing to do was relocate the Drupal 7 files to the directory where Apache can serve them up.

    cd /var/www/html sudo wget https://ftp.drupal.org/files/projects/drupal-7.50.zip

If all the script-blogs are followed correctly, then when entering the web IP of the site in the browser you should see the following:

![Drupal_On_Linode.PNG](/https://ladvien.com/images/Drupal_On_Linode.PNG)

Design Goals:

Goals.  It's good to have them.  Thinking through what I'd like out of a new robot-home here are some of the concepts which seemed critical and important:

1.  An open place for anyone to express ideas, with minimum viable censorship.
2.  Responsive.  Not just mobile friendly, but optimized for quick viewing of information.
3.  Shoutbox.  Gots to have one.
4.  WYSIWYG and rich content editors:
    *   Iframes
    *   Image boxes
    *   Image storage system
    *   Code-highlighting including our favorite languages (and Ada for Mr. Bdk6)
5.  The primary features of our old home:
    *   Collect
    *   Chill-out Zone
    *   Forums
    *   Shoutbox, oh wait, already stated that.
6.  New features requested by members:
    *   Content rating
    *   Member points
    *   Wiki
    *   Anything we could dream of

Theme:

There are three layers to the theme: 

1.  [AdaptiveThemes](https://www.drupal.org/project/adaptivetheme\\) was selected as the main
2.  [Corolla](https://www.drupal.org/project/corolla) over it
3.  [FooTheme](https://www.drupal.org/project/footheme) went over it.

In the /var/www/html/sites/all/themes/corolla/ directory there is a file called corolla.info inside a referenced was added for css/corolla_overrides.css.  
![Screenshot 2016-10-10 18.59.30.png](/https://ladvien.com/images/Screenshot%202016-10-10%2018.59.30.png)  
Then, in the /var/www/html/sites/all/themes/corolla/css directory the corolla_override.css file was made which includes several hackish css snippets:  


{% highlight css %}
    /* The title was originally set to -5px (weird) */
    #site-name a {
      letter-spacing: 0px;
    }

    .wrap-code {
      overflow-x: scroll;
    }

    /* These hide some uncessary shoutbox labels. */
    .shoutbox-interval-msg {
      visibility: hidden;
      display: none;
    }
    #edit-nick{
      visibility: hidden;
      display:none;
    }
{% endhighlight  %}

Regarding the color scheme.  The palettee can be edited in the Footheme "Color" section.  This requires th Color (Drupal Core) module be enabled.  The palettee was selected by using [Pictaculous](http://www.pictaculous.com/) taking an image of Russian revolutionary art.  This was meant to capture the feeling palette selected by an artist with a better understanding of [color-emotion](https://designshack.net/articles/graphics/the-science-behind-color-and-emotion/) connections.  

![](http://3.bp.blogspot.com/-UNUkZH4wSVg/UMQieV7p8bI/AAAAAAAAO6g/gk-z_yAnkIA/s640/a1.JPG)  

Fonts  
Logo selection  

Modules:

[Admin Tools:](https://www.drupal.org/project/admin_tools)

"Admin Tools is an addon module for the [Admin](http://drupal.org/project/admin) module, which provides a sidebar navigation for selected roles. The Admin Tools module adds functionality and quick access for clearing caches, running cron and updates much like [Admin Menu](http://drupal.org/project/admin_menu)."

I _hate_ cache errors.  Mother-blinking cache!

[Administration Menu](https://www.drupal.org/project/admin_menu):

Admin tools sped up development a lot.  It basically simplifies the admin menu so 4th level items are exposed to one click.

Blog (core)

Allows the Drupal site act like a good old blog--for us, this allows multi-authoring content and management.

Block (core)

Allows a block design of the UI.

[Chaos Tools](https://www.drupal.org/project/ctools)

This is a dependency for other modules (a lot of others).

[CKEditor](https://www.drupal.org/project/ckeditor)![Screenshot 2016-09-24 20.49.03.png](/https://ladvien.com/images/Screenshot%202016-09-24%2020.49.03.png)

The CKEditor is the core of the Drupal blogging package.  It is the editor used to create this post.  However, it put up the most fight when trying to install.  Actually, that's not fair.  It wasn't the CKEditor it was the code highlighting which was such a pain.  The code highlighting allows this:  

{% highlight c %}
    for(int i = 0; i < marioTouchesRobots; i++){
        aHackerSpiritDies();
    }
{% endhighlight %}

I'm going to list out the steps used to setup the CKEditor used for this article, but then discuss some of the pitfalls, which ended up costing a lot of development time.  

Steps to Setup CKEditor with CodeSnippets and HighlightingJS:

1.  Download the [CKEditor - WYSIWYG HTML editor](https://www.drupal.org/project/ckeditor) module.
2.  Enable the CKEditor module.
3.  Go to Configuration-->CKEditor-->Edit CKEditor Global Profile
4.  Set the "Path to CKEditor" to //cdn.ckeditor.com/4.5.4/full-all. This will use the content delivery network to serve up the CKEditor JavaScript.  It also lets you access a lot of plugins without having to manage them.  The other option is to pull a copy on the local server--it's a lot more hassle managing.
5.  Go to Configuration-->CKEditor-->Profile X-->Edit (note, X = Text Editing profiles users will be able to select when blogging.  These can be managed under content Content Authoring --> Text Formats).
6.  Go to Basic Setup.  Here, add all the Text Formats this particular CKEditor profile should affect.![Screenshot 2016-10-02 10.43.11.png](/https://ladvien.com/images/Screenshot%202016-10-02%2010.43.11.png)
7.  Under Security make sure "Always run security filters for CKEditor" is Enabled (should default).
8.  Under Editor Appearance go straight to the check-box title "Plugin for inserting Code Snippets" and enable it.
9.  Also, enable what other CKEditor Plugins needed.  Note, there are more plugins then this, but these are the ones provided through the Content Delivery Network.
10.  Scroll to the end and hit Save.  Now, go back to Configuration-->CKEditor-->Profile X-->Edit.  Go straight to Editor Appearance.  There should be a new button available
11.  Add the Code Snippet button to the "Current Toolbar"
12.  This should enable the CKEditor and provide the Code Snippet button.
13.  Download the [highlight js](https://www.drupal.org/project/highlightjs) Drupal module.  This should be installed in the modules directory
14.  Navigate to var/www/html/sites/all/libraries folder and make a directory called 'highlightjs', switch to it.
15.  The highlight js module is dependent on the actual [highlightjs css](https://highlightjs.org/) libaries though.  Download a package in the /var/www/html/sites/all/libraries/highlightjs folder.
16.  Unzip highlightjs here.
17.  Issue the command 'sudo mv higlight.pack.js highlightjs'.  This is required or the highlight module can't find the libraries.
18.  And the command 'sudo chmod 666 highlightjs'.
19.  Go to the modules dashboard and enable Highlight JS Syntax.  <u>DO NOT</u> enable Highlight JS Filtetr.
20.  Open the modules /var/www/html/sites/all/modules/ckeditor$
21.  Type sudo nano ckeditor.config.js
22.  Add each HighlightJS language you would like to show in the dropdown box in the CKEditor.  The part on the left of the colon is should match the HighlighJS language code.  The part between the ' 's will be what is displayed in the CKEditor dropdown.  When adding supported languages, here's a good reference -- [Supported HighlightJS languages](http://highlightjs.readthedocs.io/en/latest/css-classes-reference.html) (but it doesn't include custom languages, like Arduino).  Don't forget to save when done.

{% highlight js %}
        config.codeSnippet_languages = {
            php: 'PHP',
            python: 'Python',
            arduino: 'Arduino',
            c: 'C'
        };
{% endhighlight %}

23.  ![Overflow.png](/https://ladvien.com/images/Overflow.png)There is an issue with the HighlightJS module where the text escapes the divs.  It took a long time to find the culprit.  Apparently, the HighlightJS modules causes this whenever it renders HTML produced by CKEditor.  
24.  Go to /var/www/html/sites/all/modules/highlightjs
25.  Type sudo nano highlight_js.css
26.  Enter the following style and save:

        .field-items {
          width: 100%;
        }

And that should be it.  A couple words of warning.  Make sure you don't enable the HighlightJS Filter.  This will essentially double encode the HTML entities inside the <code> block.  This causes >, <, and & to show as "&gt;, &lt, &amp;" respectively.  This simple little issue took a lot of development time to solve--given the manual was lacking.  

Color
Comment
Contextual Links
Dashboard
Database Logging
Entity API
Field
Field SQL Storage
Field UI
File
Filter
Five Star
Forum
Help
Highlighter JS Filter
Highlighter JS Syntax Highlighter
Image
IMCE
Libraries
List
Menu
Module Filter
Node (core)
Number
Options
Overlay
Path
Poll
RDF
Search
Shoutbox
Shoutbox Patch
Statistics
Statistics Counter
SysLog
System (core)
Taxnomy
Text (core)
Update Manager
User
Userpoints
Userpoints Service
Views
Views Content Panes
Views UI
Voting API