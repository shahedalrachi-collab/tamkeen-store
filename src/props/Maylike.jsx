
const Maylike = ({ image, name, price }) => {
  return (
    <>

      <div className="suggest-card">
      <div className="suggest-card-img">
        <img src={image} alt={name} />
      </div>
      <div>
        <p className="suggest-card-name">{name}</p>
        <p className="suggest-card-price">{price}</p>
      </div>
    </div>

    </>
  )
}

export default Maylike

