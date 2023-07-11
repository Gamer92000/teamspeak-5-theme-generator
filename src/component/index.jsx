import { useState } from 'react';
import './component.css';

const Component = (
  {
    name,
    description,
    imagePath,
    setValue,
  }
) => { 
  const [selected, setSelected] = useState(false);

  const handleClick = () => {
    setValue(!selected);
    setSelected(!selected);
  }

  return (
    <div onClick={handleClick} className={selected ? "selected component" : "component"}>
      <img src={imagePath} alt={name} />
      <h1>{name}</h1>
      <p>{description}</p>
    </div>
  );
}

export default Component;