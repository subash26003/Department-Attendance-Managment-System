import React from 'react'
import { API_STATUS } from '../../app/appConstants'
import Loader from './Loader'
import FailueView from './FailueView'

const RenderView = ({status , Component}) => {
    if(status === API_STATUS.LOADING){
        return <Loader/>
    }
    if(status === API_STATUS.FAILURE){
        return <FailueView />
    }
    
  return (
    <Component />
  )
}

export default RenderView