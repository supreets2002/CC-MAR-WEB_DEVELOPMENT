import React from 'react'
import language from './languages';
function Navbar({ setTheme, setLang, lang, theme, compile }) {

  const themes = [
    { value: 'vs-dark', label: 'vs-dark' },
    { value: 'light', label: 'light' }
  ]
  return (
    <div >
      <header className='bg-gradient-to-tr from-gray-600 to-black text-white py-3 mb-3'><h2 className='font-medium text-xl text-center'>My IDE</h2></header>
      <nav className='flex flex-row items-center justify-between mx-4'>
        <div>
          <label htmlFor="language" className='font-medium mx-2'>Language :&nbsp;
            <select id='language' onChange={(e) => setLang(e.currentTarget.value)} value={lang}>
              {language.map((e) => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
          </label>
          <label htmlFor="theme" className='font-medium mx-2 ml-5'>Theme :&nbsp;
            <select id='theme' onChange={(e) => setTheme(e.currentTarget.value)} value={theme}>
              {themes.map((e) => (
                <option key={e.label} value={e.value}>{e.label}</option>
              ))}
            </select>
          </label>
        </div>
        <button onClick={() => compile()} className='border bg-green-600 py-1 px-3 rounded hover:bg-green-700'>Run</button>
      </nav>
    </div>
  )
}

export default Navbar
