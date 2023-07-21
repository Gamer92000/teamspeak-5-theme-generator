import { useComponents } from "../App";
import DragNDrop from "../drag_n_drop";
import './sidebar.css';

const Sidebar = () => {
  const componentList = useComponents(state => state.componentList);
  const componentValues = useComponents(state => state.componentValues);

  const categories = useComponents(state => state.categories);
  // eslint-disable-next-line no-sequences
  const categoryIdToSortId = categories.reduce((acc, curr) => (acc[curr.id] = curr.sort_id, acc), {});

  componentList.sort((a, b) => {
    if (a.category === b.category) {
      return a.id - b.id;
    }
    return categoryIdToSortId[a.category] - categoryIdToSortId[b.category];
  });

  const numSelected = componentList.filter(component => componentValues[component.id]).length;

  return (
    <div id="sidebar-wrapper">
      <div id="sidebar">
        <h2>Selected <i style={{fontWeight: 400}}>({numSelected})</i></h2>
        <p>
        {componentList
          .filter(component => componentValues[component.id])
          .map(component => <><span>{component.name}</span><br /></>)
          }
        </p>
        <DragNDrop />
      </div>
    </div>);
}

export default Sidebar;