import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import Button from "../UI/Button";
import styled from "styled-components";
import Input from "../UI/Input";
import { AuthContext } from "../../context/auth-context/auth-context";
import { ModalContext } from "../../context/modal-context/modal-context";
import WrapperCard from "../UI/WrapperCard";

// lazly imports
const Spinner = React.lazy(() => import("../UI/Spinner"));

const FormWrapper = styled.section`
  width: 100vw;
  height: 100vh;
  background: rgb(255, 255, 255);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(153, 171, 232, 1) 100%,
    rgba(55, 91, 210, 0.9671218829328606) 100%
  );
`;

const Line = styled.hr`
  line-height: 1em;
  position: relative;
  outline: 0;
  border: 0;
  color: black;
  text-align: center;
  height: 1.5em;
  opacity: 0.5;
  box-sizing: content-box;
  font-family: inherit;
  font-size: 0.9rem;
  margin-top: 2rem;

  &::before {
    content: "";
    background: linear-gradient(to right, transparent, #818078, transparent);
    position: absolute;
    left: 0;
    top: 50%;
    width: 100%;
    height: 1px;
  }
  &::after {
    content: attr(data-content);
    position: relative;
    display: inline-block;
    color: black;
    padding: 0 0.5em;
    line-height: 1.5em;
    color: #818078;
    background: var(--grayBg);
  }
`;

const FormLogin = styled.form`
  width: 90vw;
  max-width: 25rem;
  border-radius: var(--radius);
  padding: 1rem;
  background-color: #f7f7f7;
  color: var(--grayText);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
  animation: landing 0.8s forwards;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  @media screen and (min-width: 500px) {
    padding: 2.7rem 2.7rem 1rem 2.7rem;
  }

  & h3 {
    font-size: 1.5rem;
    margin-bottom: 2rem;
    text-align: center;
  }

  @media screen and (min-width: 500px) {
    & h3 {
      text-align: left;
    }
  }

  & .form__control {
    margin-bottom: 1rem;
  }

  & .form__control label {
    display: inline-block;
    font-weight: bold;
    padding-bottom: 0.1rem;
    font-size: 1rem;
  }

  & input[name="email"] {
    background-color: ${(props) => props.emailIsValid === false && "salmon"};
    color: ${(props) => props.emailIsValid === false && "black"};
  }

  & input[name="last-name"] {
    background-color: ${(props) => props.lastNameIsValid === false && "salmon"};
    color: ${(props) => props.lastNameIsValid === false && "black"};
  }

  & input[name="first-name"] {
    background-color: ${(props) =>
      props.firstNameIsValid === false && "salmon"};
    color: ${(props) => props.firstNameIsValid === false && "black"};
  }

  & input[name="password"] {
    background-color: ${(props) => props.passwordIsValid === false && "salmon"};
    color: ${(props) => props.passwordIsValid === false && "black"};
  }

  & input[name="email"]:focus {
    background-color: ${(props) => props.emailIsValid === true && "#ebedf5"};
    border: ${(props) =>
      props.emailIsValid === true && "0.05rem solid #abbcf7"};
    box-shadow: ${(props) =>
      props.emailIsValid === true &&
      "0.05rem solid 0 0 1px rgba(57, 87, 189, 0.5)"};
  }

  & input[name="last-name"]:focus {
    background-color: ${(props) => props.lastNameIsValid === true && "#ebedf5"};
    border: ${(props) =>
      props.lastNameIsValid === true && "0.05rem solid #abbcf7"};
    box-shadow: ${(props) =>
      props.lastNameIsValid === true &&
      "0.05rem solid 0 0 1px rgba(57, 87, 189, 0.5)"};
  }

  & input[name="first-name"]:focus {
    background-color: ${(props) =>
      props.firstNameIsValid === true && "#ebedf5"};
    border: ${(props) =>
      props.firstNameIsValid === true && "0.05rem solid #abbcf7"};
    box-shadow: ${(props) =>
      props.firstNameIsValid === true &&
      "0.05rem solid 0 0 1px rgba(57, 87, 189, 0.5)"};
  }

  & input[name="password"]:focus {
    background-color: ${(props) => props.passwordIsValid === true && "#ebedf5"};
    border: ${(props) =>
      props.passwordIsValid === true && "0.05rem solid #abbcf7"};
    box-shadow: ${(props) =>
      props.passwordIsValid === true &&
      "0.05rem solid 0 0 1px rgba(57, 87, 189, 0.5)"};
  }

  & .error__text {
    font-size: 0.75rem;
    letter-spacing: var(--spacing);
    color: salmon;
    padding-top: 0.2rem;
  }

  @keyframes landing {
    0% {
      opacity: 0.3;
    }

    25% {
      opacity: 0.5;
    }

    50% {
      opacity: 0.7;
    }

    75% {
      opacity: 0.9;
    }

    100% {
      opacity: 1;
    }
  }
`;

// =========== REDUCERS =============

// password reducer
const passwordReducer = (state, action) => {
  switch (action.type) {
    case "USER_INPUT": {
      return {
        ...state,
        value: action.val,
        isValid: action.val.trim().length > 5,
      };
    }
    case "INPUT_BLUR": {
      return {
        ...state,
        isValid: state.value.trim().length > 5,
      };
    }

    case "CLEAR_INPUT": {
      return {
        ...state,
        isValid: undefined,
        value: "",
      };
    }
    default:
      return state;
  }
};

// ============== LoginForm Component ==============
const LoginForm = ({ setIsOnLoginPage }) => {
  // form state with useReducer

  const [password, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: undefined,
  });

  // form state with useState
  const [isSigningIn, setIsSigningIn] = useState(true);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isRecoveringPassword, setIsRecoveringPassword] = useState(false);

  const [localEmailInputErrorMessage, setLocalEmailInputErrorMessage] =
    useState(null);
  const [localPasswordInputErrorMessage, setLocalPasswordInputErrorMessage] =
    useState(null);
  const [localLastNameInputErrorMessage, setLocalLastNameInputErrorMessage] =
    useState(null);
  const [localFirstNameInputErrorMessage, setLocalFirstNameInputErrorMessage] =
    useState(null);

  // context
  const {
    loginWithEmailAndPassword,
    isLoading,
    loginWithGoogleHandler,
    recoverPasswordHandler,
    error,
    loginWithFacebookHandler,
    firstName,
    lastName,
    dispatchFirstName,
    dispatchLastName,
    dispatchEmail,
    email,
  } = useContext(AuthContext);
  const { hasError, errorText } = error;

  const { setIsModalVisible, isModalVisible } = useContext(ModalContext);

  // refs
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const lastNameInputRef = useRef();
  const firstNameInputRef = useRef();

  // destructuring
  const { isValid: emailIsValid } = email;
  const { isValid: passwordIsValid } = password;
  const { isValid: lastNameIsValid } = lastName;
  const { isValid: firstNameIsValid } = firstName;

  // sign in button text
  let logInText = "Înregistrare";

  if (isSigningIn && !isRecoveringPassword) {
    logInText = "Autentificare";
  }

  if (isSigningIn && isRecoveringPassword) {
    logInText = "Recuperare parolă";
  }

  // changeEmailHandler
  const changeEmailHandler = (e) => {
    dispatchEmail({ type: "USER_INPUT", val: e.target.value });
  };

  // change lastNameHandler
  const changeLastNameHandler = (e) => {
    dispatchLastName({ type: "USER_INPUT", val: e.target.value });
  };

  // change firstNameHandler
  const changeFirstNameHandler = (e) => {
    dispatchFirstName({ type: "USER_INPUT", val: e.target.value });
  };

  // changePasswordHandler
  const changePasswordHandler = (e) => {
    dispatchPassword({ type: "USER_INPUT", val: e.target.value });
  };

  // onEmailBlue
  const onEmailBlur = () => {
    dispatchEmail({ type: "INPUT_BLUR" });
  };

  // onLastNameBlur
  const onLastNameBlur = () => {
    dispatchEmail({ type: "INPUT_BLUR" });
  };

  // onFirstNameBlue
  const onFirstNameBlur = () => {
    dispatchEmail({ type: "INPUT_BLUR" });
  };

  // onPasswordBlur
  const onPasswordBlur = () => {
    dispatchPassword({ type: "INPUT_BLUR" });
  };

  // Google Authentication
  const googleLoginHandler = (e) => {
    e.stopPropagation();
    loginWithGoogleHandler();
  };

  // signUpHandler
  const signUpHandler = () => {
    setIsSigningUp((prevLoginState) => !prevLoginState);
    setIsSigningIn((prevLoginState) => !prevLoginState);
    setIsRecoveringPassword(false);
  };

  // loginHandler
  const loginHandler = async (e) => {
    e.preventDefault();

    // some basic validation and guard blocks
    if (!emailIsValid) {
      if (email.value.trim().length === 0) {
        setLocalEmailInputErrorMessage(
          "Vă rugăm introduceți o adresă de email."
        );
      } else {
        setLocalEmailInputErrorMessage("Adresa de e-mail invalidă.");
      }
      emailInputRef.current.focus();
      return;
    }

    if (!lastNameIsValid && !isSigningIn) {
      if (lastName.value.trim().length === 0) {
        setLocalLastNameInputErrorMessage("Vă rugăm introduceți numele");
      } else {
        setLocalLastNameInputErrorMessage("Vă rugăm introduceți un nume valid");
      }
      lastNameInputRef.current.focus();
      return;
    }

    if (!firstNameIsValid && !isSigningIn) {
      if (firstName.value.trim().length === 0) {
        setLocalFirstNameInputErrorMessage("Vă rugăm introduceți prenumele");
      } else {
        setLocalFirstNameInputErrorMessage(
          "Vă rugăm introduceți un prenume valid"
        );
      }
      firstNameInputRef.current.focus();
      return;
    }

    if (!passwordIsValid && !isRecoveringPassword) {
      if (password.value.trim().length === 0) {
        setLocalPasswordInputErrorMessage(
          "Vă rugăm introduceți o parolă de minimum 7 caractere."
        );
      } else {
        setLocalPasswordInputErrorMessage(
          "Parola trebuie să conțină minimum 7 caractere."
        );
      }
      passwordInputRef.current.focus();
      return;
    }

    if (
      !passwordIsValid &&
      !isRecoveringPassword &&
      password.value.trim().length === 0
    ) {
      setLocalPasswordInputErrorMessage(
        "Vă rugăm introduceți o parolă de minimum 7 caractere."
      );
      passwordInputRef.current.focus();
      return;
    }

    // check if the current state is the forgot password one
    // and send the forgot password email
    // Note: for now the emails are sent to Spam..
    if (isRecoveringPassword) {
      await recoverPasswordHandler(email.value);
      setIsModalVisible(true);
      return;
    }

    // proceed if form is valid
    await loginWithEmailAndPassword({
      isSigningIn,
      isSigningUp,
      password: password.value,
    });
    // clear fields
    emailInputRef.current.value = "";
    passwordInputRef.current.value = "";
    if (isSigningUp) {
      lastNameInputRef.current.value = "";
      firstNameInputRef.current.value = "";
    }
  };

  // useEffect
  useEffect(() => {
    if (hasError) {
      setIsModalVisible(true);
    }
  }, [hasError, errorText, setIsModalVisible]);

  useEffect(() => {
    setIsOnLoginPage(true);
    // clear fields
    dispatchEmail({ type: "CLEAR_INPUT" });
    dispatchPassword({ type: "CLEAR_INPUT" });
    dispatchFirstName({ type: "CLEAR_INPUT" });
    dispatchLastName({ type: "CLEAR_INPUT" });
  }, []);

  return (
    <FormWrapper>
      {hasError && isModalVisible && (
        <WrapperCard>
          <p>{errorText}</p>
        </WrapperCard>
      )}
      {isModalVisible && !hasError && (
        <WrapperCard>
          <p>
            V-am trimis un email unde sunt detaliați pașii pe care să-i urmați
            pentru recuperarea parolei. Vă rugăm totodată să verificați și în{" "}
            <strong>Spam</strong>{" "}
          </p>
        </WrapperCard>
      )}
      <FormLogin
        onSubmit={loginHandler}
        emailIsValid={email.isValid}
        passwordIsValid={password.isValid}
        lastNameIsValid={lastName.isValid}
        firstNameIsValid={firstName.isValid}
      >
        <div>
          <h3>{logInText}</h3>
        </div>
        {/* Email */}
        <div className="form__control">
          <label htmlFor="email">Email</label>
          <Input
            ref={emailInputRef}
            type="text"
            id="email"
            name="email"
            value={email.value}
            changeHandler={changeEmailHandler}
            placeholder="popescu.andrei@client.com"
            onBlur={onEmailBlur}
          />
          <p className="error__text">
            {!emailIsValid && localEmailInputErrorMessage && (
              <span>{localEmailInputErrorMessage}</span>
            )}
          </p>
        </div>

        {/* Last name */}
        {isSigningUp && !isRecoveringPassword && (
          <>
            <div className="form__control">
              <label htmlFor="last-name">Nume</label>
              <Input
                ref={lastNameInputRef}
                type="text"
                id="last-name"
                name="last-name"
                value={lastName.value}
                changeHandler={changeLastNameHandler}
                onBlur={onLastNameBlur}
              />
              <p className="error__text">
                {!lastNameIsValid && localLastNameInputErrorMessage && (
                  <span>{localLastNameInputErrorMessage}</span>
                )}
              </p>
            </div>
          </>
        )}
        {/* First Name */}
        {isSigningUp && !isRecoveringPassword && (
          <>
            <div className="form__control">
              <label htmlFor="first-name">Prenume</label>
              <Input
                ref={firstNameInputRef}
                type="text"
                id="first-name"
                name="first-name"
                value={firstName.value}
                changeHandler={changeFirstNameHandler}
                onBlur={onFirstNameBlur}
              />
              <p className="error__text">
                {!firstNameIsValid && localFirstNameInputErrorMessage && (
                  <span>{localFirstNameInputErrorMessage}</span>
                )}
              </p>
            </div>
          </>
        )}
        {/* Password */}
        {isRecoveringPassword ? null : (
          <div className="form__control" style={{ marginBottom: "2.2rem" }}>
            <label htmlFor="password">Parolă</label>
            <Input
              ref={passwordInputRef}
              type="password"
              id="password"
              name="password"
              value={password.value}
              changeHandler={changePasswordHandler}
              onBlur={onPasswordBlur}
              title="Vă rugăm introduceți o parolă de minimum 7 caractere"
            />
            <span className="error__text">
              {!passwordIsValid && localPasswordInputErrorMessage && (
                <span>{localPasswordInputErrorMessage}</span>
              )}
            </span>
          </div>
        )}
        {isLoading && <Spinner />}
        {!isLoading && (
          <>
            <section>
              <Button type="submit" disabled={false}>
                {logInText}
              </Button>
              <Line data-content="SAU" />
              <Button
                type="button"
                disabled={false}
                isGoogleBtn={true}
                clickHandler={googleLoginHandler}
              >
                Continuă cu Google
              </Button>
              <Button
                type="button"
                disabled={false}
                isFacebookBtn={true}
                clickHandler={loginWithFacebookHandler}
              >
                Continuă cu Facebook
              </Button>
            </section>
            <footer style={{ marginTop: "1.1rem", fontSize: ".88rem" }}>
              <p className="new__account" onClick={signUpHandler}>
                {!isSigningUp
                  ? "Creați-vă un cont nou"
                  : "Autentificare cu un cont existent"}
              </p>
              {isSigningIn && (
                <p
                  className="forgot__passowrd"
                  onClick={() =>
                    setIsRecoveringPassword((prevState) => !prevState)
                  }
                >
                  {isRecoveringPassword
                    ? "Autentificare cu un cont existent"
                    : "Ați uitat parola?"}
                </p>
              )}
            </footer>
          </>
        )}
      </FormLogin>
    </FormWrapper>
  );
};

export default LoginForm;
