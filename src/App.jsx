import React, { useRef } from 'react'
import Ground from './components/Ground'


const App = () => {

  const bgRef = useRef()
  return (
    <div ref={bgRef} className="w-full min-h-screen bg-[url('/images/Quidditchpitch.jpg')] bg-cover ">
      <Ground target={bgRef}/>

      
    </div>
  )
}

export default App