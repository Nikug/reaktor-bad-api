# Bad API assignment

The solution I came up for the bad API is that it fetches all the data at the start and stores it, after which it is quick to browse the data.
This is because fetching the data is really slow, so it is done as rarely as possible.
The client updates the data automatically every six minutes, and it can be also manually updated with a button.
This means that the data in the client is mostly up-to-date.

In case availability data yields errors, the data is refetched. Since all the manufacturers in the different categories are the same, the results of the availability queries are cached.

The assignment was about using the API and not making the frontend look good, so there is minimal effort in styling the user interface.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.
