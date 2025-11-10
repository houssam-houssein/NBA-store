import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import './HighSchoolAthletesPage.css'

const highSchoolSpotlights = [
  {
    id: 'hs-guard-01',
    name: 'Northside Elite',
    player: 'Maya Jenkins • PG',
    description: 'City championship jersey with alternate gold numbering and tapered fit shorts.',
    price: '$89.00'
  },
  {
    id: 'hs-forward-02',
    name: 'Bayview Prep',
    player: 'Jordan Miles • SF',
    description: 'Statement edition set featuring tonal camo side panelling and moisture control mesh.',
    price: '$94.00'
  },
  {
    id: 'hs-center-03',
    name: 'Westbrook Academy',
    player: 'Andre Fields • C',
    description: 'Game-day warmup jacket and jogger combo with embroidered crest and player script.',
    price: '$109.00'
  },
  {
    id: 'hs-shooting-04',
    name: 'Central Tech',
    player: 'Lena Torres • SG',
    description: 'Limited run shooter shirt and compression sleeve pack with reflective detailing.',
    price: '$79.00'
  }
]

const HighSchoolAthletesPage = () => {
  const collections = useMemo(() => highSchoolSpotlights, [])

  const handleReserve = (collectionName) => {
    window.alert(`Reservation placed! We'll follow up with sizing and shipping for ${collectionName}.`)
  }

  return (
    <div className="high-school-athletes-page">
      <Link to="/" className="close-button" aria-label="Return to homepage">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </Link>

      <header className="page-header">
        <h1 className="page-title">High School Spotlight Shop</h1>
        <p className="page-subtitle">
          Support the future of the game. Rep limited merch from the country's rising stars, produced in partnership with their programs.
        </p>
      </header>

      <section className="collections-grid" aria-label="High school athlete merchandise">
        {collections.map((collection) => (
          <article key={collection.id} className="collection-card">
            <div className="collection-card-body">
              <h2 className="collection-name">{collection.name}</h2>
              <p className="collection-player">{collection.player}</p>
              <p className="collection-description">{collection.description}</p>
            </div>
            <footer className="collection-card-footer">
              <span className="collection-price">{collection.price}</span>
              <button
                type="button"
                className="reserve-button"
                onClick={() => handleReserve(collection.name)}
              >
                Reserve Drop
              </button>
            </footer>
          </article>
        ))}
      </section>

      <section className="programs-section">
        <h3 className="programs-title">Coaches & ADs - let's feature your program</h3>
        <p className="programs-copy">
          Launch team stores, fundraise with specialty merch, and unlock pro-grade production with Jerzey LAB.
        </p>
        <a className="programs-link" href="mailto:teams@jerzeylab.com">
          teams@jerzeylab.com
        </a>
      </section>
    </div>
  )
}

export default HighSchoolAthletesPage


