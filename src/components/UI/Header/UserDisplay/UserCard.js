import React, { useContext, Suspense } from "react";
import styled from "styled-components";
import { UserDetailsContext } from "../../../../context/userDetails-context/userDetails-context";
import PhotoCardContainer from "./PhotoCardContainer";

const UserPopup = React.lazy(() => import("./UserPopup"));
const Spinner =  React.lazy(() => import("../../Spinner"));

const UserCardContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
`;
 
const NameSection = styled.section`
    display: none;

  @media (min-width: 1000px) {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  }

  & .user__email {
    color: lightgray;
    font-size: .9rem;
  }
`;

const UserCard = ({ email, signOutHandler, acronym, fullName }) => {
  const { setUserPopupIsOpen, userPopupIsOpen } =
    useContext(UserDetailsContext);

  const toggleUserPopup = () => {
    setUserPopupIsOpen((prevUserPopupState) => !prevUserPopupState);
  };

  return (
    <div>
      <UserCardContainer onClick={toggleUserPopup}>
        <PhotoCardContainer acronym={acronym} />
        <NameSection>
          <span className="user__name">{fullName}</span>
          <span className="user__email">{email}</span>
        </NameSection>
      </UserCardContainer>
      {userPopupIsOpen && (
        <Suspense fallback={<Spinner generalSpinner={true}/>}>
          <UserPopup
            email={email}
            signOutHandler={signOutHandler}
            acronym={acronym}
            setUserPopupIsOpen={setUserPopupIsOpen}
          />
        </Suspense>
      )}
    </div>
  );
};

export default UserCard;
