# Knowledge Hub API

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Docker Image

The application is available as a Docker image on Docker Hub:

**Image:** `bzzzuka/knowledge-hub-api:latest`

```bash
docker pull bzzzuka/knowledge-hub-api:latest
```

## Downloading

```
git clone {repository URL}
```

## Installing NPM modules

```
npm install
```

## Running application

```
npm start
```

After starting the app on port (4000 as default) you can open
For more information about OpenAPI/Swagger please visit https://swagger.io/.


## API Documentation
http://localhost:4000/doc

## Endpoints
- GET /user, POST /user, PUT /user/:id, DELETE /user/:id
- GET /article, POST /article, PUT /article/:id, DELETE /article/:id
- GET /category, POST /category, PUT /category/:id, DELETE /category/:id
- GET /comment?articleId=, POST /comment, DELETE /comment/:id

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

To run refresh token tests

```
npm run test:refresh
```

To run RBAC (role-based access control) tests

```
npm run test:rbac
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging


