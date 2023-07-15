import { useState } from 'react';
import './component.css';

const Component = (
  {
    id,
    name,
    description,
    imagePath,
    setValue,
  }
) => { 
  const searchParams = new URLSearchParams(window.location.search);

  let initial = false;
  if (searchParams.get('selection')) { 
    initial = !!(searchParams.get('selection') & (1 << id));
    setValue(initial);
  }

  const [selected, setSelected] = useState(initial);

  const handleClick = () => {
    setValue(!selected);
    setSelected(!selected);
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('selection', (searchParams.get('selection') & ~(1 << id)) | (selected ? 0 : 1 << id));
    window.history.replaceState({}, '', `${window.location.pathname}?${searchParams}`);
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