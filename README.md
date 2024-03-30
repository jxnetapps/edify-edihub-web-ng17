# EdifyEdihubWeb

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

#============================
npm i "file://C:\Dev\Projects\jx-ng-extensions\dist\jx-ng-core\jx-ng-core-0.0.1.tgz"
npm i "file://C:\Dev\Projects\jx-ng-extensions\dist\jx-perfect-scrollbar\jx-perfect-scrollbar-0.0.1.tgz"

## DISABLE PRE-FLIGHT REQUEST=======
```
if (req.http.host == "CUSTOM_URL" ) {
set resp.http.Access-Control-Allow-Origin = "*";
if (req.method == "OPTIONS") {
   set resp.http.Access-Control-Max-Age = "1728000";
   set resp.http.Access-Control-Allow-Methods = "GET, POST, PUT, DELETE, PATCH, OPTIONS";
   set resp.http.Access-Control-Allow-Headers = "Authorization,Content-Type,Accept,Origin,User-Agent,DNT,Cache-Control,X-Mx-ReqToken,Keep-Alive,X-Requested-With,If-Modified-Since";
   set resp.http.Content-Length = "0";
   set resp.http.Content-Type = "text/plain charset=UTF-8";
   set resp.status = 204;
}

```