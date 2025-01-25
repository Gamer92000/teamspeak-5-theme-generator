import { useEffect } from "react";
import './App.css';
import Category from "./category";
import { create } from "zustand";
import Sidebar from "./sidebar";
import ExportButton from "./export_button";

export const useComponents = create((set) => ({
  componentList: [],
  componentValues: [],
  categories: [],
  setComponentList: (list) => set({ componentList: list }),
  setComponentValues: (values) => set({ componentValues: values }),
  setCategories: (categories) => set({ categories: categories }),
  setComponent: (id, value) => set(state => {
    const values = { ...state.componentValues };
    values[id] = value;
    return { componentValues: values };
  })
}));

const App = () => {
  const setComponentList = useComponents(state => state.setComponentList);
  const setComponentValues = useComponents(state => state.setComponentValues);

  const categories = useComponents(state => state.categories);
  const setCategories = useComponents(state => state.setCategories);

  useEffect(() => {
    fetch(`/components.json`)
      .then(response => response.json())
      .then(data => {
        // eslint-disable-next-line no-sequences
        const values = data.components.reduce((acc, curr) => (acc[curr.id] = false, acc), {});
        
        const searchParams = new URLSearchParams(window.location.search);

        if (searchParams.get('selection')) {
          // selection is a comma separated list of component ids
          const selection = searchParams.get('selection').split('-');
          selection.forEach(id => {
            values[parseInt(id)] = true;
          });
        }
        
        setComponentValues(values);
        setComponentList(data.components);
        const categories = data.categories.sort((a, b) => a.sort_id - b.sort_id);
        setCategories(categories);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <div className="header">
        <h1>TeamSpeak 5 Theme Generator</h1>
        <ExportButton />
      </div>
      <div className="contentContainer">
        <div className="categoryList">
          {categories.map(category => 
            <div key={category.id}>
              <Category
                category_name={category.name}
                category_id={category.id}
              ></Category>
            </div>
          )}
        </div>
        <Sidebar/>
      </div>
      <p style={{margin: "10px auto"}}>Developed with ❤️ by <a href="https://github.com/Gamer92000" style={{color: "#fff"}}>JUL14N</a></p>
    </div>
  );
}

export default App;
