import React, { useState } from "react";

import bikes from "../../ebikes.json";
import Bike from "./Bike";

const CityFilter = ({ cities, onChange }) => (
  <select onChange={onChange}>
    <option>Stadtfilter</option>
    {cities.map((city) => (
      <option key={city} value={city}>
        {city}
      </option>
    ))}
  </select>
);

const onlyUnique = (value, index, self) => self.indexOf(value) === index;

const cities = bikes
  .map(
    (bike) => bike.variants && bike.variants.map((variant) => variant.cities)
  )
  .flat(2)
  .filter(onlyUnique)
  .filter((value) => value)
  .sort();

const filterBikes = (bikes, city) =>
  bikes
    .filter(
      (bike) =>
        bike.variants &&
        bike.variants
          .map((variant) => variant.cities)
          .flat()
          .includes(city)
    )
    .filter((bike) => bike);

const App = () => {
  const [city, setCity] = useState(null);
  const filteredBikes = city ? filterBikes(bikes, city) : bikes;

  return (
    <>
      <CityFilter
        cities={cities}
        onChange={(event) => setCity(event.target.value)}
      />
      {filteredBikes.map((bike) => (
        <Bike
          key={bike.url}
          title={bike.name}
          imageUrl={bike.image_url}
          variants={bike.variants}
          filteredCity={city}
          url={bike.url}
        />
      ))}
    </>
  );
};

export default App;
