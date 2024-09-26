'use client'
import React, { useState ,useEffect} from "react";
import { useRouter } from 'next/navigation';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import styles from './Header.module.scss'
import Image from 'next/image';
import { isTokenValid } from "@/helpers/jwt";


interface HeaderProps {
  onNotificationToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNotificationToggle }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const router = useRouter();

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

 
  const handleDashboardNavigation = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isTokenValid()) {
      router.push('/dashboard'); 
    } else {
      alert('log in to access the dashboard.');
      router.push('/login');
    }
  };

  useEffect(() => {
    if (!isTokenValid()) {
      router.push('/login');
    }
  }, [router]);
  return (
    <Navbar className={styles.header} expand="lg">
       <div className={styles.logoContainer}>
       <Image 
          src="/logo.png" 
          className={styles.logo} 
          alt="Logo" 
          width={136} 
          height={27} 
        />
      </div>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className={styles.navContainer}>
        <Nav.Link className={`${styles.navListItem} ${styles.active}`} onClick={handleDashboardNavigation}>Dashboard</Nav.Link>          <Nav.Link className={styles.navListItem} href="#posted-jobs">Posted Jobs</Nav.Link>
          <Nav.Link className={styles.navListItem} href="#agencies">Agencies</Nav.Link>
          <Nav.Link className={styles.navListItem} href="#candidates">Candidates</Nav.Link>
          <Nav.Link className={styles.navListItem} href="#employers">Employers</Nav.Link>
          <NavDropdown title="Reports" className={styles.navListItem}>
              <NavDropdown.Item href="#action/3.1" className={styles.navListItem}>Report Item</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2" className={styles.navListItem}>
              Report Item
              </NavDropdown.Item>
          </NavDropdown>
         
        </Nav>

        <Nav className={styles.rightNavItems}>
          <Nav.Link onClick={onNotificationToggle} className={styles.faBell}>
            <Image src='/bell.png' alt='bell' width={16} height={19}/>
          </Nav.Link>
          <Nav.Link href="#post-job" className={`${styles.postJob} d-flex align-items-center gap-2`}>
          <Image src='/_Upload.png' alt='bell' width={16} height={16}/>

          Post Job
          </Nav.Link>
          

          <NavDropdown 
            title={
              <span className="d-inline-flex align-items-center" style={{ cursor: 'pointer' }}>
                <span className={styles.superAdmin}>Super Admin</span>
              </span>
            }
            id="super-admin-dropdown"
            align="end"
          >
            <NavDropdown.Item href="#my-account">My Account</NavDropdown.Item>
            <NavDropdown.Item href="#logout">Log Out</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
