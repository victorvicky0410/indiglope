import { useState } from 'react';

const useActive = (initialState) => {
  const [active, setActive] = useState(initialState);

  const handleActive = (product_id) => {
    setActive((prevActive) => (prevActive === product_id ? false : product_id));
  };

  const activeClass = (product_id) => (active === product_id ? 'active' : '');

  return { active, handleActive, activeClass };
};

export default useActive;
