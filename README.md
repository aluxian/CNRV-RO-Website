# CNRV.ro Website

## About
- Built on Node.js
- Server-side: uses the [GeddyJS](http://geddyjs.org/) framework
- Client-side: uses Twitter Bootstrap and Flat UI

## How to deploy on localhost
- Clone the repo
- Install node dependencies with `npm install`
- Copy `.env-sample` as `.env` and set the required vars
- Run with `foreman start`
- Open the app on `localhost:5000/`
- Log in and create some posts
- You can see the online version with content [here](http://cnrv.herokuapp.com)

## Features
- Authentication system using Facebook (passport)
- Posts and Pages (anyone can create, can be edited/removed only by owner or admin)
- Menus, Links, Categories (can be created/edited/removed only by admin)
- Posts feed with pagination
- Commenting system
- Widgets (recent posts, recent comments and links)

## Author
- Alexandru Rosianu
- [contact@aluxian.com](mailto:contact@aluxian.com)
- [http://www.aluxian.com](http://www.aluxian.com)

## Libraries

I don't own:

- The packages defined in package.json
- All the files in `public/js` except `app.js`

