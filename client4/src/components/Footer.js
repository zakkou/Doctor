import React from 'react'

const Footer = () => {
  return (
    <footer>
      <div className="footer__contact">
        <h3>Contactez-nous</h3>
        <p>Adresse : Tunisie, Tunis, Lac 1053</p>
        <p>Téléphone : +216 29 232 300</p>
        <p>
          Email :{" "}
          <a href="mailto:business@bestconsultingit.com">
            business@bestconsultingit.com
          </a>
        </p>
      </div>
      <div className="footer__bottom">
        <p>&copy; 2024 BestHealthCare. Tous droits réservés.</p>
      </div>
    </footer>
  )
}

export default Footer