import React from 'react'

const DealsCard = ({img ,title , discount }) => {

  return (
    <>
    <div className='deal-card d-flex flex-column gap-4 justify-content-center '>
     <div className='deal-img'>{img}</div>

     <div className='d-flex flex-column gap-2  justify-content-center align-items-center   '>
        <div className='deal-title'>{title}</div>
        <div className='deal-discount'>{discount}</div>

     </div>

    </div>

    </>
  )
}

export default DealsCard