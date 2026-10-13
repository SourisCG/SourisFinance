import { Link } from "react-router-dom";
import styles from "./link-component.module.css";

export const LinkComponent = (l: string, title: string, description: string) => {
  return (
    <Link to={`${l}`}  className={styles.link}>
      <h3 className={styles.title}>{title}</h3>
      <p>{description}</p>
    </Link>
  )
}