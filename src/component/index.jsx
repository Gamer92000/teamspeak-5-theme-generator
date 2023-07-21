import './component.css';
import { useComponents } from '../App';

const Component = (
  {
    id,
    name,
    description,
    imagePath,
    setValue,
  }
) => { 
  const selected = useComponents(state => state.componentValues)[id];

  const handleClick = () => {
    setValue(!selected);
    const searchParams = new URLSearchParams(window.location.search);
    let selection = (searchParams.get('selection') || "").split('-');
    selection = selection.filter(id => id !== '').map(id => parseInt(id));
    selection = selection.filter(cid => cid !== id);
    if (!selected) {
      selection.push(id);
    }
    selection = selection.sort((a, b) => a - b);
    searchParams.set('selection', selection.join('-'));
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