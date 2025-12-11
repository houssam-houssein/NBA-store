import React from 'react'
import './TermsConditionsPage.css'

const TermsConditionsPage = () => {
  return (
    <div className="terms-conditions-page">
      <h1 className="page-title">TERMS & CONDITIONS</h1>

      <div className="terms-content">
        <p className="intro-paragraph">
          Welcome to Jerzey Lab. By accessing or purchasing from our website, you agree to the following Terms and Conditions. Please read them carefully before placing an order.
        </p>

        <section className="terms-section">
          <h2 className="section-title">1. General</h2>
          <p className="terms-paragraph">
            By using our website, you acknowledge that you are at least 18 years old or have permission from a parent or guardian to make a purchase.
          </p>
          <p className="terms-paragraph">
            All products, images, and descriptions are provided for informational purposes only. We reserve the right to modify or update these Terms and Conditions at any time without prior notice.
          </p>
        </section>

        <section className="terms-section">
          <h2 className="section-title">2. Products</h2>
          <p className="terms-paragraph">
            Our store sells NBA-inspired shirts and merchandise. All items are described and photographed as accurately as possible, but colors or designs may vary slightly due to different display settings or production variations.
          </p>
        </section>

        <section className="terms-section">
          <h2 className="section-title">3. Prices and Payments</h2>
          <ul className="terms-list">
            <li>All prices are listed in USD ($).</li>
            <li>We accept major credit/debit cards and other secure payment methods available at checkout.</li>
            <li>Prices and availability are subject to change without notice.</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2 className="section-title">4. Order Processing and Shipping</h2>
          <ul className="terms-list">
            <li>Orders are processed within 3–5 business days after payment confirmation.</li>
            <li>Shipping time: Approximately 4–5 weeks for delivery within the United States.</li>
            <li>Delivery times may vary due to carrier delays, holidays, or external factors outside our control.</li>
            <li>Once your order has been shipped, you will receive a tracking number via email.</li>
            <li>We are not responsible for delays caused by the postal service, customs, or incorrect shipping addresses provided by the customer.</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2 className="section-title">5. Returns and Exchanges</h2>
          <p className="terms-paragraph">
            All sales are final.
          </p>
          <p className="terms-paragraph">
            We do not accept returns, exchanges, or refunds once an order is placed, except in the following cases:
          </p>
          <ul className="terms-list">
            <li>You receive an item with a manufacturing defect.</li>
            <li>You receive an incorrect item due to our mistake.</li>
          </ul>
          <p className="terms-paragraph">
            If this happens, please contact us within 7 days of delivery at <a href="mailto:support@jerzeylab.com" className="contact-link">support@jerzeylab.com</a> with your order number, photos of the issue, and a description of the problem.
          </p>
          <p className="terms-paragraph">
            We will review your case and arrange for a replacement or refund if applicable.
          </p>
        </section>

        <section className="terms-section">
          <h2 className="section-title">6. Cancellations</h2>
          <p className="terms-paragraph">
            Orders can only be canceled within 24 hours of placing them. After that period, we cannot guarantee cancellation since the order may already be in processing or production.
          </p>
        </section>

        <section className="terms-section">
          <h2 className="section-title">7. Intellectual Property</h2>
          <p className="terms-paragraph">
            All designs, logos, product images, and website content are the intellectual property of Jerzey Lab and are protected by applicable copyright and trademark laws. Unauthorized use is strictly prohibited.
          </p>
        </section>

        <section className="terms-section">
          <h2 className="section-title">8. Limitation of Liability</h2>
          <p className="terms-paragraph">
            We are not responsible for any indirect, incidental, or consequential damages resulting from the use or inability to use our website or products.
          </p>
        </section>

        <section className="terms-section">
          <h2 className="section-title">9. Governing Law</h2>
          <p className="terms-paragraph">
            These Terms and Conditions shall be governed by and construed in accordance with the laws of the United States. Any disputes shall be handled in the appropriate courts within the U.S.
          </p>
        </section>

        <section className="terms-section">
          <h2 className="section-title">10. Contact Us</h2>
          <p className="terms-paragraph">
            For any questions or concerns, please contact us at:
          </p>
          <ul className="contact-list">
            <li>📧 <a href="mailto:support@jerzeylab.com" className="contact-link">support@jerzeylab.com</a></li>
            <li>🌐 <a href="/" className="contact-link">jerzeylab.com</a></li>
          </ul>
        </section>
      </div>
    </div>
  )
}

export default TermsConditionsPage

