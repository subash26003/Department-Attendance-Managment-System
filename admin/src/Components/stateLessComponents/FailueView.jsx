import React from 'react'
import PropTypes from "prop-types"
import Not_Found_image from "../../assets/Not_Found_image.webp"

const FailueView = ({error}) => {
  return (
    <div className='h-full flex flex-col justify-center items-center'>
        <img src={Not_Found_image} alt="Not Found Image" 
          className='w-[50%]'
        />
        <h1>Something Went Wrong</h1>
        <p>{error}</p>
    </div>
  )
}

FailueView.propTypes = {
    error : PropTypes.node
}

export default FailueView