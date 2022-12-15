# STAKING REWARDS EXCEL TEST

## 1. Initial considerations

Given the instructions of the exercise there were a couple of import points to consider.

1. Performance

   An application like this can contain a lot of data, so that's why the performance is critical, we have minimize the amount of operations to the minimum possible.

2. Reactive UI

   Linked to the previous point. Given that there can be plenty of cells in a spreadsheet, and they might be connected between each other, we have to find a proper mechanism that is able to update them in an performant way.

3. Usability

   The app can't wait for the server to return in order to allow the user to continue with the modifications.

## 2. Chosen solutions

Following the three points from the previous section, the solutions I have come up with are:

1. A spreadsheet can be big, but the screen size is somewhat limited. This is why I think a good approach is to only render the rows and cells that are visible. This should limit the amount of updates allowing us to have really big spreadsheets with a small impact on the performance of the UI.
2. Cells in the spreadsheet can be connected through formulas. We can't parse these continuosly in order to know what connections exist. We have to find a data strcuture that allows us to store and query this data in a performant way.
3. We'll use an optimistic approach, the user can perform as many changes as he wants in the spreadsheet. In the meantime, there is a mechanism in the background that syncs these changes with the server.

## 3. Details about implementation

1. Grid component

   Different options were considered, but always having the previous points in mind. I wanted a component that only rendered visible rows, with a more or less good documentation and that allowed CSS customizations. After several tests, the best one that suits our needs is this: [React Spreadsheet Grid](https://www.npmjs.com/package/react-spreadsheet-grid).

2. Cell dependencies

   Given the way that cells can depend on each other, I thought that the best data structure to hold this data could be a Graph. [Dependency Graph](https://www.npmjs.com/package/dependency-graph) provided the required functionalities, is easy to use and the documentation is good enough.

3. Optimistic approach

   The app stores all the changes in the redux store. There is a syncing mechanism that runs periodically checking for "unsaved" changes. This also takes care of slow queries and failing ones.

## 4. Grid component

The chosen library provided out the box the logic to only render the cells that are visible within the viewport. This faciliated the work a bit so I could focus on other areas of the application.

## 5. Dependency Graph

The graph is updated every time a cell is changed (if this contains a formula with referenced cells). An example of how it looks could be this:

```
A0: 1       B0: 2       C0: =A0+B0

A1: 3       B1: =C0+2   C1: 4
```

In this case, C0 has a dependency on A0 and B0, so does B1 on C0:

```
        /-> A0
B1 -> C0
        \-> B0
```

Thanks to this graph, we can quickly check what dependecies cells have on each other, get those values from the store, and calculate the result.

If any child node has an error (value can't be calculated because the formula is wrong or data type is incompatible), this error will buble up to parent cells. Once fixed, all the cells in the "chain" are updated with the result of the operation.

All this logic can be found on [dependecyGraph](./src/utils/dependencyGraph/index.ts) folder and [useExpressionParser.ts](./src/hooks/useExpressionParser.ts).

### 5.1. useExpressionParser

This custom hook has been implemented to manage the logic of the calculations of the cells. The way it works is as follows:

1. If expression empty or doesn't start with "=", return it
2. Get referenced cells by the formula (if any). As part of this process the dependency graph is updated.
3. Get values from referenced cells (if any).
4. Pass the expression and the variables to the [mathematical processor](https://mathjs.org/).
5. Return the result.

## 6. Error handling

=== Explain Sync component ===

## 7. Stress testing

The maximum amount of records I tried loading was 1,000,000. Initially the app took a bit to load since the "fake" CSV had to be parsed. Once loaded, the responsiveness of the app wasn't affected. Even when rows are not rendered (thanks to the grid component) on the screen, their data is accessible accessible through redux store.

## 8. Dummy data

A simple mechanism to pre-poluate the grid has been implemented. A stringified CSV file can be found under [fakeCSVData.json](./src/api//fakeCSVData.json). A "mocked" API ([getCSVData](./src/api/index.ts)) has been implemented. Data validation is performed to ensure the format of the data is correct. This is just to illustrate how data validation would be done in the frontend. I used Joi, although there are other alternatives that might be better than this (eg: [io-ts](https://gcanti.github.io/io-ts/)).

## 9. How to run the app

```
npm start
```

## 10. How to run the tests

```
npm t
```
