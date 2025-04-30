import React from 'react'

const Loader = () => {
  return (
    <div className='w-full h-full flex justify-center'>
        <div className='animate-spin h-12 w-12 border-t-4 text-blue-500 rounded-full'></div>
    </div>
  )
}

export default Loader