![MNode](https://github.com/beraujjwal/mnodejs/blob/main/MNode.png?raw=true)

## Getting started

MNode is a basic skeleton written in JavaScript with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. MNode takes the pain out of development by easing common tasks used in many applications. MNode is accessible, powerful, and provides tools required for large, robust applications.

A ready-to-use boilerplate for REST API Development with Node.js, Express, and MongoDB.

This README would normally document whatever steps are necessary to get your application up and running.

## Advertise for Job/Work Contract

I am open for a good job or work contract. You can contact me directly on my email ([bera.ujjwal@hotmail.com](mailto:bera.ujjwal@hotmail.com 'bera.ujjwal@hotmail.com')) or on my skype `ujjwalbera`.

## Buy me a Coffee

Hi! I'm Ujjwal Bera, I'm an open source enthusiast and devote my free time to building projects in this field.

I'm the creator and maintainer of [MNode](https://github.com/beraujjwal/mnodejs/blob/main/README.md) and [SNode](https://github.com/beraujjwal/snode/blob/main/README.md).

I'm doing my best to provide you a good experience when using my apps, so if you like what I'm doing and wish to say "thanks!", You can appreciate me or my hard work and time spent to create this helpful structure with buying me a coffee.

<a href="https://www.buymeacoffee.com/beraujjwalu" target="_blank"><img src="https://bmc-cdn.nyc3.digitaloceanspaces.com/BMC-button-images/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>

## Features

- Multiple environment ready (development, production)
- Basic Authentication (Register/Login/Forgot Password)
- Profile Management (Pull Profile Details/Update Profile/Change Password)
- Email helper ready just import and use.
- Integrated Authorization.
- Integrated ACL with User permission & Role Permission.

## Software Requirements

- Node.js **10+** (Recommended **12+**)
- MongoDB **4+** (Recommended **4.4+**)

## How to install

### Using Git (recommended)

1.  Clone the project from github. Change "nodeapp" to your project name.

```bash
git clone https://github.com/beraujjwal/mnodejs.git ./nodeapp
```

### Using manual download ZIP

1.  Download repository
2.  Uncompress to your desired directory

### Install npm dependencies after installing (Git or manual download)

```bash
cd nodeapp
npm install
npm update
```

### Setting up environments

1.  You will find a file named `.env.dist` on root directory of project.
2.  Create a new file by copying and pasting the file and then renaming it to just `.env`
    ```bash
    cp .env.dist .env
    ```
3.  The file `.env` is already ignored, so you never commit your credentials.
4.  Change the values of the file to your environment. Helpful comments added to `.env.dist` file to understand the constants.

## How to run

### Database cleaning and seeding samples

There are 3 available commands for this: `fresh`, `clean` and `seed`.

```bash
npm run command
```

- `fresh` cleans and then seeds the database with dynamic data.
- `clean` cleans the database.
- `seed` seeds the database with dynamic data.

### Running API server locally

```bash
npm run dev
```

You will know server is running by checking the output of the command `npm run dev`

```bash
✔ Bootstrapping Application
✔ Mapping Routes
✔ Mode: YOUR_APP_MODE
✔ Port: YOUR_APP_PORT
✔ Starting Application
✔ Application Started
✔ Connected to database with  YOUR_DB_CONNECTION_STRING
```

**Note:** `YOUR_APP_MODE` is your application running mode that you have set up in `.env` file, `YOUR_APP_PORT` is your node port that you have set up in `.env` file for run node app and `YOUR_DB_CONNECTION_STRING` will be your MongoDB connection string.

### Creating new models

If you need to add more models to the project just create a new file in `/models/` and use them in the controllers or services by this.db.modelname.

### Creating new routes

If you need to add more routes to the project just create a new file in `/routes/` for web and add in `/routes/api` for api. It will be loaded dynamically.

### Creating new controllers

If you need to add more controllers to the project just create a new file in `/app/controllers/` and use them in the routes.

### Helpfull Commands from CLI to create files (recommended)

```bash
node cli make:controller product
node cli make:model product
node cli make:service product
node cli make:validation product
node cli make:middleware product
```

## Authorization & ACL setting

### Authorization setting example in router

```js
router.get('/users', [authMiddleware.verifyToken], usersController.userStore);
```

### ACL setting example in router

```js
router.post(
  '/users',
  [authMiddleware.verifyToken, aclMiddleware.hasPermission('read', 'users')], // "read" as action, "users" as resource
  usersController.userStore,
);
```

## Tests

### Running Test Cases

```bash
npm test
```

### Creating new tests

If you need to add more test cases to the project just create a new file in `/test/` and run the command.

## Bugs or improvements

Every project needs improvements, Feel free to report any bugs or improvements. Pull requests are always welcome.

## Who do I talk to?

- [Ujjwal Bera](https://github.com/beraujjwal)

## Release History

- 2021-09-09 [Pre-release][] (public, Pre-release)

[pre-release]: https://github.com/beraujjwal/mnodejs/releases/tag/v0.1

## License

This project is open-sourced software licensed under the MIT License. See the LICENSE file for more information.
