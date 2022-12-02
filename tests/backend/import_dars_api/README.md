# importDARs api Unit Tests

The tests located in this directory are dedicated to ensuring that the importDARs API is working as intended. Rather than testing the api directly, we instead test the component functions that the api calls. This is because the api is a wrapper function that calls the component functions, and the component functions are the ones that actually do the work.

Explore the [database_population](./dars_database_population/) folder to see the tests for the component functions involved in creating the JSON object that is used to populate the database.

Explore the [dars_parsing](./dars_parsing/) folder to see the tests for the component functions involved in parsing the DARs.
