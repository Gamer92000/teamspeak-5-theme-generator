import { useState } from 'react';
import Component from "../component";
import './category.css';
import { useComponents } from '../App';

const Category = ({
  category_name,
  category_id
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const componentList = useComponents(state => state.componentList);
  const components = componentList.filter(component => component.category === category_id);

  const setComponent = useComponents(state => state.setComponent);

  return (
    <>
      <h2 onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? "▸" : "▾"} {category_name}
      </h2>
      <div className={collapsed ? "componentList collapsed" : "componentList"}>
        {components.map(component =>
          <div key={component.id}>
            <Component
              id={component.id}
              name={component.name}
              description={component.description}
              imagePath={process.env.PUBLIC_URL + component.imagePath}
              setValue={v => { setComponent(component.id, v); }}
              disabled={component.disabled}
            ></Component>
          </div>
        )}
      </div>
    </>
  );
}

export default Category;