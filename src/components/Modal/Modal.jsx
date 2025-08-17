import { useEffect, useState } from "react";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { login, register, clearError } from "../../redux/slices/authSlice";
import Logo from "../Logo/Logo";
import {
  ModalOverlay,
  ModalContainer,
  StyledForm,
  StyledField,
  ErrorText,
  Button,
  SecondaryButton,
} from "./ModalStyles";

const AuthModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, error } = useSelector((state) => state.auth);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  useEffect(() => {
    if (isAuthenticated) onClose();
  }, [isAuthenticated, onClose]);

  const initialValues = { name: "", email: "", password: "" };

  const validationSchema = Yup.object({
    name: Yup.string().when("isRegisterMode", {
      is: true,
      then: Yup.string().required("Requerido"),
    }),
    email: Yup.string().email("Email inválido").required("Requerido"),
    password: Yup.string().min(6, "Mínimo 6 caracteres").required("Requerido"),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    if (isRegisterMode) {
      dispatch(register(values));
    } else {
      dispatch(login(values));
    }
    setSubmitting(false);
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Logo />

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
          initialErrors={{}}
          initialTouched={{}}
          validateOnMount
          validateOnChange
          validateOnBlur
          context={{ isRegisterMode }}
        >
          {({ isSubmitting }) => (
            <StyledForm>
              {isRegisterMode && (
                <div>
                  <StyledField type="text" name="name" placeholder="Nombre" />
                  <ErrorMessage name="name" component={ErrorText} />
                </div>
              )}

              <div>
                <StyledField
                  type="email"
                  name="email"
                  placeholder="Correo electrónico"
                />
                <ErrorMessage name="email" component={ErrorText} />
              </div>

              <div>
                <StyledField
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                />
                <ErrorMessage name="password" component={ErrorText} />
              </div>

              {error && <ErrorText>{error}</ErrorText>}

              <Button type="submit" disabled={isSubmitting}>
                {isRegisterMode ? "Registrarse" : "Iniciar sesión"}
              </Button>

              <SecondaryButton
                type="button"
                onClick={() => {
                  setIsRegisterMode(!isRegisterMode);
                  dispatch(clearError());
                }}
              >
                {isRegisterMode
                  ? "¿Ya tenés cuenta? Iniciar sesión"
                  : "¿No tenés cuenta? Registrate"}
              </SecondaryButton>
            </StyledForm>
          )}
        </Formik>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default AuthModal;

