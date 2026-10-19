import React from 'react'

const Cards = ({title, price, img}) => {
  return (
    <>
    <div className='card-wrapper border'>
        <div className='card-title'>{title}</div>
        <div className='card-content d-flex justify-content-between align-items-center'>
            <div className="card-text">
                <p className='from'>From</p>
            <p>USD$<span>{price}</span>  </p>
            </div>

            <div className='card-img'>{img}</div>

        </div>

        </div>

    </>
  )
}

export default Cards