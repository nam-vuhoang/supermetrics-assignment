# SuperMetrics Coding Assignment Report

## Introduction

This is my first ever project with the development of a React-based frontend and Node.js backend. Because during the last few years I mainly developed frontend with Angular+TypeScript and backend with Java. It took one week for me to catch up with all the new things for me together: **React**, **Next.js** (including its new experimental version), **SWR**, **Node.js**, **Express**, **Jest**, **Apollo**, etc. I had to learn a new way of thinking, innovative features and unexpected pitfalls of these technologies. Although during the last weeks I faced many other issues like the long sickness of my family members and me, and urgent tasks at work, I very much enjoyed this study journey! 

So, I would like to say big thanks to SuperMetrics for giving me the motivation to learn such interesting technologies! I would be very appreciative to get feedback from you, no matter whether it will be positive or negative. Because my main goal is not just to do this coding assignment, but to gather new knowledge that could benefit my future projects and career path. Therefore, if possible, please share openly your thoughts about my programming skills, and my knowledge of TypeScript, React, Next.js, Node.js, Jest, Apollo Server, etc.

In this document, I would like to describe briefly how I handle different aspects of the software development process. Hopefully, this will give you some picture on how well I can fit to the job position at your company and be a member of your development team!


## Installation guideline


## Requirement analysis and assumptions
According to the standard software development process, after analyzing the problem requirements, the development team and the client usually make a list of assumptions to constrain the functional and non-functional scope of the software product. However, because this assignment is for evaluating my coding skills, not for real use, I had to set the product scope myself. 
In this section, I explain how I analyzed the problem requirements and made the technical and non-technical assumptions. 

1.	UI pages:
    - The assignment requested to create a blog page of 1000 posts in a paginated format and a dashboard page for each user.
    - In addition to that, I developed blog pages for each user (in the same paginated format) and a dashboard for all users together in a pivot table format.
    - Furthermore, I added some nice visualization features to enhance the user experience and facilitate navigation between the pages, such as displaying short and full post messages, showing tooltips, navigation between sibling pages without refreshing the page, and so on.
2.	Fetching and caching data:
    - The data server returns 10 pages of posts, 100 posts per page. These posts are unordered and can be updated (added/deleted/modified) at any time. 
    - So, the only way to get up-to-date posts is to fetch all 10 pages when needed. Thanks to the small number and small size of the pages, this is not a big problem. In my testing environment, all pages can be loaded in about 1 sec.
    - Because the posts are not updated frequently and users do require to see new posts and new statistical data immediately, some delay is allowed. Therefore, it is reasonable to use some caching mechanisms (on both frontend and backend sides) with periodical data revalidation.
    - In particular, I set the automatic data refreshing interval to 1 minute for the blog page, and 5 minutes for the dashboard page (new data if any will be updated silently for the users). In the backend, I rely on the default settings of Apollo Server. 
3.	Date time zone:
    - I have noticed that the field ‘created_time’ in the original posts always uses the UTC zone. Therefore, I also calculate the frequency statistics and display all time fields in the UI using the same time zone.
4.	Security:
    - Due to lack of time, I did not implement authentication and authorization: neither for the frontend, nor for the backend. Of course, this is would not be acceptable in real products.
    - I assume that the popular frameworks such as **Next.js** or **Apollo Server** are reliable enough and do not have serious vulnerabilities.
5.	Testing:
    - Unit test: I implemented all possible unit and integration test cases for the backend (they will be described below). The test coverage is almost 100%. However, I did not implement unit tests for the frontend because its business logic classes were copied from the backend test cases. In addition, I don’t have experience with writing automatic test for UI yet.
6)	Test environment:
    - dev
    - product
7)	Coding style
