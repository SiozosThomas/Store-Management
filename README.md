# StoreManagement

This is a store management app that provides the main functions you'd expect from a store management app,
such as CRUD tables, CRD products on menu and manage products on each table.

## Features

* Create Table.
* View Tables.
* Update Table.
* Delete Table.
* Add Product.
* View Products.
* Delete Product.
* Add Product to Table.
* Delete Product from Table.
* Login/Logout.
* Sum of selected products on each table.

## Setup

* Clone this repo to your desktop
* npm install
* Change on backend/app.js the connection of mongoose.
  ** First Step, you'll need an account on MongoDB Atlas.
  ** Second Step, create a new Cluster (Free).
  ** Third Step, allow Network Access to your IP or 0.0.0.0/0 (anyone).
  ** Fourth Step, connect your app with your database.
  ** You are ready!
* ng serve for Angular, running at localhost:4200
* npm run start:server for API, running at localhost:3000
* Open your browser at localhost:4200

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.5.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
