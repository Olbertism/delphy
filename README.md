## Delphy – Your fact check assistant tool

> Search for results to any given claim and check the claim against found results.

> Contribute to a claim and review database and grow a fact check resources.


## About

This is my final project from the UpLeveled Bootcamp class of spring 2022. It is an interactive web app that you can try out with the link in the description. Please make sure you read the disclaimer and do not spam search or evaluation requests. 


## Setup

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).



## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```



Refer to ```.env.example``` for an overview of needed environmental variables. Create your own .env file. (see also "External API dependencies" below)

Set up a PostgreSQL database

Run the database migrations ```yarn migrate up```

## roBERTa model integration
Make sure to check out the dedicated repository under: 

The roBERTa model is accessed like a normal external REST API. In essence, two pieces of text are transmitted to the model, which are then compared to each other checked for contradiction or agreement. You can find the code for the requests in ...

To a successful request, roBERTa will respond with an array of numbers from 0 to 2, which correlate to ..., neutral or ...


## External API dependencies

Delphy fetches results from the following external APIs:

- Google Factcheck Tool
- Wikipedia
- News API
- The Guardian
- New York Times
- DuckDuckGo (Currently not in use)

You will need to provide valid API keys for some of these services.

If any of these providers change the shape of their respones, Delphy might not be able to process the data from it. In this case, the search results of the given source will just be empty.

For each external API exists a Jest test, that fetches a response and runs the most important checks for compatibility.

## Limitations of the deployed version

Please note that all external APIs are accessed in free plans and thus are subject to request limitations. As a rule of thumb, 100 search requests per day will work, then the first sources will stop to respond. Again, please do not spam requests.

The current deployed endpoint of the roBERTa model will also change in the upcoming months, due to free plan restrictions. 

I reserve myself the right to change or wipe the database at any given time. 

User registration and authentication do not ask for email addresses. I do not want to store them for this project. If you lose your password, you will not be able to restore it. 


## Known issues

- The sort function of the database table is currently not working
- Success alert in "add review" dialog on claim page does not show if first attempt produces an error

## Sources and credits

roBERTa model: 

"Polygons" background .svg created with: 

Thanks to fakenewschallenge.com for giving me the idea to use "stance" detection approach.

## License

## Further reading

