import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Container } from 'react-bootstrap'
import PageLayout from '../../layout/PageLayout'
import RecomendedCards from '../../props/RecomendedCards'
import { SearchService } from '../../Services/SearchService'

const Search = () => {

  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

 useEffect(() => {
  setLoading(true)
  setError('')

  SearchService.SearchProducts(query)
    .then((products) => {
      setProducts(products)
    })
    .catch((err) => {
      setError(err.message)
    })
    .finally(() => {
      setLoading(false)
    })
}, [query])

  return (
    <PageLayout>
      <Container className="py-5">

        <h5 className="mb-4">Results for "{query}"</h5>

        {loading && <p>Searching...</p>}

        {error && <p className="text-danger">{error}</p>}

        {!loading && !error && products.length === 0 && (
          <p className="text-body-secondary">
            No products match "{query}". Try a shorter word, like "iphone".
          </p>
        )}

        {!loading && !error && (
          <div className="recommended-grid">
            {products.map((pdct) => (
              <div className="recommended-item" key={pdct.id}>
                <Link to={`/products/${pdct.id}`} className="product-link">
                  <RecomendedCards
                    id={pdct.id}
                    img={<img className='reco-card-img' src={pdct.image} alt={pdct.name} />}
                    title={pdct.name}
                    price={pdct.price}
                  />
                </Link>
              </div>
            ))}
          </div>
        )}

      </Container>
    </PageLayout>
  )
}

export default Search