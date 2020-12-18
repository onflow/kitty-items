# kitty-items-js

API that sends transactions to the Flow Blockchain:

- Mint Kibbles
- Mint Kitty Items

### Running API

- Install npm dependencies:

```
npm install
```

- Run docker:
```
docker-compose up -d
```

- Start app:

```
npm run start:dev
```


### Creating a new database migration:

```shell
npm run migrate:make
```

Migrations are run automatically when the app initializes
