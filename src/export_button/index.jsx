import JSZip from "jszip";
import { useComponents } from "../App";
import { saveAs } from "file-saver";
import superfasthash from "superfasthash/wasm";
import { Buffer } from "buffer";

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
        "image": "custom.png"
      }
    ]
  }
}
`;
const customPng = "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";

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
    folder.file("custom.png", customPng, { base64: true });
    let customCss = "";
    componentList.forEach(component => {
      if (componentValues[component.id]) {
        customCss += `/* ${component.name} */\n${component.css}\n\n`;
      }
    });
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