import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import './InfluencersPage.css'

const influencerCollections = [
  {
    id: 'creator-capsule-01',
    name: 'The Highlight Reel',
    creator: '@HoopsReel',
    description: 'Viral-worthy mesh set with reflective taping and split hem shorts.',
    price: '$119.00'
  },
  {
    id: 'fitness-icon-02',
    name: 'Elite Grind Pack',
    creator: '@CoachKira',
    description: 'Performance quarter-zip, compression top, and sculpt leggings bundle.',
    price: '$139.00'
  },
  {
    id: 'lifestyle-drop-03',
    name: 'Street Vision Drop',
    creator: '@CityHandles',
    description: 'Oversized hoodie, script tee, and limited edition snapback.',
    price: '$99.00'
  },
  {
    id: 'travel-pack-04',
    name: 'Flight Crew Bundle',
    creator: '@GlobalBuckets',
    description: 'Travel-ready duffle, pro-fit track suit, and tech fleece joggers.',
    price: '$159.00'
  }
]

const InfluencersPage = () => {
  const collections = useMemo(() => influencerCollections, [])

  const handleAddToCart = (collectionName) => {
    window.alert(`Nice pick! We'll get you set up with the ${collectionName} collection.`)
  }

  return (
    <div className="influencers-page">
      <Link to="/" className="close-button" aria-label="Return to homepage">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </Link>

      <header className="page-header">
        <h1 className="page-title">Influencer Spotlight Shop</h1>
        <p className="page-subtitle">
          Cop the curated fits from the creators redefining hoops culture. Each drop is crafted in limited runs and ships with exclusive creator content.
        </p>
      </header>

      <section className="collections-grid" aria-label="Influencer merchandise collections">
        {collections.map((collection) => (
          <article key={collection.id} className="collection-card">
            <div className="collection-card-body">
              <h2 className="collection-name">{collection.name}</h2>
              <p className="collection-creator">{collection.creator}</p>
              <p className="collection-description">{collection.description}</p>
            </div>
            <footer className="collection-card-footer">
              <span className="collection-price">{collection.price}</span>
              <button
                type="button"
                className="shop-button"
                onClick={() => handleAddToCart(collection.name)}
              >
                Add to Cart
              </button>
            </footer>
          </article>
        ))}
      </section>

      <section className="collab-section">
        <h3 className="collab-title">Creators - let's build together</h3>
        <p className="collab-copy">
          Pitch your concept, launch drop-ready merch, and tap into the Jerzey LAB production network.
        </p>
        <a className="collab-link" href="mailto:collabs@jerzeylab.com">
          collabs@jerzeylab.com
        </a>
      </section>
    </div>
  )
}

export default InfluencersPage


