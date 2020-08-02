import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import bikes from "../../ebikes.json";
import styled from "styled-components";

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

const Image = styled.img`
  max-width: 100%;
`;

const FlexRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const FlexCol = styled.div`
  display: flex;
  flex-direction: column;
`;

const Variant = ({ name, filteredCity, cities }) => {
  if (cities.includes(filteredCity)) {
    return <AvailableVariant name={name} />;
  } else {
    return <UnstyledVariant name={name} />;
  }
};

const UnstyledVariant = ({ name, className }) => (
  <div className={className}>{name}</div>
);
const AvailableVariant = styled(UnstyledVariant)`
  color: green;
  font-weight: bold;
`;

const Bike = ({ title, imageUrl, variants, url, filteredCity }) => (
  <div>
    <div>
      <a href={url} target="_blank">
        <Image src={imageUrl} />
      </a>
    </div>
    <div>
      <b>{title}</b>
    </div>
    <FlexRow>
      {variants &&
        variants.map((variant) => (
          <FlexCol key={variant.name}>
            <Variant
              name={variant.name}
              filteredCity={filteredCity}
              cities={variant.cities}
            />
            {variant.cities &&
              variant.cities.map((city) => <div key={uuidv4()}>{city}</div>)}
          </FlexCol>
        ))}
    </FlexRow>
  </div>
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
