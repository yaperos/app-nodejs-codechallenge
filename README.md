### Installation

1. Install NPM packages
   ```sh
   npm install
   ```
1. Rename or copy the `.env.dev` file from the app/antifraud, app/transaction folders to the project root as`.env`
1. Set your database credentials in your `.env` file
1. Run the applications with the `npm run start:dev <YOU APP>` command or the antifraud case with `npm run start:dev antifraud`
1. Visit `localhost:3000` in your browser

## Running the app

When starting mark the space you want to run, example `npm run start:dev antifraud`

```bash
# watch mode
$ npm run start:dev <YOU APP>

# debug mode
$ npm run start:debug <YOU APP>

```
