const ServiceCard = ({ img, icon, title }) => {
  return (
    <div className="service-card bg-body border rounded h-100">
      <div className="position-relative">
        <div className="overflow-hidden rounded-top">
          <img className="service-img w-100" src={img} alt="" />
        </div>
        <span className="service-icon position-absolute rounded-circle d-flex align-items-center justify-content-center">
          {icon}
        </span>
      </div>
      <p className="service-title p-3 mb-0">{title}</p>
    </div>
  )
}

export default ServiceCard