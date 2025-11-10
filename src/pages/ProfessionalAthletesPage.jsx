import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import './ProfessionalAthletesPage.css'

const professionalAthletes = [
  {
    id: 'euro-guard-01',
    name: 'Jamal Rivers',
    league: 'EuroLeague • Real Madrid',
    description: 'Limited edition 2024 away jersey with pro-fit tailoring.',
    price: '$179.00'
  },
  {
    id: 'wnba-star-02',
    name: 'Candice Hart',
    league: 'WNBA • Seattle Storm',
    description: 'Signature home set featuring moisture-wicking mesh panelling.',
    price: '$149.00'
  },
  {
    id: 'g-league-03',
    name: 'Malik Porter',
    league: 'NBA G League • Ignite',
    description: 'Authentic Ignite statement jersey with holographic numbering.',
    price: '$129.00'
  },
  {
    id: 'intl-forward-04',
    name: 'Sergio Navarro',
    league: 'Liga ACB • FC Barcelona',
    description: 'Player issued city edition jersey with embroidered crest.',
    price: '$169.00'
  }
]

const ProfessionalAthletesPage = () => {
  const featuredAthletes = useMemo(() => professionalAthletes, [])

  const handleBuyNow = (athleteName) => {
    window.alert(`Great choice! A member of our team will help you complete your order for ${athleteName}.`)
  }

  return (
    <div className="professional-athletes-page">
      <Link to="/" className="close-button" aria-label="Return to homepage">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </Link>

      <header className="page-header">
        <h1 className="page-title">Professional Athletes Collection</h1>
        <p className="page-subtitle">
          Shop the latest drops from your favorite overseas pros and elite hoopers. Every jersey is verified, game-ready, and ships with a certificate of authenticity.
        </p>
      </header>

      <section className="athletes-grid" aria-label="Professional athlete jerseys">
        {featuredAthletes.map((athlete) => (
          <article key={athlete.id} className="athlete-card">
            <div className="athlete-card-body">
              <h2 className="athlete-name">{athlete.name}</h2>
              <p className="athlete-league">{athlete.league}</p>
              <p className="athlete-description">{athlete.description}</p>
            </div>
            <footer className="athlete-card-footer">
              <span className="athlete-price">{athlete.price}</span>
              <button
                type="button"
                className="buy-button"
                onClick={() => handleBuyNow(athlete.name)}
              >
                Buy Now
              </button>
            </footer>
          </article>
        ))}
      </section>

      <section className="support-section">
        <h3 className="support-title">Need a custom order?</h3>
        <p className="support-copy">
          Contact our concierge team for player-signed memorabilia, bulk orders, or jersey personalization.
        </p>
        <a className="support-link" href="mailto:sales@jerzeylab.com">
          sales@jerzeylab.com
        </a>
      </section>
    </div>
  )
}

export default ProfessionalAthletesPage


