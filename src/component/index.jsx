import './component.css';
import { useComponents } from '../App';
import { useEffect, useState } from 'react';
import { useFloating, useHover, useInteractions, useClientPoint } from '@floating-ui/react';

const Component = (
  {
    id,
    name,
    description,
    imagePath,
    setValue,
    disabled,
  }
) => {
  const selected = useComponents(state => state.componentValues)[id];
  const [isOpen, setIsOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
  });
  const hover = useHover(context);
  const clientPoint = useClientPoint(context);
  const {getReferenceProps, getFloatingProps} = useInteractions([
    hover,
    clientPoint,
  ]);

  useEffect(() => {
    if (disabled && selected) {
      setValue(false); const searchParams = new URLSearchParams(window.location.search);
      let selection = (searchParams.get('selection') || "").split('-');
      selection = selection.filter(id => id !== '').map(id => parseInt(id));
      selection = selection.filter(cid => cid !== id);
      selection = selection.sort((a, b) => a - b);
      searchParams.set('selection', selection.join('-'));
      window.history.replaceState({}, '', `${window.location.pathname}?${searchParams}`);
    }
  }, [id, disabled, selected, setValue]);

  const handleClick = () => {
    if (disabled) return;
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
    <>
      <div
        onClick={handleClick}
        className={(selected ? "selected " : "") + "component" + (disabled ? " disabled" : " ")}
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        <img src={imagePath} alt={name} />
        <h1>{name}</h1>
        <p>{description}</p>
      </div>
      {disabled && isOpen && 
        <div className="broken" ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
          Broken :(
        </div>
      }
    </>
  );
}

export default Component;