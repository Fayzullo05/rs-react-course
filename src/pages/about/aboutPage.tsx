import styles from './aboutPage.module.css';

function AboutPage() {
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>About</h1>
      <p className={styles.text}>Author: Fayzullaxon Sharipxanov</p>
      <p className={styles.text}>
        This application was created as task of the RS School React course.
      </p>
      <a
        className={styles.link}
        href="https://rs.school/courses/reactjs"
        target="_blank"
        rel="noreferrer"
      >
        RS School React course
      </a>
    </main>
  );
}

export default AboutPage;
