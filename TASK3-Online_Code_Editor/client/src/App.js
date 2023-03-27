import './App.css';
import Editor from "@monaco-editor/react";
import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Axios from 'axios';


function App() {
  const [code, setCode] = useState("// Enter Your code here");
  const [lang, setLang] = useState("py");
  const [theme, setTheme] = useState("vs-dark");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("");
  const [time, setTime] = useState("0");
  const [memory, setMemory] = useState("0");

  function loader(flag){
    if(flag) document.getElementById('output').classList.add('loading');
    else document.getElementById('output').classList.remove('loading');

  }
  function compile() {
    if (code === ``) {
      return
    }
    loader(true);


    // Post request to compile endpoint
    Axios.post(`http://localhost:8000/compile`, {
      code: code,
      language: lang,
      input: input
    }).then((res) => {
      loader(false);
      if (res.data.stderr) {
        setOutput(res.data.stderr);
        document.getElementById('output').style.color = 'red';
        document.getElementById('output').style.fontWeight = '600';
      }
      else {
        setOutput(res.data.stdout);
        document.getElementById('output').style.color = 'white';
        document.getElementById('output').style.fontWeight = '500';
      }
      setMemory(res.data.memory);
      setTime(res.data.time);
      setStatus(res.data.status.description);
      console.log(res)
    })
  }

  useEffect(() => {
    if (theme === 'vs-dark'){
      let t = document.getElementById('input');
      t.style.background = '#1E1E1E';
      t.style.color = 'white'
      t = document.getElementById('output');
      t.style.background = '#1E1E1E';
      t.style.color = 'white'
    }
      
    else{
      let t = document.getElementById('input');
      t.style.background = 'white';
      t.style.color = 'black'
      t = document.getElementById('output');
      t.style.background = 'white';
      t.style.color = 'black'
    }
  }, [theme])

  const styles = {
    height: '85vh',
  }
  return (
    <div className="App">
      <Navbar setLang={setLang} setTheme={setTheme} lang={lang} theme={theme} compile={compile} />
      <div className='flex flex-row items-center justify-evenly'>
        <div className='w-full my-3' style={styles}>
          <Editor
            height="inherit"
            width="inherit"
            defaultLanguage={lang}
            defaultValue={code}
            theme={theme}
            className='mx-3 border border-gray-600'
            onChange={(value) => setCode(value)}
          />
        </div>


        <div className='flex flex-col justify-around' style={styles}>
          <div>
            <h2 className='text-left mx-3 font-medium text-xl mb-2'>Input</h2>
            <textarea id='input' className='border-gray-800 border mx-3 px-2 py-1 focus:outline-none' rows={5} cols={80} onChange={(e) => setInput(e.target.value)}></textarea>
          </div>
          <div>
            <h2 className='text-left mx-3 font-medium text-xl mb-2'>Output</h2>
            <div id='output' className='border-gray-800 border h-80 mx-3 px-2 py-1 text-left' >{output}</div>
          </div>
          <div className=' text-left mx-3 p-3 font-medium' >
            <div>
              <span>Status : </span>
              <span>{status}</span>
            </div>
            <div>
              <span>Time : </span>
              <span>{time} s</span>
            </div>
            <div>
              <span>Memory : </span>
              <span>{memory} kb</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
