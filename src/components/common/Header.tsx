'use client'
import React, { useState ,useEffect} from "react";
import { useRouter } from 'next/navigation';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import styles from './Header.module.scss'
import Image from 'next/image';


interface HeaderProps {
  onNotificationToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNotificationToggle }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const router = useRouter();

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const isTokenValid = () => {
    const token = localStorage.getItem('token');
    return token !== null;
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
    if (window.location.pathname === '/dashboard' && !isTokenValid()) {
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
          width={100} 
          height={40} 
        />
      </div>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className={styles.navContainer}>
        <Nav.Link className={styles.navListItem} onClick={handleDashboardNavigation} style={{ color: 'blue' }}>Dashboard</Nav.Link>          <Nav.Link className={styles.navListItem} href="#posted-jobs">Posted Jobs</Nav.Link>
          <Nav.Link className={styles.navListItem} href="#agencies">Agencies</Nav.Link>
          <Nav.Link className={styles.navListItem} href="#candidates">Candidates</Nav.Link>
          <Nav.Link className={styles.navListItem} href="#employers">Employers</Nav.Link>
          
          <Nav.Link className={styles.navListItem} href="#reports">
            <span>Reports</span>
            <i className={`${styles.ReportsDownIcon} fas fa-chevron-down`} style={{ marginLeft: '1px' }}></i>
          </Nav.Link>
        </Nav>

        <Nav className={styles.rightNavItems}>
          <Nav.Link href="#post-job" className={`${styles.postJob} d-flex align-items-center gap-2`}>
            <i className="fas fa-upload"></i> Post Job
          </Nav.Link>
          <Nav.Link onClick={onNotificationToggle} className={styles.faBell}>
            <i className="fas fa-bell"></i>
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
