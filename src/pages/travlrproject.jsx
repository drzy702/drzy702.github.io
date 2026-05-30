function TravlrProject() {
  return (
    <section className="project-page">
      <h2>Travlr Getaways Full-Stack Web Application</h2>

      <p>
        A full-stack travel booking application built with client-side search, 
        filtering, sorting, JWT authentication, and an admin dashboard for managing 
        trips and bookings. This project helped me develop skills in database-driven 
        applications, secure user access, and full-stack architecture.
      </p>

      <h3>Key Features</h3>
      <ul>
        <li>User login and registration</li>
        <li>JWT-based authentication</li>
        <li>Admin dashboard for managing trips</li>
        <li>Client-side search, filtering, and pagination</li>
        <li>MongoDB booking system</li>
        <li>Duplicate booking prevention</li>
      </ul>

      <h3>Technologies Used</h3>
      <p>MongoDB, Express, Angular, Node.js, JavaScript, HTML, CSS, JWT</p>

      <h3>Screenshots</h3>

      <img src="/images/travlr-login.jpeg" alt="Travlr login page" />
      <img src="/images/travlr-search.jpeg" alt="Travlr search feature" />
      <img src="/images/travlr-booking.png" alt="Travlr booking system" />

      <div className="project-links">
        <a href="https://github.com/drzy702/CS465/tree/main" target="_blank">
          Original Code
        </a>

        <a href="https://github.com/drzy702/CS465/tree/enhancement-3-database" target="_blank">
          Enhanced Code
        </a>
      </div>
    </section>
  );
}

export default TravlrProject;