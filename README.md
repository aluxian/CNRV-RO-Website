# CNRV.ro Website

## About
- App built on Node.js, uses the [GeddyJS](http://geddyjs.org/) framework. On frontend I used Twitter Bootstrap and Flat UI.
- High School's old website: [http://www.cnrv.ro](http://www.cnrv.ro)
- New website: [http://alux-cnrv.herokuapp.com](http://alux-cnrv.herokuapp.com)

## How to deploy on localhost
- Clone the repo
- Install node dependencies `npm install`
- Import sample db `mongorestore --db <database> <app_folder>/_dump/`
- Run `geddy` in the app's folder
- Open the app on `localhost:4000`

## Features
- Authentication system using passport (registration, login, facebook integration)
- Posts and Pages (anyone can create, can be edited/removed only by owner or admin)
- Menus, Links (can be created/edited/removed only by admin)
- Posts feed with pagination
- Commenting system
- Widgets (recent posts, recent comments and links)

## Still in development
- On-site notifications (e.g. when a user writes a content-less post, there should appear an error notification) and emails
- Profile pages, settings
- Different user roles (for parents, students, teachers, admin)
- Anyone can post articles (but non-admin-or-teacher accounts will require approval). This will make the website more popular, as teachers usually try to get students to write articles

## Interesting future ideas (which may or may not be implemented)
- Grading system (so parents can see their children's grades online)
- Class entities (with students and teachers), and each class can have their own feed of articles
- Make it more social by integrating more with facebook (e.g. letting users send each other messages, on-site, but through facebook)

## Author
- Alexandru Rosianu
- [contact@aluxian.com](mailto:contact@aluxian.com)
- [http://www.aluxian.com](http://www.aluxian.com)
