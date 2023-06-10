import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Banner = (props) => {
  const [banner, setBanner] = useState([]);

  useEffect(() => {
    if (props.dataTemp) {
    } else {
      async function fetchData() {
        const respBanner = await axios('/api/banner/get-banner');

        setBanner(respBanner);
      }
      fetchData();
    }
  }, []);
  return (
    <>
      <img src="/trans-slider-bg.jpg" />
    </>
  );
};

export default Banner;
