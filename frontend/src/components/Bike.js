import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
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

const Variant = ({ name, filteredCity, cities }) => {
  if (cities.includes(filteredCity)) {
    return <AvailableVariant name={name} cities={cities} />;
  } else {
    return <VariantStyle name={name} cities={cities} />;
  }
};

const VariantLayout = ({ name, className, cities }) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className={className} onClick={() => setCollapsed(!collapsed)}>
      <div className="title">{name}</div>
      <div className="cities">
        {!collapsed &&
          cities &&
          cities.sort().map((city) => <div key={uuidv4()}>{city}</div>)}
      </div>
    </div>
  );
};

const VariantStyle = styled(VariantLayout)`
  padding: 1rem 0.5rem;
  border: 1px solid #aaa;
  margin-top: 0.5rem;

  .cities {
    color: #888;
  }
`;
const AvailableVariant = styled(VariantStyle)`
  background-color: white;

  .title {
    color: green;
    font-weight: bold;
  }
`;

const BikeContainer = styled.div`
  background-color: #f3f3f3;
  padding: 0.5rem;
  margin-top: 2rem;
`;

const Title = styled.div`
  font-weight: bold;
  margin-top: 0.5rem;
`;

const Bike = ({ title, imageUrl, variants, url, filteredCity }) => (
  <BikeContainer>
    <div>
      <a href={url} target="_blank">
        <Image src={imageUrl} />
      </a>
    </div>
    <Title>{title}</Title>
    <div>
      {variants &&
        variants.map((variant) => (
          <FlexCol key={variant.name}>
            <Variant
              name={variant.name}
              filteredCity={filteredCity}
              cities={variant.cities}
            />
          </FlexCol>
        ))}
    </div>
  </BikeContainer>
);

export default Bike;
