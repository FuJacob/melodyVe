import React from 'react'

const Navbar = () => {
  return (
    <div className="navbar bg-base-200 gap-2">
  <div className="flex-1">
<img src="melodyve.svg" className="w-24 ml-5"/>  </div>
<button className="btn btn-secondary text-white">about</button>
<button className="btn btn-secondary text-white">how does melodyVe work?</button>
<button className="btn btn-secondary text-white">get started</button>
</div>
  )
}

export default Navbar