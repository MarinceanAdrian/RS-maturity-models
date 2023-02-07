import styled from "styled-components";
const PhotoContainer = styled.div`
  border-radius: 100%;
  background-color: ${(props) => props.centered ? '#ccc': '#F5F8FA'};
  width: 2.5rem;
  height: 2.5rem;
  position: relative;

  & span {
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;
const PhotoCardContainer = ({acronym, centered}) => {

  return (
    <PhotoContainer centered={centered}>
      <span>{acronym}</span>
    </PhotoContainer>
  );
};

export default PhotoCardContainer;
