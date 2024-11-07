import React from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "../routes";

const Header = () => {
  return (
    <Menu style={{ marginTop: "10px" }}>
      <Link route="/">
        <a className="item">Home Page</a>
      </Link>

     

      <Menu.Menu position="right">
        <Link href="/campaigns/booked">
          <a className="item">Booked Flights</a>
        </Link>
      </Menu.Menu>

        
      
    </Menu>
  );
};

export default Header;
