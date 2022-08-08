import Link from "next/link";
import classes from "./main-header.module.css";
function MainHeader() {
  return (
    <header className={classes.header}>
      <div className={classes.logo}>
        <Link href="/">NextEvents</Link>
      </div>
      <nav className={classes.navigation}>
        <ul>
          <Link href="/events"> Browse All Events</Link>
        </ul>
      </nav>
    </header>
  );
}

export default MainHeader;
