import React from "react";

import bikes from "../../ebikes.json";
import styled from "styled-components";

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

const Bike = ({ title, imageUrl, variants }) => (
  <div>
    <div>
      <Image src={imageUrl} />
    </div>
    <div>
      <b>{title}</b>
    </div>
    <FlexRow>
      {variants &&
        variants.map((variant) => (
          <FlexCol key={variant.name}>
            <div>{variant.name}</div>
            {variant.cities && variant.cities.map((city) => <div>{city}</div>)}
          </FlexCol>
        ))}
    </FlexRow>
  </div>
);

const App = () => {
  return bikes.map((bike) => (
    <Bike
      title={bike.name}
      imageUrl={bike.image_url}
      variants={bike.variants}
      key={bike.url}
    />
  ));
};

export default App;
