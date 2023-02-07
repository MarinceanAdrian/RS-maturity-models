import React, { useContext } from "react";
import styled from "styled-components";
import { AuthContext } from "../../../context/auth-context/auth-context";
import UserCard from "./UserDisplay/UserCard";
import { MdMenu } from "react-icons/md";
import { UserDetailsContext } from "../../../context/userDetails-context/userDetails-context";

const MainNavigationBar = styled.nav`
  width: 100%;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: black;
  padding: 0 0.7rem 0 0.7rem;
  z-index: 25;
  & svg {
    cursor: pointer;
  }

  @media (width > 700px) {
    padding: 0 4rem 0 1rem;
    position: absolute;
    & svg {
      visibility: hidden;
    }
  }
`;

const Header = ({ isSidebarOpen, setIsSidebarOpen, isOnLoginPage }) => {

  const { fullName, userIsLoggedIn, signOut, email } = useContext(AuthContext);

  const { setUserPopupIsOpen } = useContext(UserDetailsContext);

  let acronym = fullName
    .split(" ")
    .reduce((acc, word) => acc + word.charAt(0), "")
    .toUpperCase();

  const signOutHandler = () => {
    signOut();
  };

  const openSidebarMenuHandler = () => {
    setIsSidebarOpen(true);
    setUserPopupIsOpen(false);
  };
  console.log('header')
  return (
    <MainNavigationBar>
      {!isSidebarOpen && !isOnLoginPage ? (
        <MdMenu
          style={{ fontSize: "1.5rem" }}
          onClick={openSidebarMenuHandler}
        />
      ) : (
        <span></span>
      )}
      {userIsLoggedIn && (
        <UserCard
          signOutHandler={signOutHandler}
          email={email.value}
          acronym={acronym}
          fullName={fullName}
        />
      )}
    </MainNavigationBar>
  );
};

export default Header;
