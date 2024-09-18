import React from 'react';
import "../assets/styles/styles.css";
const HomePage = () => {
  return (
    <>
      
        <header className="header">
          <div className="content">
            <h1>
              <span>Profitez dès maintenant</span>
              <br />
              Services Médicaux
            </h1>
            <p>
              Explorez notre plateforme innovante et découvrez une expérience
              unique. Que vous soyez un professionnel ou un passionné, notre
              application web vous offre des fonctionnalités puissantes pour
              simplifier votre quotidien.
            </p>
          </div>
          <div className="image"> 
            <span className="image__bg"></span>
            <img src="/header-bg.png" alt="header" />
            <div className="image__content image__content__1">
              <span>
                <i className="ri-user-3-line"></i>
              </span>
              <div className="details">
                <h4>400+</h4>
                <p>Clients actifs</p>
              </div>
            </div>
            <div className="image__content image__content__2">
              <ul>
                <li>
                  <span>
                    <i className="ri-check-line"></i>
                  </span>
                  Gérez votre cabinet en toute simplicité avec notre application
                  intuitive et efficace
                </li>
                <li>
                  <span>
                    <i className="ri-check-line"></i>
                  </span>
                  Simplicité et précision au service de votre cabinet
                </li>
              </ul>
            </div>
          </div>
        </header>

        <section className="about">
          <h2>À propos de notre société</h2>
          <div className="about__content">
            <div className="about__text">
              <h3>Qui sommes-nous ?</h3>
              <p>
                Nous sommes <strong>BestConsultingIT</strong>, une entreprise qui
                regroupe des consultants experts spécialisés dans le
                développement de solutions informatiques innovantes. Notre mission
                est de créer des applications web performantes et conviviales qui
                répondent aux besoins spécifiques de nos clients.
              </p>
              <p>
                Avec des années d'expérience et une équipe dédiée de
                professionnels, nous nous engageons à offrir des solutions de
                haute qualité qui simplifient la gestion et optimisent les
                performances.
              </p>
              <br></br>
              <br></br>
              <a href="https://bestconsultingit.com/" className="btn btn--primary">
                Visitez notre site
              </a>
            </div>
          </div>
          <br></br>
          <br></br>
          <div class="about__highlights">
  <h3>Nos Points Forts</h3>
  <ul>
    <li>
      <i class="ri-star-fill"></i> Expertise Technique
    </li>
    <li>
      <i class="ri-star-fill"></i> Innovation Constante
    </li>
    <li>
      <i class="ri-star-fill"></i> Support Client Réactif
    </li>
  </ul>
</div>
        </section>


     
    </>
    // <div>
    //   <h1>Bienvenue sur BestHealthCare</h1>
    //   <p>Explorez notre plateforme innovante pour gérer vos consultations médicales, ordonnances, et rendez-vous en toute simplicité.</p>
    //   <p>Veuillez vous connecter ou créer un compte pour accéder à nos services.</p>
    // </div>
  );
};

export default HomePage;