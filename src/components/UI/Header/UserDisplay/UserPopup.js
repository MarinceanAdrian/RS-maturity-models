import React from "react";
import styled from "styled-components";
import PhotoCardContainer from "./PhotoCardContainer";

const UserPopupContainer = styled.section`
  position: fixed;
  top: 8%;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--grayBg);
  width: 90vw;
  border-radius: var(--radius);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
  z-index: 200;

  @media (min-width: 500px) {
    & {
      left: 100%;
      transform: translateX(-110%);
      width: 20rem;
    }
  }

  & section {
    padding: 1.2rem;
    box-shadow: 0 1px rgba(0, 0, 0, 0.2);
    text-align: center;
    width: 100%;
  }

  & .user-popup__details-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  & .user-popup__details-container p {
    width: 95%;
  }

  & .user-popup__img-container {
    display: grid;
    place-items: center;
  }

  & section:last-child {
    box-shadow: none;
  }
  & section:last-child:hover {
    color: gray;
  }
`;

const UserPopup = ({ signOutHandler, acronym, email, setUserPopupIsOpen }) => {
  return (
    <UserPopupContainer>
      {/* image section */}
      <section className="user-popup__img-container">
        <PhotoCardContainer centered={true} acronym={acronym} />
      </section>
      {/* user details section */}
      <section className="user-popup__details-container">
        <p>Email: {email}</p>
      </section>
      {/* sign out section */}
      <section
        onClick={() => {
          signOutHandler();
          setUserPopupIsOpen(false);
        }}
        style={{ cursor: "pointer" }}
      >
        Deconectare
      </section>
    </UserPopupContainer>
  );
};

export default UserPopup;
