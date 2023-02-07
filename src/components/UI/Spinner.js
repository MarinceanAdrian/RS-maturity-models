import React from "react";
import styled from "styled-components";

const StyledSpinner = styled.div`
  display: block;
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto;
  position: ${props => props.generalSpinner && 'absolute'};
  top: ${props => props.generalSpinner && '50%'};
  left: ${props => props.generalSpinner && '50%'};
  z-index: ${props => props.generalSpinner && '100'};

&:after {
  content: " ";
  display: block;
  border-radius: 50%;
  width: 0;
  height: 0;
  margin: 8px;
  box-sizing: border-box;
  border: 32px solid transparent;
  border-color: var(--mainBlue) transparent var(--mainBlue) transparent;
  animation: lds-hourglass 1.2s infinite;
}
@keyframes lds-hourglass {
  0% {
    transform: rotate(0);
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }
  50% {
    transform: rotate(900deg);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  100% {
    transform: rotate(1800deg);
  }
}

`;

const Spinner = ({generalSpinner = false}) => {
  return <StyledSpinner generalSpinner={generalSpinner}/>
};

export default Spinner;
