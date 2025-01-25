import JSZip from "jszip";
import { useComponents } from "../App";
import { saveAs } from "file-saver";
import superfasthash from "superfasthash/wasm";
import { Buffer } from "buffer";
import WordCloud from "wordcloud";

const packageJson = `
{
  "name": "ThemeBuilder <id>",
  "description": "Customized TeamSpeak Theme",
  "version": "1.0.0",
  "identifier": "de.julianimhof.custom.<id>",
  "engines": {
    "teamspeak": 1
  },
  "homepage": "https://github.com/Gamer92000/teamspeak-5-theme-generator",
  "docsUrl": "https://github.com/Gamer92000/teamspeak-5-theme-generator",
  "repository": "https://github.com/Gamer92000/teamspeak-5-theme-generator",
  "image": "custom.png",
  "license": "MIT",
  "author": {
    "name": "JUL14N",
    "email": "teamspeak@julianimhof.de",
    "url": "https://julianimhof.de",
    "userTag": "Gamer92000@myteamspeak.com"
  },
  "community": {
    "room": "#extensions:chat.teamspeak.com",
    "server": "julianimhof.de"
  },
  "content": {
    "themes": [
      {
        "name": "Custom",
        "source": "custom.css",
        "apiVersion": 1,
        "image": "variant.png"
      }
    ]
  }
}
`;

let { hash } = superfasthash;
let hashText = text => hash(new Uint8ClampedArray([...Buffer.from(text)]));

const ExportButton = () => {
  const componentList = useComponents(state => state.componentList);
  const componentValues = useComponents(state => state.componentValues);

  const exportTheme = async () => {
    const searchParams = new URLSearchParams(window.location.search);
    if (!searchParams.get('selection')) {
      alert("Please select at least one component!");
      return;
    }
    await superfasthash.initialize();
    
    let digest = hashText(searchParams.get('selection'));
    digest = Math.abs(digest);
    // base26 (a-z) encode the hash
    let sel = "";
    while (digest > 0) {
      sel += String.fromCharCode(97 + (digest % 26));
      digest = Math.floor(digest / 26);
    }
    const zip = new JSZip();
    const folder = zip.folder(`de.julianimhof.custom.${sel}`);
    const packageJsonWithId = packageJson.replaceAll("<id>", sel);
    folder.file("package.json", packageJsonWithId);
    
    const customPng = await fetch(process.env.PUBLIC_URL + '/logo.png')
      .then(response => response.blob())
      .then(blob => {
          var reader = new FileReader() ;
          const promise = new Promise((res, _rej) => {
            reader.onload = function(){ res(this.result.split(';base64,')[1]) } ;
          });
          reader.readAsDataURL(blob);
          return promise;
      });

    folder.file("custom.png", customPng, { base64: true });
    let customCss = "";
    let names = [];
    await Promise.all(componentList.map(async component => {
      if (!componentValues[component.id]) {
        return;
      }
      names.push(component.name);
      // fetch the css from the component
      let css_uri = component.css;
      await fetch(process.env.PUBLIC_URL + css_uri).then(response => response.text()).then(text => {
        customCss += `/* ${component.name} */\n${text}\n\n`;
      }).catch(err => {
        console.error(err);
      });

      if (!component.resources) {
        return;
      }
      // fetch all resources
      await Promise.all(component.resources.map(async resource => {
        await fetch(process.env.PUBLIC_URL + resource).then(response => response.blob()).then(blob => {
          folder.file(resource.split("/").pop(), blob);
        }).catch(err => {
          console.error(err);
        });
      }));
    }));

    // build word cloud image
    const cloudCanvas = document.createElement("canvas");
    cloudCanvas.width = 456;
    cloudCanvas.height = 339;
    const cloudNames = [['Click Me!', 55, true]];
    for (const name of names) {
      cloudNames.push([name, Math.random() * 15 + 15]);
    }
    const cloudGuard = new Promise((res, _rej) => cloudCanvas.addEventListener("wordcloudstop", () => {
      res();
    }));
    WordCloud(cloudCanvas, {
      list: cloudNames, 
      backgroundColor: "#121a2c",
      color: "rgb(252, 252, 253)",
      fontFamily: "Noto Sans",
      fontWeight: 600,
      rotateRatio: 0.6
    });
    await cloudGuard;

    const variantPng = cloudCanvas.toDataURL("image/png").split(';base64,')[1];

    folder.file("variant.png", variantPng, { base64: true });
    folder.file("custom.css", customCss);
    folder.file("internal.txt", searchParams.get('selection'));
    zip.generateAsync({ type: "blob" })
      .then(content => {
        saveAs(content, `de.julianimhof.custom.${sel}.zip`);
      }
    );
  }

  return (
    <button
          onClick={exportTheme}
    >
      Export Selected
    </button>
  )
}

export default ExportButton;