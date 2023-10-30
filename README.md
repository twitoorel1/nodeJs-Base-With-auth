## Starting Node js Project

# install node js project

1. npm init -y

# Copy Base File

1. .env File
2. config folder for environment
3. .gitignore file
4. .prettierrc.json
5. tsconfig.json
6. webpack.config.js

# Copy / Create Base Folder

1. src -> server.ts
2. database
3. errors
4. routes -> index.ts
5. types -> global.d.ts
6. utils -> dates.util.ts
<!-- Empty Folder -->
7. controllers
8. middlewares
9. models
10. public
11. services
12. validators

# Install Base dependencies

1. npm install

```
npm i express bcrypt multer nodemailer axios jsonwebtoken config cors dotenv helmet lodash moment moment-timezone mysql2 yup
```

2. npm install -D

```
npm i -D @types/express @types/bcrypt @types/config @types/cors @types/dotenv @types/lodash @types/node @types/multer @types/yup @types/nodemailer

npm i -D concurrently nodemon ts-loader ts-node typescript webpack webpack-cli webpack-node-externals @types/jsonwebtoken
```

# Write in files inside

1. package.json

```json
  "main": "dist/bundle.js",
  "scripts": {
    "start": "node ./dist/bundle.js",
    "build": "webpack",
    "dev": "concurrently \"webpack --watch\" \"nodemon ./dist/bundle.js\"",
    "delete": "rd /s /q dist && npm run build && npm start",
    "update-deps": "npm update --save",
    "update-dev-deps": "npm update --save-dev"
  },
```

===================================================

<!-- With Authentication -->

# base authentication

1. route
2. controllers
3. models
4. middlewares
5. constants
6. services
7. types
8. validations
9. RUN SQL File in mysql users.sql

# write in files inside OR copy file

1. copy [auth.routes.ts] file to controllers folder
2. copy [auth.controllers.ts] file to controllers folder
3. copy [user.models.ts] file to models folder
4. copy [auth.middleware.ts] file to middlewares folder
5. copy [regex.constant.ts] file to constants for regex
6. copy to folder services [jwt.services.ts] and [sendEmail.services.ts]
7. copy [auth.types.ts] file to types folder and check
8. write in [global.d.ts] file

```ts
import { IUser } from './auth.types';

export interface IDatabaseConfig {
	host: string;
	user: string;
	password: string;
	database: string;
}

// Global
declare module 'express' {
	interface Request {
		user?: IUser | string | object | null | undefined | any;
	}
}
```

9. write this in routes/index.ts

```ts
import authRoutes from './auth.routes';
router.use('/auth', authRoutes);
```

10. copy [authRequests.schema.ts] file to validations folder and check if this ok
