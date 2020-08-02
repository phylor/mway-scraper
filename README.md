# m-way scraper

A quick scraper of the [m-way ebikes](https://m-way.ch/e-bikes/) with a frontend filterable by availability in a specific city.

## Scraper

Scrapes the m-way website and stores all the product information in `ebikes.json`.

To run the scraper:

```
cd scraper
bundle
bundle exec ruby main.rb
```

## Frontend

To run it:

```
cd frontend
yarn
yarn start
```
