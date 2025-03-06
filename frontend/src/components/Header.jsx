import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const Header = () => {
  const { userData, setUserData, handleLogout } = useAppContext();

  return (
    <>
      <Navbar fixed="top" variant="dark" bg="dark" expand="md">
        <Container fluid>
          <Navbar.Brand className="d-flex align-content-end gap-1">
            <img src="camera.png" alt="app-logo" width={32} height={32} />
            <h2 className="fs-3">Moments</h2>
          </Navbar.Brand>

          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
              <Nav.Link>
                {userData?.firstname ? (
                  <>
                    <div className="text-capitalize">
                      Hi,
                      <span className="pe-1">{userData.firstname}</span>
                      {userData.lastname}
                    </div>
                  </>
                ) : (
                  <span>Login / Signup</span>
                )}
              </Nav.Link>

              {userData?.firstname && (
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
